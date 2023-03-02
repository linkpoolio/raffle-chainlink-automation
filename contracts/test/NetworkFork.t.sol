// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "forge-std/StdJson.sol";
import "@src/RaffleManager.sol";
import {ERC20Mock} from "@src/mock/ERC20Mock.sol";
import {ERC677Mock} from "@src/mock/ERC677Mock.sol";
import {VRFV2WrapperMock} from "@src/mock/VRFV2WrapperMock.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

contract RaffleManagerNetworkForkTest is Test {
    using stdJson for string;

    RaffleManager raffleManager;
    ERC20Mock customToken;
    VRFV2WrapperMock vrfMock;
    address admin;
    address raffleAdmin;
    address sepoliaWhale;
    bytes32 merkleRoot;
    uint256 network;
    string email;
    Config config;

    event RaffleCreated(
        string prizeName, uint256 indexed time, uint256 indexed fee, address feeToken, bool permissioned
    );
    event RaffleJoined(uint256 indexed raffleId, bytes32 indexed player, uint256 entries);
    event RaffleOwnerUpdated(uint256 indexed raffleId, address oldOwner, address newOwner);
    event RaffleWon(uint256 indexed raffleId, bytes32[] indexed winners);
    event RafflePrizeClaimed(uint256 indexed raffleId, address indexed winner, uint256 value);

    struct Config {
        uint32 automationCallbackGas;
        uint32 callbackGasLimit;
        address keepersRegistry;
        address linkAddress;
        string name;
        address registrarAddress;
        uint16 requestConfirmations;
        address whaleAddress;
        address wrapperAddress;
    }

    function configureNetwork(string memory input) internal view returns (Config memory) {
        string memory inputDir = string.concat(vm.projectRoot(), "/script/input/");
        string memory chainDir = string.concat(vm.toString(block.chainid), "/");
        string memory file = string.concat(input, ".json");
        string memory data = vm.readFile(string.concat(inputDir, chainDir, file));
        bytes memory rawConfig = data.parseRaw("");
        return abi.decode(rawConfig, (Config));
    }

    function setUp() public {
        network = vm.createSelectFork(vm.rpcUrl("mumbai"));
        config = configureNetwork("config");
        admin = makeAddr("admin");
        raffleAdmin = makeAddr("raffleAdmin");
        email = "test@test.com";
        vm.startPrank(admin);
        raffleManager = new RaffleManager(
            config.wrapperAddress,
            config.requestConfirmations,
            config.callbackGasLimit,
            config.keepersRegistry,
            config.linkAddress,
            config.registrarAddress,
            config.automationCallbackGas
        );
        vm.stopPrank();
    }

    function forkRaffleFixture() public {
        vm.selectFork(network);
        bytes32[] memory participants = new bytes32[](1);
        participants[0] = keccak256(abi.encodePacked(email));
        vm.expectEmit(true, true, true, true);
        emit RaffleCreated("BigMac", 0, 0, address(0), false);
        vm.prank(raffleAdmin);
        raffleManager.createRaffle({
            prizeName: "BigMac",
            timeLength: 0,
            fee: 0,
            name: "Big Mac Contest",
            feeToken: address(0),
            merkleRoot: bytes32(""),
            automation: false,
            participants: participants,
            totalWinners: 1,
            entriesPerUser: 1
        });
    }

    function testFork_onTokenTransfer_Run() public {
        forkRaffleFixture();
        vm.prank(config.whaleAddress);
        LinkTokenInterface(config.linkAddress).transfer(raffleAdmin, 1 ether);
        vm.startPrank(raffleAdmin);
        LinkTokenInterface(config.linkAddress).transferAndCall(
            address(raffleManager), 0.5 ether, bytes(abi.encode(0, 0))
        );
        vm.stopPrank();
    }

    function testFork_registerUpkeep() public {
        forkRaffleFixture();
        vm.prank(config.whaleAddress);
        LinkTokenInterface(config.linkAddress).transfer(raffleAdmin, 500 ether);
        vm.prank(raffleAdmin);
        LinkTokenInterface(config.linkAddress).transferAndCall(address(raffleManager), 5 ether, bytes(abi.encode(0, 1)));
        RaffleManager.RaffleInstance memory r = raffleManager.getRaffle(0);
        assertTrue(r.requestStatus.upkeepId > 0);
    }

    // function testFork_registerUpkeepManual() public {
    //     forkRaffleFixture();
    //     vm.prank(config.whaleAddress);
    //     LinkTokenInterface(config.linkAddress).transfer(raffleAdmin, 500 ether);
    //     vm.prank(config.whaleAddress);
    //     LinkTokenInterface(config.linkAddress).transfer(address(raffleManager), 500 ether);
    //     vm.prank(raffleAdmin);
    //     raffleManager.registerAutomation("big mac raffle", 500_000, abi.encode(0), 50 ether, 0);
    // }
}
