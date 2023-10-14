//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RegistrarMock {
    uint256 public currentId = 0;

    struct RegistrationParams {
        string name;
        bytes encryptedEmail;
        address upkeepContract;
        uint32 gasLimit;
        address adminAddress;
        bytes checkData;
        bytes offchainConfig;
        uint96 amount;
    }

    constructor() {}

    function registerUpkeep(RegistrationParams calldata params) external returns (uint256 id) {
        currentId++;
        return currentId;
    }
}
