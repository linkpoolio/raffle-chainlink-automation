// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

interface IRaffleManager {
    function createRaffle(
        string memory prizeName,
        uint256 timeLength,
        uint256 fee,
        string memory name,
        address feeToken,
        bytes32 merkleRoot,
        bool automation,
        bytes32[] memory participants,
        uint8 totalWinners,
        uint8 entriesPerUser
    ) external payable;

    function enterRaffle(uint256 raffleId, uint8 entries, bytes32[] memory proof) external payable;

    function getWinners(uint256 raffleId) external view returns (bytes32[] memory);

    function claimPrize(uint256 raffleId) external;

    function setKeeperRegistryAddress(address newKeeperAddress) external;

    function setProvenanceHash(uint256 raffleId, bytes memory provenanceHash) external;

    function withdrawLink(uint256 raffleId) external;

    function claimableLink(uint256 raffleId) external view returns (uint256 claimable);

    function updateRaffleOwner(uint256 raffleId, address newAdmin) external;

    function isPaused() external view returns (bool);
}
