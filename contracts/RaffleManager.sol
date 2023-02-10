// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import {VRFV2WrapperConsumerBase} from "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {ERC677ReceiverInterface} from "@chainlink/contracts/src/v0.8/interfaces/ERC677ReceiverInterface.sol";
import {VRFV2WrapperInterface} from "@chainlink/contracts/src/v0.8/interfaces/VRFV2WrapperInterface.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/**
 * @title Raffle Manager
 * @notice Creates a mechanism for users to create and participate in raffles
 */
contract RaffleManager is VRFV2WrapperConsumerBase, AutomationCompatibleInterface, ERC677ReceiverInterface {
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;

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
    mapping(uint256 => Prize[]) public prizes;

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
        address[] contestantsAddresses;
        address winner;
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
    }

    struct RequestStatus {
        uint256 requestId;
        uint256 paid;
        bool fulfilled;
        uint256[] randomWords;
    }

    struct Prize {
        string prizeName;
        bool claimed;
    }

    struct RequestConfig {
        uint32 callbackGasLimit;
        uint16 requestConfirmations;
        uint32 numWords;
        bytes32 keyHash;
    }

    //------------------------------ EVENTS ----------------------------------
    event RaffleCreated(Prize prize, uint256 indexed time, uint256 indexed fee);
    event RaffleJoined(uint256 indexed raffleId, address indexed player, uint256 entries);
    event RaffleClosed(uint256 indexed raffleId, address[] participants);
    event RaffleStaged(uint256 indexed raffleId);
    event RaffleWon(uint256 indexed raffleId, address indexed winner);
    event RafflePrizeClaimed(uint256 indexed raffleId, address indexed winner, uint256 value);
    event KeeperRegistryAddressUpdated(address oldAddress, address newAddress);

    modifier onlyOwner() {
        require(msg.sender == owner);
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
        bytes32 keyHash,
        address keeperAddress,
        address linkAddress
    ) VRFV2WrapperConsumerBase(linkAddress, wrapperAddress) {
        owner = msg.sender;
        vrfWrapper = VRFV2WrapperInterface(wrapperAddress);
        linkTokenAddress = linkAddress;
        requestConfig = RequestConfig({
            callbackGasLimit: callbackGasLimit,
            requestConfirmations: requestConfirmations,
            numWords: 1,
            keyHash: keyHash
        });
        setKeeperRegistryAddress(keeperAddress);
    }

    /**
     * @notice creates new raffle
     * @param prize prize struct
     * @param timeLength time length of raffle
     * @param fee fee to enter raffle
     * @param name name of raffle
     * @param feeToken address of token to use for fee. If 0x0, Gas token will be used
     *
     */
    function createRaffle(
        Prize memory prize,
        uint256 timeLength,
        uint256 fee,
        bytes32 name,
        address feeToken,
        bytes32 merkleRoot,
        bool automation
    ) external payable {
        bool _feeToken = false;
        address _feeTokenAddress = address(0);
        bool _paymentNeeded = true;
        RaffleType _raffleType = RaffleType.DYNAMIC;
        if (fee == 0) {
            _paymentNeeded = false;
        }
        if (feeToken != address(0)) {
            _feeToken = true;
            _feeTokenAddress = feeToken;
        }
        if (merkleRoot == bytes32(0)) {
            _raffleType = RaffleType.STATIC;
        }
        RaffleInstance memory newRaffle = RaffleInstance({
            base: RaffleBase({
                raffleType: _raffleType,
                automation: automation,
                feeToken: _feeToken,
                feeTokenAddress: _feeTokenAddress,
                startDate: block.timestamp
            }),
            owner: msg.sender,
            raffleName: name,
            contestantsAddresses: new address[](0),
            winner: address(0),
            prizeWorth: msg.value,
            timeLength: timeLength,
            fee: fee,
            raffleState: RaffleState.LIVE,
            prize: prize,
            paymentNeeded: _paymentNeeded,
            merkleRoot: merkleRoot,
            linkTotal: 0,
            requestStatus: RequestStatus({requestId: 0, paid: 0, fulfilled: false, randomWords: new uint256[](0)})
        });
        raffles[raffleCounter.current()] = newRaffle;
        liveRaffles.add(raffleCounter.current());
        emit RaffleCreated(prize, timeLength, fee);
        raffleCounter.increment();
    }

    /**
     * @notice joins raffle by ID and number of entries
     * @param raffleId id of raffle
     * @param entries number of entries
     * @dev requires that raffle is live and that enough ETH is sent to cover fee
     *
     */
    function enterRaffle(uint256 raffleId, uint256 entries) external payable {
        require(raffles[raffleId].raffleState == RaffleState.LIVE, "Raffle is not live");
        if (raffles[raffleId].base.feeToken) {
            IERC20(raffles[raffleId].base.feeTokenAddress).safeTransferFrom(
                msg.sender, address(this), (raffles[raffleId].fee * entries)
            );
        } else {
            require(msg.value >= (raffles[raffleId].fee * entries), "Not enough ETH to join raffle");
        }
        for (uint256 i = 0; i < entries; i++) {
            raffles[raffleId].contestantsAddresses.push(msg.sender);
        }
        emit RaffleJoined(raffleId, msg.sender, entries);
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
    function getWinners(uint256 raffleId) external view returns (address) {
        return raffles[raffleId].winner;
    }

    /**
     * @notice withdraws rewards for an account
     * @param randomValue random value generated by VRF
     * @param amount amount of raffle entries
     *
     */
    function _pickRandom(uint256 randomValue, uint256 amount) internal pure returns (uint256) {
        uint256 v = uint256(keccak256(abi.encode(randomValue, 0)));
        return uint256(v % amount) + 1;
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
        uint256 winner = _pickRandom(randomWords[0], raffles[raffleIndexFromRequestId].contestantsAddresses.length);

        raffles[raffleIndexFromRequestId].winner = raffles[raffleIndexFromRequestId].contestantsAddresses[winner - 1];
        raffles[raffleIndexFromRequestId].raffleState = RaffleState.FINISHED;
        emit RaffleWon(raffleIndexFromRequestId, raffles[raffleIndexFromRequestId].winner);
    }

    /**
     * @notice claims prize for a specific raffle
     * @param raffleId id of the raffle
     * @dev requires that raffle is finished and that the caller is the winner
     *
     */
    function claimPrize(uint256 raffleId) external {
        require(raffles[raffleId].raffleState == RaffleState.FINISHED, "Raffle is not finished");
        require(raffles[raffleId].winner == msg.sender, "You are not the winner of this raffle");
        require(!raffles[raffleId].prize.claimed, "Prize has already been claimed");
        if (raffles[raffleId].base.feeToken) {
            IERC20(raffles[raffleId].base.feeTokenAddress).safeTransfer(msg.sender, raffles[raffleId].prizeWorth);
            raffles[raffleId].prize.claimed = true;
        } else {
            payable(msg.sender).transfer(raffles[raffleId].prizeWorth);
            raffles[raffleId].prize.claimed = true;
        }
        emit RafflePrizeClaimed(raffleId, msg.sender, raffles[raffleId].prizeWorth);
    }

    function checkUpkeep(bytes calldata checkData)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */ )
    {
        uint256 raffleId = abi.decode(checkData, (uint256));
        for (uint256 i = 0; i < liveRaffles.length(); i++) {
            if (raffles[i].raffleState == RaffleState.LIVE) {
                upkeepNeeded = (block.timestamp - raffles[i].base.startDate) > raffles[i].timeLength;
            }
        }
    }

    function performUpkeep(bytes calldata /* performData */ ) external override onlyKeeperRegistry {
        for (uint256 i = 0; i < liveRaffles.length(); i++) {
            if (raffles[i].raffleState == RaffleState.LIVE) {
                if ((block.timestamp - raffles[i].base.startDate) > raffles[i].timeLength) {
                    emit RaffleStaged(liveRaffles.at(i));
                    // _pickWinner(liveRaffles[i]);
                }
            }
        }
    }

    /**
     * @notice Sets the keeper registry address.
     */
    function setKeeperRegistryAddress(address newKeeperAddress) public onlyOwner {
        require(newKeeperAddress != address(0));
        emit KeeperRegistryAddressUpdated(keeperRegistryAddress, newKeeperAddress);
        keeperRegistryAddress = newKeeperAddress;
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
     * @notice get amount of entries for a specific user in a specific raffle
     * @param user address of the user
     * @param raffleId id of the raffle
     * @return uint256 amount of entries
     *
     */
    function getUserEntries(address user, uint256 raffleId) external view returns (uint256) {
        uint256 userEntriesCount = 0;
        for (uint256 i = 0; i < raffles[raffleId].contestantsAddresses.length; i++) {
            if (raffles[raffleId].contestantsAddresses[i] == user) {
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
    function updateRaffleOwner(uint256 raffleId, address newAdmin) external {
        require(raffles[raffleId].owner == msg.sender, "Only owner can changes owner");
        raffles[raffleId].owner = newAdmin;
    }

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
