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
    bytes32 merkleRoot;
    address addrA = address(0x0000000000000000000000000000000000000001);
    address addrB = address(0x0000000000000000000000000000000000000002);
    bytes32[] proofA = new bytes32[](2);
    bytes32[] proofB = new bytes32[](2);

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
        merkleRoot = 0x344510bd0c324c3912b13373e89df42d1b50450e9764a454b2aa6e2968a4578a;
        proofA[0] = 0xd52688a8f926c816ca1e079067caba944f158e764817b83fc43594370ca9cf62;
        proofA[1] = 0x5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9;
        proofB[0] = 0x1468288056310c82aa4c01a7e12a10f8111a0560e72b700555479031b86c357d;
        proofB[1] = 0x5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9;
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

    function merkleFixture() public {
        vm.expectEmit(true, true, true, true);
        emit RaffleCreated(bytes("BigMac"), 30, 0, address(0), true);
        vm.prank(raffleAdmin);
        raffleManager.createRaffle({
            prize: bytes("BigMac"),
            timeLength: 30,
            fee: 0,
            name: bytes32("Big Mac Contest"),
            feeToken: address(0),
            merkleRoot: merkleRoot,
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

    function test_enterRaffle_VerifyProof() public {
        merkleFixture();

        vm.prank(addrA);
        raffleManager.enterRaffle(0, 1, proofA);
    }

    function testRevert_enterRaffle_VerifyFail(address randomAddress) public {
        vm.assume(randomAddress != addrA);
        merkleFixture();
        vm.expectRevert("Not authorized");
        vm.prank(randomAddress);
        raffleManager.enterRaffle(0, 1, proofA);
    }

    function testRevert_enterRaffle_TooManyEntries(uint8 entries) public {
        vm.assume(entries > 1);
        merkleFixture();

        vm.expectRevert("Too many entries");
        vm.prank(addrA);
        raffleManager.enterRaffle(0, entries, proofA);
    }
}
