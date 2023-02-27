// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import {VRFV2WrapperConsumerBase} from "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";
import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {ERC677ReceiverInterface} from "@chainlink/contracts/src/v0.8/interfaces/ERC677ReceiverInterface.sol";
import {VRFV2WrapperInterface} from "@chainlink/contracts/src/v0.8/interfaces/VRFV2WrapperInterface.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {IRaffleManager} from "@src/interfaces/IRaffleManager.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {UD60x18, ud, intoUint256} from "@prb/math/UD60x18.sol";

/**
 * @title Raffle Manager
 * @notice Creates a mechanism for users to create and participate in raffles
 */
contract RaffleManager is
    IRaffleManager,
    VRFV2WrapperConsumerBase,
    AutomationCompatibleInterface,
    ERC677ReceiverInterface,
    Pausable,
    ReentrancyGuard
{
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;
    using MerkleProof for bytes32[];

    Counters.Counter public raffleCounter;
    RequestConfig public requestConfig;
    VRFV2WrapperInterface public vrfWrapper;
    address public owner;
    address public keeperRegistryAddress;
    address public linkTokenAddress;
    uint256[] public stagedRaffles;
    EnumerableSet.UintSet private liveRaffles;
    mapping(uint256 => RaffleInstance) public raffles;
    mapping(uint256 => uint256) public requestIdToRaffleIndex;
    mapping(address => mapping(uint256 => uint8)) internal userEntries;

    // ------------------- STRUCTS -------------------
    enum RaffleState {
        STAGED,
        LIVE,
        FINISHED,
        RESOLVING
    }
    enum RaffleType {
        DYNAMIC,
        STATIC
    }

    struct RaffleInstance {
        RaffleBase base;
        address owner;
        string raffleName;
        bytes32[] contestants;
        bytes32[] winners;
        UD60x18 prizeWorth;
        RequestStatus requestStatus;
        uint256 timeLength;
        uint256 fee;
        RaffleState raffleState;
        Prize prize;
        bool paymentNeeded;
        bytes32 merkleRoot;
    }

    struct RaffleBase {
        RaffleType raffleType;
        uint256 id;
        bool automation;
        bool feeToken;
        address feeTokenAddress;
        uint256 startDate;
        bool permissioned;
        uint8 totalWinners;
        bytes provenanceHash;
        uint8 entriesPerUser;
    }

    struct RequestStatus {
        uint256 requestId;
        uint256 paid;
        bool fulfilled;
        uint256[] randomWords;
        uint256 totalLink;
        bool withdrawn;
    }

    struct Prize {
        string prizeName;
        bytes32[] claimedPrizes;
    }

    struct RequestConfig {
        uint32 callbackGasLimit;
        uint16 requestConfirmations;
        uint32 numWords;
    }

    //------------------------------ EVENTS ----------------------------------
    event RaffleCreated(string prize, uint256 indexed time, uint256 indexed fee, address feeToken, bool permissioned);
    event RaffleJoined(uint256 indexed raffleId, bytes32 indexed player, uint256 entries);
    event RaffleClosed(uint256 indexed raffleId, bytes32[] participants);
    event RaffleStaged(uint256 indexed raffleId);
    event RaffleWon(uint256 indexed raffleId, bytes32[] indexed winners);
    event RafflePrizeClaimed(uint256 indexed raffleId, address indexed winner, uint256 value);
    event KeeperRegistryAddressUpdated(address oldAddress, address newAddress);
    event RaffleOwnerUpdated(uint256 indexed raffleId, address oldOwner, address newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyRaffleOwner(uint256 raffleId) {
        require(raffles[raffleId].owner == msg.sender);
        _;
    }

    modifier onlyKeeperRegistry() {
        if (msg.sender != keeperRegistryAddress) {
            revert OnlyKeeperRegistry();
        }
        _;
    }

    // ------------------- ERRORS -------------------
    error OnlyKeeperRegistry();

    constructor(
        address wrapperAddress,
        uint16 requestConfirmations,
        uint32 callbackGasLimit,
        address keeperAddress,
        address linkAddress
    ) VRFV2WrapperConsumerBase(linkAddress, wrapperAddress) {
        require(keeperAddress != address(0), "Keeper Registry address cannot be 0x0");
        require(linkAddress != address(0), "Link Token address cannot be 0x0");
        require(wrapperAddress != address(0), "Wrapper address cannot be 0x0");
        owner = msg.sender;
        vrfWrapper = VRFV2WrapperInterface(wrapperAddress);
        linkTokenAddress = linkAddress;
        requestConfig =
            RequestConfig({callbackGasLimit: callbackGasLimit, requestConfirmations: requestConfirmations, numWords: 1});
        setKeeperRegistryAddress(keeperAddress);
    }

    // ------------------- EXTERNAL FUNCTIONS -------------------

    /**
     * @notice creates new raffle
     * @param prizeName string of name of prize
     * @param timeLength time length of raffle in seconds
     * @param fee fee to enter raffle in wei
     * @param name name of raffle
     * @param feeToken address of token to use for fee. If 0x0, Gas token will be used
     * @param merkleRoot merkle root for permissioned raffle
     * @param automation whether raffle is using Chainlink Automations
     * @param participants array of participants for static raffle
     * @param totalWinners number of winners for raffle
     * @param entriesPerUser number of entries per user
     *
     */
    function createRaffle(
        string memory prizeName,
        uint256 timeLength,
        uint256 fee,
        string memory name,
        address feeToken,
        bytes32 merkleRoot,
        bool automation,
        bytes32[] memory participants,
        uint8 totalWinners,
        uint8 entriesPerUser
    ) external payable whenNotPaused {
        RaffleInstance memory newRaffle = RaffleInstance({
            base: RaffleBase({
                raffleType: participants.length > 0 ? RaffleType.STATIC : RaffleType.DYNAMIC,
                id: raffleCounter.current(),
                automation: automation,
                feeToken: feeToken != address(0) ? true : false,
                feeTokenAddress: feeToken,
                startDate: block.timestamp,
                permissioned: merkleRoot != bytes32(0) ? true : false,
                totalWinners: totalWinners,
                provenanceHash: new bytes(0),
                entriesPerUser: entriesPerUser
            }),
            owner: msg.sender,
            raffleName: name,
            contestants: participants.length > 0 ? participants : new bytes32[](0),
            winners: new bytes32[](0),
            prizeWorth: ud(msg.value),
            timeLength: timeLength,
            fee: fee,
            raffleState: RaffleState.LIVE,
            prize: Prize({prizeName: prizeName, claimedPrizes: new bytes32[](0)}),
            paymentNeeded: fee == 0 ? false : true,
            merkleRoot: merkleRoot,
            requestStatus: RequestStatus({
                requestId: 0,
                paid: 0,
                fulfilled: false,
                randomWords: new uint256[](0),
                totalLink: 0,
                withdrawn: false
            })
        });
        raffles[raffleCounter.current()] = newRaffle;
        liveRaffles.add(raffleCounter.current());
        raffleCounter.increment();
        emit RaffleCreated(prizeName, timeLength, fee, feeToken, merkleRoot != bytes32(0) ? true : false);
    }

    /**
     * @notice joins raffle by ID and number of entries
     * @param raffleId id of raffle
     * @param entries number of entries
     * @param proof merkle proof
     * @dev requires that raffle is live and that enough gas token/user token is sent to cover fee
     * @dev if raffle is permissioned, proof must be provided
     *
     */
    function enterRaffle(uint256 raffleId, uint8 entries, bytes32[] memory proof) external payable nonReentrant {
        require(raffles[raffleId].raffleState == RaffleState.LIVE, "Raffle is not live");
        require(raffles[raffleId].base.raffleType == RaffleType.DYNAMIC, "Cannot enter static raffle");
        require(entries > 0 && entries <= raffles[raffleId].base.entriesPerUser, "Too many entries");
        require(
            userEntries[msg.sender][raffleId] + entries <= raffles[raffleId].base.entriesPerUser, "Too many entries"
        );
        bytes32 _userHash = keccak256(abi.encodePacked(msg.sender));
        if (raffles[raffleId].base.permissioned) {
            require(proof.verify(raffles[raffleId].merkleRoot, _userHash), "Not authorized");
        }
        if (raffles[raffleId].paymentNeeded && raffles[raffleId].base.feeToken) {
            IERC20(raffles[raffleId].base.feeTokenAddress).safeTransferFrom(
                msg.sender, address(this), (raffles[raffleId].fee * entries)
            );
            raffles[raffleId].prizeWorth = raffles[raffleId].prizeWorth.add(ud(raffles[raffleId].fee * entries));
        } else if (raffles[raffleId].paymentNeeded) {
            require(msg.value >= (raffles[raffleId].fee * entries), "Not enough gas token to join raffle");
            raffles[raffleId].prizeWorth = raffles[raffleId].prizeWorth.add(ud(msg.value));
        }
        for (uint256 i = 0; i < entries; i++) {
            raffles[raffleId].contestants.push(_userHash);
        }
        userEntries[msg.sender][raffleId] += entries;
        emit RaffleJoined(raffleId, _userHash, entries);
    }

    /**
     * @notice gets the winner of a specific raffle
     * @param raffleId id of the raffle
     * @return address of the winner
     *
     */
    function getWinners(uint256 raffleId) external view returns (bytes32[] memory) {
        return raffles[raffleId].winners;
    }

    /**
     * @notice claims prize for a specific raffle
     * @param raffleId id of the raffle
     * @dev requires that raffle is finished and that the caller is the winner
     *
     */
    function claimPrize(uint256 raffleId) external nonReentrant {
        require(raffles[raffleId].raffleState == RaffleState.FINISHED, "Raffle is not finished");
        require(intoUint256(raffles[raffleId].prizeWorth) > 0, "No prize to claim");
        bytes32 _claimer = keccak256(abi.encodePacked(msg.sender));
        bool eligible = false;
        for (uint256 i = 0; i < raffles[raffleId].winners.length; i++) {
            if (raffles[raffleId].winners[i] == _claimer) {
                eligible = true;
                break;
            }
        }
        require(eligible, "You are not eligible to claim this prize");
        for (uint256 i = 0; i < raffles[raffleId].prize.claimedPrizes.length; i++) {
            require(raffles[raffleId].prize.claimedPrizes[i] != _claimer, "Prize already claimed");
        }
        // total claimable based on total prize pool divided by total winners using fixed point math
        uint256 _total = intoUint256(raffles[raffleId].prizeWorth.div(ud(raffles[raffleId].base.totalWinners * 1e18)));
        if (raffles[raffleId].base.feeToken) {
            // custom token transfer
            raffles[raffleId].prize.claimedPrizes.push(_claimer);
            emit RafflePrizeClaimed(raffleId, msg.sender, _total);
            IERC20(raffles[raffleId].base.feeTokenAddress).safeTransfer(msg.sender, _total);
        } else if (raffles[raffleId].fee > 0) {
            // gas token transfer
            raffles[raffleId].prize.claimedPrizes.push(_claimer);
            emit RafflePrizeClaimed(raffleId, msg.sender, _total);
            (bool success,) = msg.sender.call{value: _total}("");
            require(success, "Transfer failed.");
        }
    }

    /**
     * @notice picks random raffle winner
     * @dev Uses Chainlink VRF direct funding to generate random number paid by raffle owner.
     *
     */
    function onTokenTransfer(address sender, uint256 value, bytes calldata raffleId) external {
        uint256 _raffle = abi.decode(raffleId, (uint256));
        require(sender == raffles[_raffle].owner, "Only owner can pick winner");
        require(_eligableToEnd(_raffle), "Not enough contestants to pick winner");
        require(raffles[_raffle].raffleState != RaffleState.FINISHED, "Raffle is already finished");
        _pickWinner(_raffle, value);
    }

    /**
     * @notice checks status of contract
     * @return bool paused status
     *
     */
    function isPaused() external view returns (bool) {
        return paused();
    }

    /**
     * @notice get raffle by ID
     * @param raffleId raffle id
     * @return raffle instance
     *
     */
    function getRaffle(uint256 raffleId) external view returns (RaffleInstance memory) {
        return raffles[raffleId];
    }

    /**
     * @notice get all raffles
     * @return RaffleInstance[] of all raffles
     *
     */
    function getAllRaffles() external view returns (RaffleInstance[] memory) {
        RaffleInstance[] memory _raffles = new RaffleInstance[](
            raffleCounter.current()
        );
        for (uint256 i = 0; i < raffleCounter.current(); i++) {
            _raffles[i] = raffles[i];
        }
        return _raffles;
    }

    /**
     * @notice get all owner raffles
     * @param raffleOwner address of the raffle owner
     * @return RaffleInstance[] of all owner raffles
     *
     */
    function getOwnerRaffles(address raffleOwner) external view returns (RaffleInstance[] memory) {
        uint256 _index = 0;
        for (uint256 i = 0; i < raffleCounter.current(); i++) {
            if (raffles[i].owner == raffleOwner) {
                _index++;
            }
        }
        RaffleInstance[] memory _raffles = new RaffleInstance[](_index);
        uint256 _index2 = 0;
        for (uint256 i = 0; i < raffleCounter.current(); i++) {
            if (raffles[i].owner == raffleOwner) {
                _raffles[_index2] = raffles[i];
                _index2++;
            }
        }
        return _raffles;
    }

    /**
     * @notice get amount of entries for a user in a specific raffle
     * @param raffleId id of the raffle
     * @param user address of the user
     * @return uint256 amount of entries
     * @dev user is the msg.sender
     *
     */
    function getUserEntries(uint256 raffleId, address user) external view returns (uint256) {
        uint256 userEntriesCount = 0;
        for (uint256 i = 0; i < raffles[raffleId].contestants.length; i++) {
            if (raffles[raffleId].contestants[i] == keccak256(abi.encodePacked(user))) {
                userEntriesCount++;
            }
        }

        return userEntriesCount;
    }

    /**
     * @notice update admin of a specific raffle
     * @param raffleId id of the raffle
     * @param newAdmin address of the new admin
     *
     */
    function updateRaffleOwner(uint256 raffleId, address newAdmin) external onlyRaffleOwner(raffleId) {
        raffles[raffleId].owner = newAdmin;
        emit RaffleOwnerUpdated(raffleId, msg.sender, newAdmin);
    }

    /**
     * @notice withdraw unspent LINK from raffle
     * @param raffleId id of the raffle
     * @dev must be owner of raffle to withdraw LINK from raffle instance
     */
    function withdrawLink(uint256 raffleId) external onlyRaffleOwner(raffleId) nonReentrant {
        require(!raffles[raffleId].requestStatus.withdrawn, "Already withdrawn");
        IERC20 link = IERC20(linkTokenAddress);
        uint256 claimable = raffles[raffleId].requestStatus.totalLink - raffles[raffleId].requestStatus.paid;
        require(claimable > 0, "Nothing to claim");
        raffles[raffleId].requestStatus.withdrawn = true;
        link.safeTransfer(msg.sender, claimable);
    }

    /**
     * @notice returns the amount of claimable LINK for a specific raffle
     * @param raffleId id of the raffle
     * @return claimable amount of claimable LINK
     * @dev claimable LINK is the total LINK sent to the raffle minus the amount already paid on VRF fees
     *
     */
    function claimableLink(uint256 raffleId) external view returns (uint256 claimable) {
        if (raffles[raffleId].requestStatus.withdrawn) {
            return 0;
        }
        claimable = raffles[raffleId].requestStatus.totalLink - raffles[raffleId].requestStatus.paid;
    }

    // ------------------- INTERNAL FUNCTIONS -------------------

    /**
     * @notice closes raffle and picks winner
     * @param raffleId id of raffle
     * @dev requests random number from VRF and marks raffle as finished
     *
     */
    function _pickWinner(uint256 raffleId, uint256 value) internal {
        raffles[raffleId].requestStatus.totalLink += value;
        raffles[raffleId].raffleState = RaffleState.RESOLVING;
        _requestRandomWords(raffleId, value);

        emit RaffleClosed(raffleId, raffles[raffleId].contestants);
    }

    /**
     * @notice withdraws rewards for an account
     * @param randomValue random value generated by VRF
     * @param amount amount of raffle entries
     *
     */
    function _pickRandom(uint256 randomValue, uint256 amount, uint256 raffleId)
        internal
        view
        returns (uint256[] memory)
    {
        uint256[] memory winners = new uint256[](
            raffles[raffleId].base.totalWinners
        );
        uint256 _amount = amount;
        for (uint256 i = 0; i < winners.length; i++) {
            uint256 v = uint256(keccak256(abi.encode(randomValue, 0)));

            winners[i] = uint256(v % _amount) + 1;
            _amount--;
        }

        return winners;
    }

    /**
     * @notice Updates live raffles array when one finishes.
     */
    function _updateLiveRaffles(uint256 _index) internal {
        liveRaffles.remove(_index);
    }

    function _requestRandomWords(uint256 raffleId, uint256 value) internal returns (uint256 requestId) {
        requestId = requestRandomness(
            requestConfig.callbackGasLimit, requestConfig.requestConfirmations, requestConfig.numWords
        );
        emit RaffleStaged(raffleId);
        requestIdToRaffleIndex[requestId] = raffleId;
        raffles[raffleId].requestStatus = RequestStatus({
            requestId: requestId,
            paid: vrfWrapper.calculateRequestPrice(requestConfig.callbackGasLimit),
            randomWords: new uint256[](0),
            fulfilled: false,
            totalLink: value,
            withdrawn: false
        });

        return requestId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 raffleIndexFromRequestId = requestIdToRaffleIndex[requestId];
        raffles[raffleIndexFromRequestId].requestStatus.randomWords = randomWords;
        raffles[raffleIndexFromRequestId].requestStatus.fulfilled = true;
        _updateLiveRaffles(raffleIndexFromRequestId);
        uint256[] memory winners =
            _pickRandom(randomWords[0], raffles[raffleIndexFromRequestId].contestants.length, raffleIndexFromRequestId);
        for (uint256 i = 0; i < winners.length; i++) {
            raffles[raffleIndexFromRequestId].winners.push(
                raffles[raffleIndexFromRequestId].contestants[winners[i] - 1]
            );
        }

        raffles[raffleIndexFromRequestId].raffleState = RaffleState.FINISHED;
        emit RaffleWon(raffleIndexFromRequestId, raffles[raffleIndexFromRequestId].winners);
    }

    /**
     * @dev used if automation is set to true for raffle.
     * @dev user will need to set up an upkeep and include the raffle ID in the checkData
     *
     */
    function checkUpkeep(bytes calldata checkData)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        uint256 raffleId = abi.decode(checkData, (uint256));
        if (raffles[raffleId].raffleState == RaffleState.LIVE && raffles[raffleId].base.automation) {
            upkeepNeeded = (block.timestamp - raffles[raffleId].base.startDate) > raffles[raffleId].timeLength;
        }
        performData = checkData;
    }

    /**
     * @dev used if automation is set to true for raffle.
     * @dev will stage the raffle if the time has passed and allow for owner to call VRF
     *
     */
    function performUpkeep(bytes calldata performData) external override onlyKeeperRegistry {
        uint256 raffleId = abi.decode(performData, (uint256));

        if (raffles[raffleId].raffleState == RaffleState.LIVE && raffles[raffleId].base.automation) {
            if ((block.timestamp - raffles[raffleId].base.startDate) > raffles[raffleId].timeLength) {
                raffles[raffleId].raffleState == RaffleState.STAGED;
                emit RaffleStaged(liveRaffles.at(raffleId));
            }
        }
    }

    /**
     * @notice checks if raffle is eligable to end
     * @param raffleId id of the raffle
     * @return bool eligable to end
     * @dev eligable to end is when the amount of contestants is greater than or equal to the amount of winners
     * @dev this is used so there is not a div/modulo by 0 error
     *
     */
    function _eligableToEnd(uint256 raffleId) internal view returns (bool) {
        return raffles[raffleId].contestants.length >= raffles[raffleId].base.totalWinners;
    }

    // ------------------- OWNER FUNCTIONS -------------------

    /**
     * @notice Sets the keeper registry address.
     */
    function setKeeperRegistryAddress(address newKeeperAddress) public onlyOwner {
        require(newKeeperAddress != address(0));
        keeperRegistryAddress = newKeeperAddress;
        emit KeeperRegistryAddressUpdated(keeperRegistryAddress, newKeeperAddress);
    }

    function setProvenanceHash(uint256 raffleId, bytes memory provenanceHash) external onlyRaffleOwner(raffleId) {
        require(raffles[raffleId].base.provenanceHash.length == 0, "provenance hash already set");

        raffles[raffleId].base.provenanceHash = provenanceHash;
    }

    /**
     * @notice updates the callback gas limit
     * @param newGasLimit new gas limit
     * @dev this is used to update the gas limit if the VRF contract is updated
     */
    function updateCallBackGasLimit(uint32 newGasLimit) external onlyOwner {
        requestConfig.callbackGasLimit = newGasLimit;
    }
}
