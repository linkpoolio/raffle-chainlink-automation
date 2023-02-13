// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../contracts/RaffleManager.sol";

contract RaffleManagerTest is Test {
    RaffleManager raffleManager;
    address wrapperAddress;
    uint16 requestConfirmations;
    uint32 callbackGasLimit;
    address keeperAddress;
    address linkAddress;
    address admin;
    address raffleAdmin;
    address user1;

    event RaffleCreated(bytes prize, uint256 indexed time, uint256 indexed fee, address feeToken, bool permissioned);
    event RaffleJoined(uint256 indexed raffleId, bytes32 indexed player, uint256 entries);

    function setUp() public {
        admin = makeAddr("admin");
        raffleAdmin = makeAddr("raffleAdmin");
        user1 = makeAddr("user1");
        wrapperAddress = address(0x1);
        requestConfirmations = 3;
        callbackGasLimit = 100000;
        keeperAddress = address(0x2);
        linkAddress = address(0x3);
        vm.prank(admin);
        raffleManager =
            new RaffleManager(wrapperAddress, requestConfirmations, callbackGasLimit, keeperAddress, linkAddress);
    }

    function successFixture() public {
        vm.expectEmit(true, true, true, true);
        emit RaffleCreated(bytes("BigMac"), 30, 0, address(0), false);
        vm.prank(raffleAdmin);
        raffleManager.createRaffle({
            prize: bytes("BigMac"),
            timeLength: 30,
            fee: 0,
            name: bytes32("Big Mac Contest"),
            feeToken: address(0),
            merkleRoot: bytes32(""),
            automation: false,
            participants: new bytes32[](0),
            totalWinners: 1,
            entriesPerUser: 1
        });
    }

    function staticRaffleFixture() public {
        bytes32[] memory participants = new bytes32[](1);
        vm.expectEmit(true, true, true, true);
        emit RaffleCreated(bytes("BigMac"), 30, 0, address(0), false);
        vm.prank(raffleAdmin);
        raffleManager.createRaffle({
            prize: bytes("BigMac"),
            timeLength: 30,
            fee: 0,
            name: bytes32("Big Mac Contest"),
            feeToken: address(0),
            merkleRoot: bytes32(""),
            automation: false,
            participants: participants,
            totalWinners: 1,
            entriesPerUser: 1
        });
    }

    function test_createRaffle_Success() public {
        successFixture();
    }

    function test_createRaffle_CheckVariableSetup_Dynamic_NoPermissions_NoFeeToken() public {
        successFixture();
        RaffleManager.RaffleInstance memory raffle = raffleManager.getRaffle(0);
        assertEq(raffle.raffleName, bytes32("Big Mac Contest"));
        assertFalse(raffle.base.permissioned);
        assertEq(uint8(raffle.base.raffleType), uint8(RaffleManager.RaffleType.DYNAMIC));
        assertFalse(raffle.base.feeToken);
    }

    function test_createRaffle_CheckVariableSetup_Dynamic_NoPermissions_FeeToken() public {
        raffleManager.createRaffle({
            prize: bytes("BigMac"),
            timeLength: 30,
            fee: 1 ether,
            name: bytes32("Big Mac Contest"),
            feeToken: makeAddr("doge"),
            merkleRoot: bytes32(""),
            automation: false,
            participants: new bytes32[](0),
            totalWinners: 1,
            entriesPerUser: 1
        });
        RaffleManager.RaffleInstance memory raffle = raffleManager.getRaffle(0);
        assertEq(raffle.raffleName, bytes32("Big Mac Contest"));
        assertFalse(raffle.base.permissioned);
        assertEq(uint8(raffle.base.raffleType), uint8(RaffleManager.RaffleType.DYNAMIC));
        assert(raffle.base.feeToken);
    }

    function test_createRaffle_CheckVariableSetup_Dynamic_Permissions() public {
        raffleManager.createRaffle({
            prize: bytes("BigMac"),
            timeLength: 30,
            fee: 1 ether,
            name: bytes32("Big Mac Contest"),
            feeToken: makeAddr("doge"),
            merkleRoot: bytes32("merkleRoot"),
            automation: false,
            participants: new bytes32[](0),
            totalWinners: 1,
            entriesPerUser: 1
        });
        RaffleManager.RaffleInstance memory raffle = raffleManager.getRaffle(0);
        assertEq(raffle.raffleName, bytes32("Big Mac Contest"));
        assert(raffle.base.permissioned);
        assertEq(uint8(raffle.base.raffleType), uint8(RaffleManager.RaffleType.DYNAMIC));
        assert(raffle.base.feeToken);
    }

    function test_enterRaffle_CanEnterDynamicPermissionlessRaffleWithAddress() public {
        successFixture();
        vm.expectEmit(true, true, true, true);
        emit RaffleJoined(0, keccak256(abi.encodePacked(user1)), 1);
        vm.prank(user1);
        raffleManager.enterRaffle(0, 1, new bytes32[](0));
        bytes32 contestant = raffleManager.getRaffle(0).contestantsAddresses[0];
        assert(contestant == keccak256(abi.encodePacked(user1)));
    }

    function testRevert_enterRaffle_RaffleIsNotLive() public {
        successFixture();
        vm.prank(user1);
        vm.expectRevert("Raffle is not live");
        raffleManager.enterRaffle(1, 1, new bytes32[](0));
    }

    function testRevert_enterRaffle_CantEnterStaticRaffle() public {
        staticRaffleFixture();
        vm.prank(user1);
        vm.expectRevert("Cannot enter static raffle");
        raffleManager.enterRaffle(0, 1, new bytes32[](0));
    }
}
