// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "@src/RaffleManager.sol";
import {ERC20Mock} from "@src/mock/ERC20Mock.sol";
import {ERC677Mock} from "@src/mock/ERC677Mock.sol";
import {VRFV2WrapperMock} from "@src/mock/VRFV2WrapperMock.sol";

contract RaffleManagerInvariants is Test {
    RaffleManager raffleManager;
    ERC20Mock customToken;
    VRFV2WrapperMock vrfMock;
    address wrapperAddress;
    uint16 requestConfirmations;
    uint32 callbackGasLimit;
    address keeperAddress;
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

    function setUp() external {
        admin = makeAddr("admin");
        raffleAdmin = makeAddr("raffleAdmin");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        user3 = makeAddr("user3");
        user4 = makeAddr("user4");
        user5 = makeAddr("user5");
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
        email = "test@test.com";
        vm.startPrank(admin);
        customLINK = new ERC677Mock("Chainlink", "LINK", 1000000 ether);
        vrfMock = new VRFV2WrapperMock(BASE_FEE, GAS_PRICE_LINK);
        raffleManager = new RaffleManager(
            address(vrfMock),
            requestConfirmations,
            callbackGasLimit,
            keeperAddress,
            address(customLINK)
        );
        vm.stopPrank();
    }

    function invariant_A() external {
        (uint32 gas,,) = raffleManager.requestConfig();
        assertEq(gas, 100000);
    }
}
