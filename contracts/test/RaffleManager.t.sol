// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "@src/RaffleManager.sol";
import {ERC20Mock} from "@src/mock/ERC20Mock.sol";
import {ERC677Mock} from "@src/mock/ERC677Mock.sol";
import {VRFV2WrapperMock} from "@src/mock/VRFV2WrapperMock.sol";
import {AutomationMock} from "@src/mock/AutomationMock.sol";

contract RaffleManagerTest is Test {
    RaffleManager raffleManager;
    ERC20Mock customToken;
    VRFV2WrapperMock vrfMock;
    address wrapperAddress;
    uint16 requestConfirmations;
    uint32 callbackGasLimit;
    uint32 automationCallbackGasLimit;
    AutomationMock keeperAddress;
    address registrarAddress;
    address linkAddress;
    ERC677Mock customLINK;
    address admin;
    address raffleAdmin;
    address user1;
    address user2;
    address user3;
    address user4;
    address user5;
    bytes32 merkleRoot;
    address addrA = address(0x0000000000000000000000000000000000000001);
    address addrB = address(0x0000000000000000000000000000000000000002);
    bytes32[] proofA = new bytes32[](2);
    bytes32[] proofB = new bytes32[](2);
    uint96 BASE_FEE = 2500000000;
    uint96 GAS_PRICE_LINK = 1e9;
    string email;

    event RaffleCreated(
        string prizeName, uint256 indexed time, uint256 indexed fee, address feeToken, bool permissioned
    );
    event RaffleJoined(uint256 indexed raffleId, bytes32 indexed player, uint256 entries);
    event RaffleOwnerUpdated(uint256 indexed raffleId, address oldOwner, address newOwner);
    event RaffleWon(uint256 indexed raffleId, bytes32[] indexed winners);
    event RafflePrizeClaimed(uint256 indexed raffleId, address indexed winner, uint256 value);

    function setUp() public {
        admin = makeAddr("admin");
        raffleAdmin = makeAddr("raffleAdmin");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        user3 = makeAddr("user3");
        user4 = makeAddr("user4");
        user5 = makeAddr("user5");
        wrapperAddress = address(0x1);
        requestConfirmations = 3;
        callbackGasLimit = 500_000;
        automationCallbackGasLimit = 500_000;
        keeperAddress = new AutomationMock();
        linkAddress = address(0x3);
        registrarAddress = address(0x4);
        merkleRoot = 0x344510bd0c324c3912b13373e89df42d1b50450e9764a454b2aa6e2968a4578a;
        proofA[0] = 0xd52688a8f926c816ca1e079067caba944f158e764817b83fc43594370ca9cf62;
        proofA[1] = 0x5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9;
        proofB[0] = 0x1468288056310c82aa4c01a7e12a10f8111a0560e72b700555479031b86c357d;
        proofB[1] = 0x5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9;
        email = "test@test.com";
        vm.startPrank(admin);
        customLINK = new ERC677Mock("Chainlink", "LINK", 1000000 ether);
        vrfMock = new VRFV2WrapperMock(BASE_FEE, GAS_PRICE_LINK);
        raffleManager = new RaffleManager(
            address(vrfMock),
            requestConfirmations,
            callbackGasLimit,
            address(keeperAddress),
            address(customLINK),
            address(keeperAddress),
            automationCallbackGasLimit
        );
        customLINK.transfer(raffleAdmin, 1000000 ether);
        vm.stopPrank();
    }

    function successFixture() public {
        RaffleManager.CreateRaffleParams memory _params = RaffleManager.CreateRaffleParams({
            prizeName: "BigMac",
            timeLength: 30,
            fee: 0,
            name: "Big Mac Contest",
            feeToken: address(0),
            merkleRoot: bytes32(""),
            automation: false,
            participants: new bytes32[](0),
            totalWinners: 1,
            entriesPerUser: 1
        });
        vm.expectEmit(true, true, true, true);
        emit RaffleCreated("BigMac", 30, 0, address(0), false);
        vm.prank(raffleAdmin);
        LinkTokenInterface(address(customLINK)).transferAndCall(
            address(raffleManager), 5 ether, bytes(abi.encode(_params))
        );
    }

    function successFixtureWithETH() public {
        RaffleManager.CreateRaffleParams memory _params = RaffleManager.CreateRaffleParams({
            prizeName: "BigMac",
            timeLength: 0,
            fee: 1 ether,
            name: "Big Mac Contest",
            feeToken: address(0),
            merkleRoot: bytes32(""),
            automation: false,
            participants: new bytes32[](0),
            totalWinners: 1,
            entriesPerUser: 1
        });
        vm.expectEmit(true, true, true, true);
        emit RaffleCreated("BigMac", 0, 1 ether, address(0), false);
        vm.prank(raffleAdmin);
        LinkTokenInterface(address(customLINK)).transferAndCall(
            address(raffleManager), 5 ether, bytes(abi.encode(_params))
        );
    }

    function successFixtureWithCustomToken() public {
        vm.prank(admin);
        customToken = new ERC20Mock("Custom Token", "CT");
        RaffleManager.CreateRaffleParams memory _params = RaffleManager.CreateRaffleParams({
            prizeName: "BigMac",
            timeLength: 0,
            fee: 1 ether,
            name: "Big Mac Contest",
            feeToken: address(customToken),
            merkleRoot: bytes32(""),
            automation: false,
            participants: new bytes32[](0),
            totalWinners: 1,
            entriesPerUser: 1
        });

        vm.expectEmit(true, true, true, true);
        emit RaffleCreated("BigMac", 0, 1 ether, address(customToken), false);
        vm.prank(raffleAdmin);
        LinkTokenInterface(address(customLINK)).transferAndCall(
            address(raffleManager), 5 ether, bytes(abi.encode(_params))
        );
    }

    function successFixtureWithCustomTokenMultipleWinners() public {
        vm.prank(admin);
        customToken = new ERC20Mock("Custom Token", "CT");
        RaffleManager.CreateRaffleParams memory _params = RaffleManager.CreateRaffleParams({
            prizeName: "BigMac",
            timeLength: 0,
            fee: 1 ether,
            name: "Big Mac Contest",
            feeToken: address(customToken),
            merkleRoot: bytes32(""),
            automation: false,
            participants: new bytes32[](0),
            totalWinners: 3,
            entriesPerUser: 1
        });

        vm.expectEmit(true, true, true, true);
        emit RaffleCreated("BigMac", 0, 1 ether, address(customToken), false);
        vm.prank(raffleAdmin);
        LinkTokenInterface(address(customLINK)).transferAndCall(
            address(raffleManager), 5 ether, bytes(abi.encode(_params))
        );
    }

    function successFixtureMultipleWinners(uint8 winners, bool _fee) public {
        RaffleManager.CreateRaffleParams memory _params = RaffleManager.CreateRaffleParams({
            prizeName: "BigMac",
            timeLength: 30,
            fee: _fee ? 1 ether : 0,
            name: "Big Mac Contest",
            feeToken: address(0),
            merkleRoot: bytes32(""),
            automation: false,
            participants: new bytes32[](0),
            totalWinners: winners,
            entriesPerUser: 1
        });
        vm.prank(raffleAdmin);
        LinkTokenInterface(address(customLINK)).transferAndCall(
            address(raffleManager), 5 ether, bytes(abi.encode(_params))
        );
    }

    function merkleFixture() public {
        RaffleManager.CreateRaffleParams memory _params = RaffleManager.CreateRaffleParams({
            prizeName: "BigMac",
            timeLength: 30,
            fee: 0,
            name: "Big Mac Contest",
            feeToken: address(0),
            merkleRoot: merkleRoot,
            automation: false,
            participants: new bytes32[](0),
            totalWinners: 1,
            entriesPerUser: 1
        });
        vm.expectEmit(true, true, true, true);
        emit RaffleCreated("BigMac", 30, 0, address(0), true);
        vm.prank(raffleAdmin);
        LinkTokenInterface(address(customLINK)).transferAndCall(
            address(raffleManager), 5 ether, bytes(abi.encode(_params))
        );
    }

    function staticRaffleFixture() public {
        bytes32[] memory participants = new bytes32[](1);
        participants[0] = keccak256(abi.encodePacked(email));
        RaffleManager.CreateRaffleParams memory _params = RaffleManager.CreateRaffleParams({
            prizeName: "BigMac",
            timeLength: 30,
            fee: 0,
            name: "Big Mac Contest",
            feeToken: address(0),
            merkleRoot: bytes32(""),
            automation: false,
            participants: participants,
            totalWinners: 1,
            entriesPerUser: 1
        });

        vm.expectEmit(true, true, true, true);
        emit RaffleCreated("BigMac", 30, 0, address(0), false);
        vm.prank(raffleAdmin);
        LinkTokenInterface(address(customLINK)).transferAndCall(
            address(raffleManager), 5 ether, bytes(abi.encode(_params))
        );
    }

    function customTokenRaffleFixture() public {
        vm.startPrank(admin);
        customToken = new ERC20Mock("Custom Token", "CT");
        RaffleManager.CreateRaffleParams memory _params = RaffleManager.CreateRaffleParams({
            prizeName: "BigMac",
            timeLength: 30,
            fee: 1 ether,
            name: "Big Mac Contest",
            feeToken: address(customToken),
            merkleRoot: bytes32(""),
            automation: false,
            participants: new bytes32[](0),
            totalWinners: 1,
            entriesPerUser: 1
        });

        vm.stopPrank();
        vm.expectEmit(true, true, true, true);
        emit RaffleCreated("BigMac", 30, 1 ether, address(customToken), false);
        vm.prank(raffleAdmin);
        LinkTokenInterface(address(customLINK)).transferAndCall(
            address(raffleManager), 5 ether, bytes(abi.encode(_params))
        );
    }

    function gasTokenRaffleFixture() public {
        RaffleManager.CreateRaffleParams memory _params = RaffleManager.CreateRaffleParams({
            prizeName: "BigMac",
            timeLength: 30,
            fee: 1 ether,
            name: "Big Mac Contest",
            feeToken: address(customToken),
            merkleRoot: bytes32(""),
            automation: false,
            participants: new bytes32[](0),
            totalWinners: 1,
            entriesPerUser: 100
        });
        vm.expectEmit(true, true, true, true);
        emit RaffleCreated("BigMac", 30, 1 ether, address(0), false);
        vm.prank(raffleAdmin);
        LinkTokenInterface(address(customLINK)).transferAndCall(
            address(raffleManager), 5 ether, bytes(abi.encode(_params))
        );
    }

    function test_createRaffle_Success() public {
        successFixture();
    }

    function test_createRaffle_CheckVariableSetup_Dynamic_NoPermissions_NoFeeToken() public {
        successFixture();
        RaffleManager.RaffleInstance memory raffle = raffleManager.getRaffle(0);
        assertFalse(raffle.base.permissioned);
        assertEq(uint8(raffle.base.raffleType), uint8(RaffleManager.RaffleType.DYNAMIC));
        assertFalse(raffle.base.feeToken);
    }

    function test_createRaffle_CheckVariableSetup_Dynamic_NoPermissions_FeeToken() public {
        RaffleManager.CreateRaffleParams memory _params = RaffleManager.CreateRaffleParams({
            prizeName: "BigMac",
            timeLength: 30,
            fee: 1 ether,
            name: "Big Mac Contest",
            feeToken: makeAddr("doge"),
            merkleRoot: bytes32(""),
            automation: false,
            participants: new bytes32[](0),
            totalWinners: 1,
            entriesPerUser: 1
        });
        vm.prank(admin);
        customLINK.transfer(raffleAdmin, 20 ether);
        vm.prank(raffleAdmin);
        LinkTokenInterface(address(customLINK)).transferAndCall(
            address(raffleManager), 5 ether, bytes(abi.encode(_params))
        );

        RaffleManager.RaffleInstance memory raffle = raffleManager.getRaffle(0);
        assertFalse(raffle.base.permissioned);
        assertEq(uint8(raffle.base.raffleType), uint8(RaffleManager.RaffleType.DYNAMIC));
        assert(raffle.base.feeToken);
    }

    function test_createRaffle_CheckVariableSetup_Dynamic_Permissions() public {
        RaffleManager.CreateRaffleParams memory _params = RaffleManager.CreateRaffleParams({
            prizeName: "BigMac",
            timeLength: 30,
            fee: 1 ether,
            name: "Big Mac Contest",
            feeToken: makeAddr("doge"),
            merkleRoot: bytes32("merkleRoot"),
            automation: false,
            participants: new bytes32[](0),
            totalWinners: 1,
            entriesPerUser: 1
        });
        vm.prank(raffleAdmin);
        LinkTokenInterface(address(customLINK)).transferAndCall(
            address(raffleManager), 5 ether, bytes(abi.encode(_params))
        );
        RaffleManager.RaffleInstance memory raffle = raffleManager.getRaffle(0);
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
        bytes32 contestant = raffleManager.getRaffle(0).contestants[0];
        assert(contestant == keccak256(abi.encodePacked(user1)));
    }

    function testRevert_enterRaffle_RaffleIsNotLive() public {
        successFixture();
        vm.prank(user1);
        vm.expectRevert("Raffle is not live");
        raffleManager.enterRaffle(2, 1, new bytes32[](0));
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

    function test_enterRaffle_CustomToken() public {
        customTokenRaffleFixture();
        vm.prank(admin);
        customToken.transfer(user1, 100 ether);
        vm.startPrank(user1);
        customToken.approve(address(raffleManager), 1 ether);
        raffleManager.enterRaffle(0, 1, new bytes32[](0));
        vm.stopPrank();
    }

    function testRevert_enterRaffle_NotEnoughCustomToken() public {
        customTokenRaffleFixture();
        vm.startPrank(user1);
        customToken.approve(address(raffleManager), 1 ether);
        vm.expectRevert("ERC20: transfer amount exceeds balance");
        raffleManager.enterRaffle(0, 1, new bytes32[](0));
        vm.stopPrank();
    }

    function test_enterRaffle_GasToken() public {
        gasTokenRaffleFixture();
        vm.deal(user1, 1 ether);
        vm.startPrank(user1);
        raffleManager.enterRaffle{value: 1 ether}(0, 1, new bytes32[](0));
        vm.stopPrank();
    }

    function test_enterRaffle_GasToken100Entries() public {
        gasTokenRaffleFixture();
        vm.deal(user1, 100 ether);
        vm.startPrank(user1);
        raffleManager.enterRaffle{value: 100 ether}(0, 100, new bytes32[](0));
        vm.stopPrank();
    }

    function testRevert_enterRaffle_NotEnoughGasToken() public {
        gasTokenRaffleFixture();
        vm.deal(user1, 0.1 ether);
        vm.startPrank(user1);
        vm.expectRevert("Not enough gas token to join raffle");
        raffleManager.enterRaffle{value: 0.1 ether}(0, 1, new bytes32[](0));
        vm.stopPrank();
    }

    function testRevert_onTokenTransfer_NotRaffleOwner() public {
        vm.prank(admin);
        customLINK.transfer(user1, 1 ether);
        staticRaffleFixture();
        vm.startPrank(user1);
        vm.expectRevert("Only owner can pick winner");
        customLINK.transferAndCall(address(raffleManager), 1 ether, bytes(abi.encode(0)));
        vm.stopPrank();
    }

    function test_updateRaffleOwner_CanUpdateRaffleOwner() public {
        staticRaffleFixture();
        vm.expectEmit(true, true, true, true);
        emit RaffleOwnerUpdated(0, raffleAdmin, user1);
        vm.prank(raffleAdmin);
        raffleManager.updateRaffleOwner(0, user1);
        assert(raffleManager.getRaffle(0).owner == user1);
    }

    function testRevert_updateRaffleOwner_NotOwner() public {
        staticRaffleFixture();
        vm.prank(admin);
        vm.expectRevert();
        raffleManager.updateRaffleOwner(0, user1);
    }

    function test_getUserEntries_ReturnTotalUserEntries() public {
        merkleFixture();
        vm.prank(addrA);
        raffleManager.enterRaffle(0, 1, proofA);
        vm.prank(addrB);
        raffleManager.enterRaffle(0, 1, proofB);
        assertEq(raffleManager.getUserEntries(0, addrA), 1);
        assertEq(raffleManager.getUserEntries(0, addrB), 1);
    }

    function test_requestRandomWords_createsRequestStatusForRaffle() public {
        staticRaffleFixture();
        vm.prank(raffleAdmin);
        customLINK.transferAndCall(address(raffleManager), 1 ether, bytes(abi.encode(0)));
        RaffleManager.RaffleInstance memory r = raffleManager.getRaffle(0);
        assertEq(r.requestStatus.paid, 0.1 ether);
    }

    function test_fulfillRandomWords_receiveRandomNumbers() public {
        successFixture();
        vm.prank(user1);
        raffleManager.enterRaffle(0, 1, new bytes32[](0));
        bytes32[] memory winners = new bytes32[](1);
        winners[0] = keccak256(abi.encodePacked(user1));

        vm.prank(raffleAdmin);
        vrfMock.fulfillRandomWords(1, address(raffleManager));
    }

    function test_fulfillRandomWords_fuzzWinnersContestants(uint8 winners, uint16 contestants) public {
        vm.assume(winners > 20 && winners <= 200);
        vm.assume(contestants > 0 && contestants >= winners && contestants <= 2000);
        successFixtureMultipleWinners(winners, true);

        for (uint256 i = 0; i < contestants; i++) {
            address user = makeAddr(string(abi.encodePacked(i)));
            vm.deal(user, 1 ether);
            vm.prank(user);
            raffleManager.enterRaffle{value: 1 ether}(0, 1, new bytes32[](0));
        }

        vm.prank(admin);
        customLINK.transfer(address(raffleAdmin), 1 ether);

        vm.prank(raffleAdmin);
        customLINK.transferAndCall(address(raffleManager), 0.1 ether, bytes(abi.encode(0)));
        vrfMock.fulfillRandomWords(1, address(raffleManager));
        RaffleManager.RaffleInstance memory r = raffleManager.getRaffle(0);

        assertEq(uint8(r.raffleState), uint8(3));

        vm.prank(raffleAdmin);
        (bool upkeepNeeded, bytes memory performData) = raffleManager.checkUpkeep(abi.encode(0));
        assertEq(upkeepNeeded, true);
        (uint256 id, bytes32[] memory users) = abi.decode(performData, (uint256, bytes32[]));
        assertEq(id, 0);

        vm.prank(address(keeperAddress));
        vm.expectEmit(true, true, true, true);
        emit RaffleWon(0, users);
        raffleManager.performUpkeep(performData);

        bool mul = false;
        for (uint256 i = 0; i < r.winners.length; i++) {
            for (uint256 j = i + 1; j < r.winners.length; j++) {
                if (r.winners[i] == r.winners[j]) {
                    mul = true;
                }
            }
            assertTrue(mul == false);
        }
    }

    function test_claimPrize_success() public {
        successFixtureWithETH();
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        raffleManager.enterRaffle{value: 1 ether}(0, 1, new bytes32[](0));

        vm.startPrank(raffleAdmin);
        customLINK.transferAndCall(address(raffleManager), 2 ether, bytes(abi.encode(0)));
        vrfMock.fulfillRandomWords(1, address(raffleManager));
        vm.stopPrank();

        vm.prank(raffleAdmin);
        (bool upkeepNeeded, bytes memory performData) = raffleManager.checkUpkeep(abi.encode(0));
        assertEq(upkeepNeeded, true);
        (uint256 id, bytes32[] memory users) = abi.decode(performData, (uint256, bytes32[]));
        assertEq(id, 0);

        vm.prank(address(keeperAddress));
        vm.expectEmit(true, true, true, true);
        emit RaffleWon(0, users);
        raffleManager.performUpkeep(performData);

        assertEq(user1.balance, 0 ether);
        vm.prank(user1);
        raffleManager.claimPrize(0);
        assertEq(user1.balance, 1 ether);
    }

    function test_claimPrize_successCustomToken() public {
        successFixtureWithCustomToken();
        vm.prank(admin);
        customToken.transfer(user1, 100 ether);
        vm.startPrank(user1);
        customToken.approve(address(raffleManager), 1 ether);
        raffleManager.enterRaffle(0, 1, new bytes32[](0));
        vm.stopPrank();

        vm.prank(admin);
        customLINK.transfer(address(raffleAdmin), 5 ether);
        vm.startPrank(raffleAdmin);
        customLINK.transferAndCall(address(raffleManager), 2 ether, bytes(abi.encode(0)));
        vrfMock.fulfillRandomWords(1, address(raffleManager));
        vm.stopPrank();

        vm.prank(raffleAdmin);
        (bool upkeepNeeded, bytes memory performData) = raffleManager.checkUpkeep(abi.encode(0));
        assertEq(upkeepNeeded, true);
        (uint256 id, bytes32[] memory users) = abi.decode(performData, (uint256, bytes32[]));
        assertEq(id, 0);

        vm.prank(address(keeperAddress));
        vm.expectEmit(true, true, true, true);
        emit RaffleWon(0, users);
        raffleManager.performUpkeep(performData);

        vm.prank(user1);
        vm.expectEmit(true, true, true, true);
        emit RafflePrizeClaimed(0, user1, 1 ether);
        raffleManager.claimPrize(0);
    }

    function testRevert_eligableToEnd_notEnoughContestantsToWinners() public {
        successFixtureWithCustomTokenMultipleWinners();
        vm.startPrank(admin);
        customToken.transfer(user1, 5 ether);

        vm.stopPrank();
        vm.startPrank(user1);
        customToken.approve(address(raffleManager), 1 ether);
        raffleManager.enterRaffle(0, 1, new bytes32[](0));
        vm.stopPrank();

        vm.prank(admin);
        customLINK.transfer(address(raffleAdmin), 1 ether);
        vm.startPrank(raffleAdmin);
        vm.expectRevert("Not enough contestants to pick winner");
        customLINK.transferAndCall(address(raffleManager), 0.1 ether, bytes(abi.encode(0)));
        vm.stopPrank();
    }

    function testRevert_claimPrize_customTokenAlreadyClaimed() public {
        successFixtureWithCustomToken();
        vm.prank(admin);
        customToken.transfer(user1, 100 ether);
        vm.startPrank(user1);
        customToken.approve(address(raffleManager), 1 ether);
        raffleManager.enterRaffle(0, 1, new bytes32[](0));
        vm.stopPrank();

        vm.startPrank(raffleAdmin);
        customLINK.transferAndCall(address(raffleManager), 2 ether, bytes(abi.encode(0)));
        vrfMock.fulfillRandomWords(1, address(raffleManager));
        vm.stopPrank();

        vm.prank(raffleAdmin);
        (bool upkeepNeeded, bytes memory performData) = raffleManager.checkUpkeep(abi.encode(0));
        assertEq(upkeepNeeded, true);
        (uint256 id, bytes32[] memory users) = abi.decode(performData, (uint256, bytes32[]));
        assertEq(id, 0);

        vm.prank(address(keeperAddress));
        vm.expectEmit(true, true, true, true);
        emit RaffleWon(0, users);
        raffleManager.performUpkeep(performData);

        vm.prank(user1);
        raffleManager.claimPrize(0);

        vm.prank(user1);
        vm.expectRevert("Prize already claimed");
        raffleManager.claimPrize(0);
    }

    function testRevert_claimPrize_prizeAlreadyClaimed() public {
        successFixtureWithETH();
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        raffleManager.enterRaffle{value: 1 ether}(0, 1, new bytes32[](0));

        vm.startPrank(raffleAdmin);
        customLINK.transferAndCall(address(raffleManager), 2 ether, bytes(abi.encode(0)));
        vrfMock.fulfillRandomWords(1, address(raffleManager));
        vm.stopPrank();

        vm.prank(raffleAdmin);
        (bool upkeepNeeded, bytes memory performData) = raffleManager.checkUpkeep(abi.encode(0));
        assertEq(upkeepNeeded, true);
        (uint256 id, bytes32[] memory users) = abi.decode(performData, (uint256, bytes32[]));
        assertEq(id, 0);

        vm.prank(address(keeperAddress));
        vm.expectEmit(true, true, true, true);
        emit RaffleWon(0, users);
        raffleManager.performUpkeep(performData);

        vm.prank(user1);
        raffleManager.claimPrize(0);

        vm.prank(user1);
        vm.expectRevert("Prize already claimed");
        raffleManager.claimPrize(0);
    }

    function testRevert_claimPrize_notRaffleWinner() public {
        successFixtureWithETH();
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        raffleManager.enterRaffle{value: 1 ether}(0, 1, new bytes32[](0));

        vm.startPrank(raffleAdmin);
        customLINK.transferAndCall(address(raffleManager), 2 ether, bytes(abi.encode(0)));
        vrfMock.fulfillRandomWords(1, address(raffleManager));
        vm.stopPrank();

        vm.prank(raffleAdmin);
        (bool upkeepNeeded, bytes memory performData) = raffleManager.checkUpkeep(abi.encode(0));
        assertEq(upkeepNeeded, true);
        (uint256 id, bytes32[] memory users) = abi.decode(performData, (uint256, bytes32[]));
        assertEq(id, 0);

        vm.prank(address(keeperAddress));
        vm.expectEmit(true, true, true, true);
        emit RaffleWon(0, users);
        raffleManager.performUpkeep(performData);

        vm.prank(user2);
        vm.expectRevert("You are not eligible to claim this prize");
        raffleManager.claimPrize(0);
    }

    function test_fulfillRandomWords_pickWinnerFromStatic() public {
        staticRaffleFixture();
        vm.prank(raffleAdmin);
        vrfMock.fulfillRandomWords(1, address(raffleManager));
        RaffleManager.RaffleInstance memory r = raffleManager.getRaffle(0);
        for (uint256 i = 0; i < r.winners.length; i++) {
            assertEq(r.winners[i], keccak256(abi.encodePacked(email)));
        }
    }

    function test_withdrawLink_withdrawExtraLinkNotUsedForGas() public {
        vm.prank(admin);
        customLINK.transfer(address(raffleAdmin), 5 ether);
        staticRaffleFixture();
        vm.startPrank(raffleAdmin);
        customLINK.transferAndCall(address(raffleManager), 2 ether, bytes(abi.encode(0)));
        vrfMock.fulfillRandomWords(1, address(raffleManager));
        raffleManager.withdrawLink(0);
    }

    function testRevert_withdrawLink_alreadyWithdrawn() public {
        vm.prank(admin);
        customLINK.transfer(address(raffleAdmin), 5 ether);
        staticRaffleFixture();
        vm.startPrank(raffleAdmin);
        customLINK.transferAndCall(address(raffleManager), 2 ether, bytes(abi.encode(0)));
        vrfMock.fulfillRandomWords(1, address(raffleManager));
        raffleManager.withdrawLink(0);

        vm.expectRevert("Already withdrawn");
        raffleManager.withdrawLink(0);
    }

    function testRevert_withdrawLink_nothingToClaim() public {
        vm.prank(admin);
        customLINK.transfer(address(raffleAdmin), 5 ether);
        staticRaffleFixture();
        vm.startPrank(raffleAdmin);
        customLINK.transferAndCall(address(raffleManager), 0.1 ether, bytes(abi.encode(0)));
        vrfMock.fulfillRandomWords(1, address(raffleManager));

        vm.expectRevert("Nothing to claim");
        raffleManager.withdrawLink(0);
    }

    function testRevert_withdrawLink_notOwnerOfRaffle(address notOwner) public {
        vm.assume(notOwner != raffleAdmin);
        vm.prank(admin);
        customLINK.transfer(address(raffleAdmin), 5 ether);
        staticRaffleFixture();
        vm.startPrank(raffleAdmin);
        customLINK.transferAndCall(address(raffleManager), 0.1 ether, bytes(abi.encode(0)));
        vrfMock.fulfillRandomWords(1, address(raffleManager));
        vm.stopPrank();

        vm.prank(notOwner);
        vm.expectRevert();
        raffleManager.withdrawLink(0);
    }

    function test_checkUpkeep_UpkeepNeededForFinishingRaffle() public {
        staticRaffleFixture();
        vm.prank(admin);
        customLINK.transfer(address(raffleAdmin), 5 ether);
        vm.startPrank(raffleAdmin);
        customLINK.transferAndCall(address(raffleManager), 2 ether, bytes(abi.encode(0)));
        vrfMock.fulfillRandomWords(1, address(raffleManager));
        vm.stopPrank();

        vm.prank(raffleAdmin);
        (bool upkeepNeeded, bytes memory performData) = raffleManager.checkUpkeep(abi.encode(0));
        assertEq(upkeepNeeded, true);
        (uint256 id, bytes32[] memory users) = abi.decode(performData, (uint256, bytes32[]));
        assertEq(id, 0);
        assertEq(users.length, 1);
    }

    function test_performUpkeep_FinishRaffle() public {
        staticRaffleFixture();
        vm.prank(admin);
        customLINK.transfer(address(raffleAdmin), 5 ether);
        vm.startPrank(raffleAdmin);
        customLINK.transferAndCall(address(raffleManager), 2 ether, bytes(abi.encode(0)));
        vrfMock.fulfillRandomWords(1, address(raffleManager));
        vm.stopPrank();

        vm.prank(raffleAdmin);
        (bool upkeepNeeded, bytes memory performData) = raffleManager.checkUpkeep(abi.encode(0));
        assertEq(upkeepNeeded, true);
        (uint256 id, bytes32[] memory users) = abi.decode(performData, (uint256, bytes32[]));
        assertEq(id, 0);
        assertEq(users.length, 1);

        vm.prank(address(keeperAddress));
        vm.expectEmit(true, true, true, true);
        emit RaffleWon(0, users);
        raffleManager.performUpkeep(performData);
    }

    function test_integrationTest_picksWinners(uint256 winners, uint256 contestants) public {
        winners = bound(winners, 1, 5);
        contestants = bound(contestants, 10, 50);
        successFixtureMultipleWinners(uint8(winners), true);
        for (uint256 i = 0; i < contestants; i++) {
            address user = makeAddr(string(abi.encodePacked(i)));
            vm.deal(user, 1 ether);
            vm.prank(user);
            raffleManager.enterRaffle{value: 1 ether}(0, 1, new bytes32[](0));
        }
        vm.prank(admin);
        customLINK.transfer(address(raffleAdmin), 5 ether);
        vm.startPrank(raffleAdmin);
        customLINK.transferAndCall(address(raffleManager), 2 ether, bytes(abi.encode(0)));
        vrfMock.fulfillRandomWords(1, address(raffleManager));
        vm.stopPrank();

        vm.prank(raffleAdmin);
        (bool upkeepNeeded, bytes memory performData) = raffleManager.checkUpkeep(abi.encode(0));
        assertEq(upkeepNeeded, true);
        (uint256 id, bytes32[] memory users) = abi.decode(performData, (uint256, bytes32[]));
        assertEq(id, 0);
        assertEq(users.length, winners);

        vm.prank(address(keeperAddress));
        vm.expectEmit(true, true, true, true);
        emit RaffleWon(0, users);
        raffleManager.performUpkeep(performData);

        uint256 totalClaimed = 0;
        for (uint256 i = 0; i < contestants; i++) {
            for (uint256 j = 0; j < winners; j++) {
                if (keccak256(abi.encodePacked(makeAddr(string(abi.encodePacked(i))))) == users[j]) {
                    vm.prank(makeAddr(string(abi.encodePacked(i))));
                    raffleManager.claimPrize(0);
                    totalClaimed++;
                }
            }
        }
        assertEq(totalClaimed, users.length);
    }

    function test_fulfillRandomWords_200winners() public {
        uint8 winners = 200;
        successFixtureMultipleWinners(winners, true);

        for (uint256 i = 0; i < 2000; i++) {
            address user = makeAddr(string(abi.encodePacked(i)));
            vm.deal(user, 1 ether);
            vm.prank(user);
            raffleManager.enterRaffle{value: 1 ether}(0, 1, new bytes32[](0));
        }

        vm.prank(admin);
        customLINK.transfer(address(raffleAdmin), 1 ether);

        vm.prank(raffleAdmin);
        customLINK.transferAndCall(address(raffleManager), 0.1 ether, bytes(abi.encode(0)));
        vrfMock.fulfillRandomWords(1, address(raffleManager));
        RaffleManager.RaffleInstance memory r = raffleManager.getRaffle(0);

        assertEq(uint8(r.raffleState), uint8(3));

        vm.prank(raffleAdmin);
        (bool upkeepNeeded, bytes memory performData) = raffleManager.checkUpkeep(abi.encode(0));
        assertEq(upkeepNeeded, true);
        (uint256 id, bytes32[] memory users) = abi.decode(performData, (uint256, bytes32[]));
        assertEq(id, 0);

        vm.prank(address(keeperAddress));
        vm.expectEmit(true, true, true, true);
        emit RaffleWon(0, users);
        raffleManager.performUpkeep(performData);

        bool mul = false;
        for (uint256 i = 0; i < r.winners.length; i++) {
            for (uint256 j = i + 1; j < r.winners.length; j++) {
                if (r.winners[i] == r.winners[j]) {
                    mul = true;
                }
            }
            assertTrue(mul == false);
        }
    }

    function test_checkIfWon_checkWonFromStatic() public {
        staticRaffleFixture();
        assertTrue(raffleManager.checkIfEntered(0, email));

        vm.prank(admin);
        customLINK.transfer(address(raffleAdmin), 5 ether);
        vm.startPrank(raffleAdmin);
        customLINK.transferAndCall(address(raffleManager), 2 ether, bytes(abi.encode(0)));
        vrfMock.fulfillRandomWords(1, address(raffleManager));
        vm.stopPrank();

        vm.prank(raffleAdmin);
        (bool upkeepNeeded, bytes memory performData) = raffleManager.checkUpkeep(abi.encode(0));
        assertEq(upkeepNeeded, true);
        (uint256 id, bytes32[] memory users) = abi.decode(performData, (uint256, bytes32[]));
        assertEq(id, 0);
        assertEq(users.length, 1);

        vm.prank(address(keeperAddress));
        vm.expectEmit(true, true, true, true);
        emit RaffleWon(0, users);
        raffleManager.performUpkeep(performData);
        RaffleManager.RaffleInstance memory r = raffleManager.getRaffle(0);
        for (uint256 i = 0; i < r.winners.length; i++) {
            assertTrue(raffleManager.checkIfWon(0, email));
        }
    }
}
