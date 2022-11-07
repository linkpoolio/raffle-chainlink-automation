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

    address public owner;
    bool public raffleLive;
    mapping(uint256 => RaffleInstance) public raffles;
    mapping(uint256 => uint256) public requestIdToRaffleIndex;
    mapping(uint256 => Prize[]) public prizes;
    uint256[] public stagedRaffles;
    Counters.Counter public raffleCounter;
    RequestConfig public requestConfig;

    // 0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15; // Goerli: keyhash
    // uint32 callbackGasLimit = 100000;
    // uint16 requestConfirmations = 3;

    struct RaffleInstance {
        string raffleName;
        uint256 numberOfWinners;
        address[] contestantsAddresses;
        uint256[] winners;
        uint256 startDate;
        bool raffleDone;
        uint256 prizeWorth;
        uint256 randomSeed;
        bool contestStaged;
        string provenanceHash;
        address contestOwner;
        uint256 timeLength;
        uint256 fee;
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

    event RaffleCreated(
        Prize[] prizes,
        uint8 indexed winners,
        uint256 indexed time,
        uint256 indexed fee
    );
    event RaffleJoined(uint256 indexed raffleId, address indexed player);
    event RaffleClosed(uint256 indexed raffleId, address[] participants);
    event RaffleWon(uint256 indexed raffleId, address indexed winner); // needs lists of winners and corresponding prizes

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
        Prize[] memory _prizes,
        uint8 _winners,
        uint256 _timeLength,
        uint256 _fee,
        string memory _name
    ) external onlyOwner {
        raffleCounter.increment();

        RaffleInstance memory newRaffle = RaffleInstance({
            raffleName: _name,
            numberOfWinners: _winners,
            contestantsAddresses: new address[](0),
            winners: new uint256[](0),
            startDate: block.timestamp,
            raffleDone: false,
            prizeWorth: 0,
            randomSeed: 0,
            contestStaged: false,
            provenanceHash: "",
            contestOwner: msg.sender,
            timeLength: _timeLength,
            fee: _fee
        });
        for (uint256 i = 0; i < _prizes.length; i++) {
            prizes[raffleCounter.current()].push(_prizes[i]);
        }
        raffles[raffleCounter.current()] = newRaffle;
        raffleLive = true;
        emit RaffleCreated(_prizes, _winners, _timeLength, _fee);
    }

    function getCurrentRaffle() external view returns (RaffleInstance memory) {
        return raffles[raffleCounter.current()];
    }

    // think about how to enter raffle multiple times from same user??
    function joinRaffle() external payable {
        require(
            !raffles[raffleCounter.current()].raffleDone,
            "Raffle is not live"
        );
        require(
            msg.value >= raffles[raffleCounter.current()].fee,
            "Not enough ETH to join raffle"
        );
        // needs to add money to contract
        raffles[raffleCounter.current()].contestantsAddresses.push(msg.sender);
        emit RaffleJoined(raffleCounter.current(), msg.sender);
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
        raffles[raffleCounter.current()].raffleDone = true;
        raffleLive = false;

        emit RaffleClosed(
            _raffleId,
            raffles[raffleCounter.current()].contestantsAddresses
        );
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        uint256 raffleIndexFromRequestId = requestIdToRaffleIndex[requestId];
        raffles[raffleIndexFromRequestId].randomSeed = randomWords[0];
        raffles[raffleIndexFromRequestId].contestStaged = true;
        stagedRaffles.push(raffleIndexFromRequestId);
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
        if (!raffleLive) {
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
