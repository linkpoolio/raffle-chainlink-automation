// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {RaffleManager} from "../contracts/RaffleManager.sol";

contract RaffleManagerScript is Script {
    RaffleManager raffleManager;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // goerli deployment
        raffleManager = new RaffleManager(
            0x708701a1DfF4f478de54383E49a627eD4852C816,
            3,
            100000,
            0x02777053d6764996e594c3E88AF1D58D5363a2e6,
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB
        );

        vm.stopBroadcast();
    }
}
