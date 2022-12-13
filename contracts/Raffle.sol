// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

/**
 * @title Raffle
 * @notice Creates a mechanism to create multiple raffles
 */
contract Raffle is VRFConsumerBaseV2, AutomationCompatibleInterface {
    using Counters for Counters.Counter;
    VRFCoordinatorV2Interface COORDINATOR;
    Counters.Counter public raffleCounter;
    RequestConfig public requestConfig;
    address public owner;
    address public s_keeperRegistryAddress;
    uint256[] public stagedRaffles;
    uint256[] private liveRaffles;
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
    event RaffleJoined(
        uint256 indexed raffleId,
        address indexed player,
        uint256 entries
    );
    event RaffleClosed(uint256 indexed raffleId, address[] participants);
    event RaffleStaged(uint256 indexed raffleId);
    event RaffleWon(uint256 indexed raffleId, address indexed winner);
    event RafflePrizeClaimed(
        uint256 indexed raffleId,
        address indexed winner,
        uint256 value
    );
    event KeeperRegistryAddressUpdated(address oldAddress, address newAddress);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyKeeperRegistry() {
        if (msg.sender != s_keeperRegistryAddress) {
            revert OnlyKeeperRegistry();
        }
        _;
    }

    // ------------------- ERRORS -------------------
    error OnlyKeeperRegistry();

    constructor(
        address _vrfCoordinator,
        uint64 _subscriptionId,
        uint16 _requestConfirmations,
        uint32 _callbackGasLimit,
        bytes32 _keyHash,
        address _keeperRegistryAddress
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
        setKeeperRegistryAddress(_keeperRegistryAddress);
    }

    /**
     * @notice creates new raffle
     * @param _prize prize struct
     * @param _timeLength time length of raffle
     * @param _fee fee to enter raffle
     * @param _name name of raffle
     **/
    function createRaffle(
        Prize memory _prize,
        uint256 _timeLength,
        uint256 _fee,
        string memory _name
    ) external payable onlyOwner {
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
        liveRaffles.push(raffleCounter.current());
        emit RaffleCreated(_prize, _timeLength, _fee);
        raffleCounter.increment();
    }

    /**
     * @notice joins raffle by ID and number of entries
     * @param _raffleId id of raffle
     * @param _entries number of entries
     * @dev requires that raffle is live and that enough ETH is sent to cover fee
     **/
    function enterRaffle(uint256 _raffleId, uint256 _entries) external payable {
        require(
            raffles[_raffleId].raffleState == RaffleState.LIVE,
            "Raffle is not live"
        );
        require(
            msg.value >= (raffles[_raffleId].fee * _entries),
            "Not enough ETH to join raffle"
        );
        for (uint256 i = 0; i < _entries; i++) {
            raffles[_raffleId].contestantsAddresses.push(msg.sender);
        }
        emit RaffleJoined(_raffleId, msg.sender, _entries);
    }

    /**
     * @notice closes raffle and picks winner
     * @param _raffleId id of raffle
     * @dev requests random number from VRF and marks raffle as finished
     **/
    function pickWinner(uint256 _raffleId) internal {
        uint256 requestId = COORDINATOR.requestRandomWords(
            requestConfig.keyHash,
            requestConfig.subscriptionId,
            requestConfig.requestConfirmations,
            requestConfig.callbackGasLimit,
            1
        );
        requestIdToRaffleIndex[requestId] = _raffleId;
        raffles[_raffleId].raffleState = RaffleState.FINISHED;

        emit RaffleClosed(_raffleId, raffles[_raffleId].contestantsAddresses);
    }

    /**
     * @notice gets the winner of a specific raffle
     * @param _raffleId id of the raffle
     * @return address of the winner
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
        public
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
        _updateLiveRaffles(raffleIndexFromRequestId);
        uint256 winner = _pickRandom(
            randomWords[0],
            raffles[raffleIndexFromRequestId].contestantsAddresses.length
        );

        raffles[raffleIndexFromRequestId].winner = raffles[
            raffleIndexFromRequestId
        ].contestantsAddresses[winner - 1];
        raffles[raffleIndexFromRequestId].raffleState = RaffleState.FINISHED;
        emit RaffleWon(
            raffleIndexFromRequestId,
            raffles[raffleIndexFromRequestId].winner
        );
    }

    /**
     * @notice claims prize for a specific raffle
     * @param _raffleId id of the raffle
     * @dev requires that raffle is finished and that the caller is the winner
     **/
    function claimPrize(uint256 _raffleId) external {
        require(
            raffles[_raffleId].raffleState == RaffleState.FINISHED,
            "Raffle is not finished"
        );
        require(
            raffles[_raffleId].winner == msg.sender,
            "You are not the winner of this raffle"
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
        for (uint256 i = 0; i < liveRaffles.length; i++) {
            if (raffles[i].raffleState == RaffleState.LIVE) {
                upkeepNeeded =
                    (block.timestamp - raffles[i].startDate) >
                    raffles[i].timeLength;
            }
        }
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override onlyKeeperRegistry {
        for (uint256 i = 0; i < liveRaffles.length; i++) {
            if (raffles[i].raffleState == RaffleState.LIVE) {
                if (
                    (block.timestamp - raffles[i].startDate) >
                    raffles[i].timeLength
                ) {
                    emit RaffleStaged(liveRaffles[i]);
                    pickWinner(liveRaffles[i]);
                }
            }
        }
    }

    /**
     * @notice Sets the keeper registry address.
     */
    function setKeeperRegistryAddress(address keeperRegistryAddress)
        public
        onlyOwner
    {
        require(keeperRegistryAddress != address(0));
        emit KeeperRegistryAddressUpdated(
            s_keeperRegistryAddress,
            keeperRegistryAddress
        );
        s_keeperRegistryAddress = keeperRegistryAddress;
    }

    /**
     * @notice Updates live raffles array when one finishes.
     */
    function _updateLiveRaffles(uint256 _index) internal {
        for (uint256 i = _index; i < liveRaffles.length - 1; i++) {
            liveRaffles[i] = liveRaffles[i + 1];
        }
        liveRaffles.pop();
    }

    /**
     * @notice get raffle by ID
     * @param _raffleId raffle id
     * @return raffle instance
     **/
    function getRaffle(uint256 _raffleId)
        external
        view
        returns (RaffleInstance memory)
    {
        return raffles[_raffleId];
    }

    /**
     * @notice get all live raffles
     * @return array of live raffle IDs
     **/
    function getLiveRaffles() external view returns (uint256[] memory) {
        return liveRaffles;
    }

    /**
     * @notice get amount of entries for a specific user in a specific raffle
     * @param _user address of the user
     * @param _raffleId id of the raffle
     * @return uint256 amount of entries
     **/
    function getUserEntries(address _user, uint256 _raffleId)
        external
        view
        returns (uint256)
    {
        uint256 userEntriesCount;
        for (
            uint256 i = 0;
            i < raffles[_raffleId].contestantsAddresses.length;
            i++
        ) {
            if (raffles[_raffleId].contestantsAddresses[i] == _user) {
                userEntriesCount++;
            }
        }

        return userEntriesCount;
    }
}
