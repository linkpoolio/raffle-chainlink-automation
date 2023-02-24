// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "@src/RaffleManager.sol";
import {ERC20Mock} from "@src/mock/ERC20Mock.sol";
import {ERC677Mock} from "@src/mock/ERC677Mock.sol";
import {VRFV2WrapperMock} from "@src/mock/VRFV2WrapperMock.sol";

contract Handler {
    RaffleManager public raffleManger;

    constructor(RaffleManager _raffleManger) {
        raffleManger = _raffleManger;
    }
}
