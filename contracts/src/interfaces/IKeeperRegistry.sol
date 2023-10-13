// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {AutomationRegistryInterface} from
    "@chainlink/contracts/src/v0.8/automation/interfaces/2_0/AutomationRegistryInterface2_0.sol";

interface IKeeperRegistry is AutomationRegistryInterface {
    function getMaxPaymentForGas(uint32 gasLimit) external view returns (uint96 maxPayment);
}
