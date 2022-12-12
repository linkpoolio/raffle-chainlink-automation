// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract Raffle is VRFConsumerBaseV2, AutomationCompatibleInterface {
    using Counters for Counters.Counter;
    VRFCoordinatorV2Interface COORDINATOR;
    Counters.Counter public raffleCounter;
    RequestConfig public requestConfig;
    address public owner;
    uint256[] public stagedRaffles;
    mapping(uint256 => RaffleInstance) public raffles;
    mapping(uint256 => uint256) public requestIdToRaffleIndex;
    mapping(uint256 => Prize[]) public prizes;

    // ------------------- STRUCTS -------------------
    enum RaffleState {
        STAGED,
        LIVE,
        FINISHED
    }

    // NOTE: maybe add in min amount of entries before raffle can be closed?
    struct RaffleInstance {
        string raffleName;
        address[] contestantsAddresses;
        address winner;
        uint256 startDate;
        uint256 prizeWorth;
        uint256 randomSeed;
        address contestOwner;
        uint256 timeLength;
        uint256 fee;
        RaffleState raffleState;
        bool prizeClaimed;
        Prize prize;
    }

    struct Prize {
        string prizeName;
    }

    struct RequestConfig {
        uint64 subscriptionId;
        uint32 callbackGasLimit;
        uint16 requestConfirmations;
        uint32 numWords;
        bytes32 keyHash;
    }

    //------------------------------ EVENTS ----------------------------------
    event RaffleCreated(Prize prize, uint256 indexed time, uint256 indexed fee);
    event RaffleJoined(uint256 indexed raffleId, address indexed player);
    event RaffleClosed(uint256 indexed raffleId, address[] participants);
    event RaffleWon(uint256 indexed raffleId, address indexed winner); // needs lists of winners and corresponding prizes
    event RafflePrizeClaimed(
        uint256 indexed raffleId,
        address indexed winner,
        uint256 value
    );

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(
        address _vrfCoordinator,
        uint64 _subscriptionId,
        uint16 _requestConfirmations,
        uint32 _callbackGasLimit,
        bytes32 _keyHash
    ) VRFConsumerBaseV2(_vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
        owner = msg.sender;
        requestConfig = RequestConfig({
            subscriptionId: _subscriptionId,
            callbackGasLimit: _callbackGasLimit,
            requestConfirmations: _requestConfirmations,
            numWords: 1,
            keyHash: _keyHash
        });
    }

    function createRaffle(
        Prize memory _prize,
        uint256 _timeLength,
        uint256 _fee,
        string memory _name
    ) external payable onlyOwner {
        raffleCounter.increment();

        RaffleInstance memory newRaffle = RaffleInstance({
            raffleName: _name,
            contestantsAddresses: new address[](0),
            winner: address(0),
            startDate: block.timestamp,
            prizeWorth: msg.value,
            randomSeed: 0,
            contestOwner: msg.sender,
            timeLength: _timeLength,
            fee: _fee,
            raffleState: RaffleState.LIVE,
            prizeClaimed: false,
            prize: _prize
        });
        raffles[raffleCounter.current()] = newRaffle;
        emit RaffleCreated(_prize, _timeLength, _fee);
    }

    function getRaffle(uint256 _raffleId)
        external
        view
        returns (RaffleInstance memory)
    {
        return raffles[_raffleId];
    }

    // think about how to enter raffle multiple times from same user??
    function joinRaffle(uint256 _raffleId) external payable {
        require(
            raffles[_raffleId].raffleState == RaffleState.LIVE,
            "Raffle is not live"
        );
        require(
            msg.value >= raffles[raffleCounter.current()].fee,
            "Not enough ETH to join raffle"
        );

        raffles[_raffleId].contestantsAddresses.push(msg.sender);
        emit RaffleJoined(_raffleId, msg.sender);
    }

    function pickWinner(uint256 _raffleId) internal {
        uint256 requestId = COORDINATOR.requestRandomWords(
            requestConfig.keyHash,
            requestConfig.subscriptionId,
            requestConfig.requestConfirmations,
            requestConfig.callbackGasLimit,
            1
        );
        requestIdToRaffleIndex[requestId] = raffleCounter.current();
        raffles[raffleCounter.current()].raffleState = RaffleState.FINISHED;

        emit RaffleClosed(
            _raffleId,
            raffles[raffleCounter.current()].contestantsAddresses
        );
    }

    /**
     * @notice gets the winner of a specific raffle
     * @param _raffleId id of the raffle
     **/
    function getWinners(uint256 _raffleId) external view returns (address) {
        return raffles[_raffleId].winner;
    }

    /**
     * @notice withdraws rewards for an account
     * @param _randomValue random value generated by VRF
     * @param _n amount of raffle entries
     **/
    function _pickRandom(uint256 _randomValue, uint256 _n)
        internal
        pure
        returns (uint256)
    {
        uint256 v = uint256(keccak256(abi.encode(_randomValue, 0)));
        return uint256(v % _n) + 1;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        uint256 raffleIndexFromRequestId = requestIdToRaffleIndex[requestId];
        raffles[raffleIndexFromRequestId].randomSeed = randomWords[0];
        raffles[raffleIndexFromRequestId].raffleState = RaffleState.STAGED;
        stagedRaffles.push(raffleIndexFromRequestId);
        uint256 winner = _pickRandom(
            randomWords[0],
            raffles[raffleIndexFromRequestId].contestantsAddresses.length
        );
        raffles[raffleIndexFromRequestId].winner = raffles[
            raffleIndexFromRequestId
        ].contestantsAddresses[winner];
    }

    function claimPrize(uint256 _raffleId) external {
        require(
            raffles[_raffleId].raffleState == RaffleState.FINISHED,
            "Raffle is not finished"
        );
        require(
            raffles[_raffleId].winner == msg.sender,
            "You are not a winner"
        );
        payable(msg.sender).transfer(raffles[_raffleId].prizeWorth);
        emit RafflePrizeClaimed(
            _raffleId,
            msg.sender,
            raffles[_raffleId].prizeWorth
        );
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded =
            (block.timestamp - raffles[raffleCounter.current()].startDate) >
            raffles[raffleCounter.current()].timeLength;
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        if (raffles[raffleCounter.current()].raffleState != RaffleState.LIVE) {
            return;
        }
        if (
            (block.timestamp - raffles[raffleCounter.current()].startDate) >
            raffles[raffleCounter.current()].timeLength
        ) {
            pickWinner(raffleCounter.current());
        }
    }
}
