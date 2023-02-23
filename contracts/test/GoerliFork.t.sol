// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "@src/RaffleManager.sol";
import {ERC20Mock} from "@src/mock/ERC20Mock.sol";
import {ERC677Mock} from "@src/mock/ERC677Mock.sol";
import {VRFV2WrapperMock} from "@src/mock/VRFV2WrapperMock.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

contract RaffleManagerGoerliForkTest is Test {
    RaffleManager raffleManager;
    ERC20Mock customToken;
    VRFV2WrapperMock vrfMock;
    address wrapperAddress;
    uint16 requestConfirmations;
    uint32 callbackGasLimit;
    address keeperAddress;
    address linkAddress;
    address admin;
    address raffleAdmin;
    address user1;
    address user2;
    address user3;
    address user4;
    address user5;
    address whale;
    bytes32 merkleRoot;
    uint256 goerli;
    string email;

    event RaffleCreated(
        string prizeName, uint256 indexed time, uint256 indexed fee, address feeToken, bool permissioned
    );
    event RaffleJoined(uint256 indexed raffleId, bytes32 indexed player, uint256 entries);
    event RaffleOwnerUpdated(uint256 indexed raffleId, address oldOwner, address newOwner);
    event RaffleWon(uint256 indexed raffleId, bytes32[] indexed winners);
    event RafflePrizeClaimed(uint256 indexed raffleId, address indexed winner, uint256 value);

    function setUp() public {
        goerli = vm.createSelectFork(vm.rpcUrl("goerli"));
        admin = makeAddr("admin");
        raffleAdmin = makeAddr("raffleAdmin");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        user3 = makeAddr("user3");
        user4 = makeAddr("user4");
        user5 = makeAddr("user5");
        whale = address(0xE4dDb4233513498b5aa79B98bEA473b01b101a67);
        wrapperAddress = address(0x708701a1DfF4f478de54383E49a627eD4852C816);
        requestConfirmations = 3;
        callbackGasLimit = 100000; // 100_000
        keeperAddress = address(0x02777053d6764996e594c3E88AF1D58D5363a2e6);
        linkAddress = address(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        merkleRoot = 0x344510bd0c324c3912b13373e89df42d1b50450e9764a454b2aa6e2968a4578a;
        email = "test@test.com";
        vm.startPrank(admin);
        raffleManager = new RaffleManager(
            wrapperAddress,
            requestConfirmations,
            callbackGasLimit,
            keeperAddress,
            linkAddress
        );
        vm.stopPrank();
    }

    function forkRaffleFixture() public {
        vm.selectFork(goerli);
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
        vm.prank(whale);
        LinkTokenInterface(linkAddress).transfer(raffleAdmin, 1 ether);
        vm.startPrank(raffleAdmin);
        LinkTokenInterface(linkAddress).transferAndCall(address(raffleManager), 0.5 ether, bytes(abi.encode(0)));
        vm.stopPrank();
    }
}
