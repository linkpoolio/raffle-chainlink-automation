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

/**
 * @title Raffle Manager
 * @notice Creates a mechanism for users to create and participate in raffles
 */
contract RaffleManager is VRFV2WrapperConsumerBase, AutomationCompatibleInterface, ERC677ReceiverInterface {
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
        FINISHED
    }
    enum RaffleType {
        DYNAMIC,
        STATIC
    }

    struct RaffleInstance {
        RaffleBase base;
        address owner;
        bytes32 raffleName;
        bytes32[] contestantsAddresses;
        bytes32[] winners;
        uint256 prizeWorth;
        RequestStatus requestStatus;
        uint256 timeLength;
        uint256 fee;
        RaffleState raffleState;
        Prize prize;
        bool paymentNeeded;
        bytes32 merkleRoot;
        uint256 linkTotal;
    }

    struct RaffleBase {
        RaffleType raffleType;
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
    event RaffleCreated(bytes prize, uint256 indexed time, uint256 indexed fee, address feeToken, bool permissioned);
    event RaffleJoined(uint256 indexed raffleId, bytes32 indexed player, uint256 entries);
    event RaffleClosed(uint256 indexed raffleId, bytes32[] participants);
    event RaffleStaged(uint256 indexed raffleId);
    event RaffleWon(uint256 indexed raffleId, bytes32[] indexed winner);
    event RafflePrizeClaimed(uint256 indexed raffleId, address indexed winner, uint256 value);
    event KeeperRegistryAddressUpdated(address oldAddress, address newAddress);

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
        owner = msg.sender;
        vrfWrapper = VRFV2WrapperInterface(wrapperAddress);
        linkTokenAddress = linkAddress;
        requestConfig =
            RequestConfig({callbackGasLimit: callbackGasLimit, requestConfirmations: requestConfirmations, numWords: 1});
        setKeeperRegistryAddress(keeperAddress);
    }

    /**
     * @notice creates new raffle
     * @param prize prize struct
     * @param timeLength time length of raffle in seconds
     * @param fee fee to enter raffle in wei
     * @param name name of raffle
     * @param feeToken address of token to use for fee. If 0x0, Gas token will be used
     * @param merkleRoot merkle root for permissioned raffle
     * @param automation whether raffle is using Chainlink Automations
     * @param participants array of participants for static raffle
     * @param totalWinners number of winners for raffle
     *
     */
    function createRaffle(
        bytes memory prize,
        uint256 timeLength,
        uint256 fee,
        bytes32 name,
        address feeToken,
        bytes32 merkleRoot,
        bool automation,
        bytes32[] memory participants,
        uint8 totalWinners,
        uint8 entriesPerUser
    ) external payable {
        RaffleInstance memory newRaffle = RaffleInstance({
            base: RaffleBase({
                raffleType: participants.length > 0 ? RaffleType.STATIC : RaffleType.DYNAMIC,
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
            contestantsAddresses: participants.length > 0 ? participants : new bytes32[](0),
            winners: new bytes32[](0),
            prizeWorth: msg.value,
            timeLength: timeLength,
            fee: fee,
            raffleState: RaffleState.LIVE,
            prize: Prize({prizeName: string(prize), claimedPrizes: new bytes32[](0)}),
            paymentNeeded: fee == 0 ? false : true,
            merkleRoot: merkleRoot,
            linkTotal: 0,
            requestStatus: RequestStatus({requestId: 0, paid: 0, fulfilled: false, randomWords: new uint256[](0)})
        });
        raffles[raffleCounter.current()] = newRaffle;
        liveRaffles.add(raffleCounter.current());
        emit RaffleCreated(prize, timeLength, fee, feeToken, merkleRoot != bytes32(0) ? true : false);
        raffleCounter.increment();
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
    function enterRaffle(uint256 raffleId, uint8 entries, bytes32[] memory proof) external payable {
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
        } else if (raffles[raffleId].paymentNeeded) {
            require(msg.value >= (raffles[raffleId].fee * entries), "Not enough ETH to join raffle");
        }
        for (uint256 i = 0; i < entries; i++) {
            raffles[raffleId].contestantsAddresses.push(_userHash);
        }
        userEntries[msg.sender][raffleId] += entries;
        emit RaffleJoined(raffleId, _userHash, entries);
    }

    /**
     * @notice closes raffle and picks winner
     * @param raffleId id of raffle
     * @dev requests random number from VRF and marks raffle as finished
     *
     */
    function _pickWinner(uint256 raffleId, uint256 value) internal {
        raffles[raffleId].linkTotal += value;
        raffles[raffleId].raffleState = RaffleState.FINISHED;
        _requestRandomWords(raffleId);

        emit RaffleClosed(raffleId, raffles[raffleId].contestantsAddresses);
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
        uint256[] memory winners = new uint256[](raffles[raffleId].base.totalWinners);
        uint256 _amount = amount;
        for (uint256 i = 0; i < raffles[raffleId].winners.length; i++) {
            uint256 v = uint256(keccak256(abi.encode(randomValue, 0)));
            winners[i] = uint256(v % _amount) + 1;
            _amount--;
        }

        return winners;
    }

    function _requestRandomWords(uint256 raffleId) internal returns (uint256 requestId) {
        requestId = requestRandomness(
            requestConfig.callbackGasLimit, requestConfig.requestConfirmations, requestConfig.numWords
        );
        requestIdToRaffleIndex[requestId] = raffleId;
        raffles[raffleId].requestStatus = RequestStatus({
            requestId: requestId,
            paid: vrfWrapper.calculateRequestPrice(requestConfig.callbackGasLimit),
            randomWords: new uint256[](0),
            fulfilled: false
        });

        return requestId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 raffleIndexFromRequestId = requestIdToRaffleIndex[requestId];
        raffles[raffleIndexFromRequestId].requestStatus.randomWords = randomWords;
        _updateLiveRaffles(raffleIndexFromRequestId);
        uint256[] memory winners = _pickRandom(
            randomWords[0], raffles[raffleIndexFromRequestId].contestantsAddresses.length, raffleIndexFromRequestId
        );
        for (uint256 i = 0; i < winners.length; i++) {
            raffles[raffleIndexFromRequestId].winners.push(
                raffles[raffleIndexFromRequestId].contestantsAddresses[winners[i] - 1]
            );
        }
        raffles[raffleIndexFromRequestId].raffleState = RaffleState.FINISHED;
        emit RaffleWon(raffleIndexFromRequestId, raffles[raffleIndexFromRequestId].winners);
    }

    /**
     * @notice claims prize for a specific raffle
     * @param raffleId id of the raffle
     * @dev requires that raffle is finished and that the caller is the winner
     *
     */
    function claimPrize(uint256 raffleId) external {
        require(raffles[raffleId].raffleState == RaffleState.FINISHED, "Raffle is not finished");
        bytes32 _claimer = keccak256(abi.encodePacked(msg.sender));
        for (uint256 i = 0; i < raffles[raffleId].winners.length; i++) {
            require(raffles[raffleId].winners[i] != _claimer, "You are not the winner of this raffle");
        }
        for (uint256 i = 0; i < raffles[raffleId].prize.claimedPrizes.length; i++) {
            require(raffles[raffleId].prize.claimedPrizes[i] != _claimer, "You have already claimed your prize");
        }

        if (raffles[raffleId].base.feeToken) {
            IERC20(raffles[raffleId].base.feeTokenAddress).safeTransfer(msg.sender, raffles[raffleId].prizeWorth);
            raffles[raffleId].prize.claimedPrizes.push(_claimer);
        } else {
            payable(msg.sender).transfer(raffles[raffleId].prizeWorth);
            raffles[raffleId].prize.claimedPrizes.push(_claimer);
        }
        emit RafflePrizeClaimed(raffleId, msg.sender, raffles[raffleId].prizeWorth);
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
     * @notice Updates live raffles array when one finishes.
     */
    function _updateLiveRaffles(uint256 _index) internal {
        liveRaffles.remove(_index);
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
        RaffleInstance[] memory _raffles = new RaffleInstance[](raffleCounter.current());
        for (uint256 i = 0; i < raffleCounter.current(); i++) {
            _raffles[i] = raffles[i];
        }
        return _raffles;
    }

    /**
     * @notice get all owner raffles
     * @return RaffleInstance[] of all owner raffles
     *
     */
    function getOwnerRaffles() external view returns (RaffleInstance[] memory) {
        RaffleInstance[] memory _raffles = new RaffleInstance[](raffleCounter.current());
        uint256 _index = 0;
        for (uint256 i = 0; i < raffleCounter.current(); i++) {
            if (raffles[i].owner == msg.sender) {
                _raffles[_index] = raffles[i];
                _index++;
            }
        }
        return _raffles;
    }

    /**
     * @notice get amount of entries for a user in a specific raffle
     * @param raffleId id of the raffle
     * @return uint256 amount of entries
     * @dev user is the msg.sender
     *
     */
    function getUserEntries(uint256 raffleId) external view returns (uint256) {
        uint256 userEntriesCount = 0;
        for (uint256 i = 0; i < raffles[raffleId].contestantsAddresses.length; i++) {
            if (raffles[raffleId].contestantsAddresses[i] == keccak256(abi.encodePacked(msg.sender))) {
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
    }

    // TODO: still needs to be worked on
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(linkTokenAddress);
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }

    /**
     * @notice picks random raffle winner
     * @dev Uses Chainlink VRF direct funding to generate random number paid by raffle owner.
     *
     */
    function onTokenTransfer(address sender, uint256 value, bytes calldata raffleId) external {
        uint256 _raffle = abi.decode(raffleId, (uint256));
        require(sender == raffles[_raffle].owner, "Only owner can pick winner");
        require(value >= requestConfig.callbackGasLimit, "Not enough LINK sent to pay for gas");
        _pickWinner(_raffle, value);
    }
}
