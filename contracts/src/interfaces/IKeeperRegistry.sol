// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {
    AutomationRegistryInterface,
    State,
    Config
} from "@chainlink/contracts/src/v0.8/interfaces/AutomationRegistryInterface1_3.sol";

interface IKeeperRegistry is AutomationRegistryInterface {
    function withdrawFunds(uint256 id, address to) external;
}
