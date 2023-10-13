// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IKeeperRegistrar {
    function register(
        string memory name,
        bytes calldata encryptedEmail,
        address upkeepContract,
        uint32 gasLimit,
        address adminAddress,
        bytes calldata checkData,
        bytes calldata offchainConfig,
        uint96 amount,
        address sender
    ) external;
}
