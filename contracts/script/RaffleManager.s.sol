// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/StdJson.sol";
import {RaffleManager} from "../src/RaffleManager.sol";

contract RaffleManagerScript is Script {
    using stdJson for string;

    RaffleManager raffleManager;
    uint256 deployerPrivateKey;

    struct Config {
        uint32 callbackGasLimit;
        address keepersRegistry;
        address linkAddress;
        string name;
        uint16 requestConfirmations;
        address wrapperAddress;
    }

    function configureNetwork(string memory input) internal view returns (Config memory) {
        string memory inputDir = string.concat(vm.projectRoot(), "/script/input/");
        string memory chainDir = string.concat(vm.toString(block.chainid), "/");
        string memory file = string.concat(input, ".json");
        string memory data = vm.readFile(string.concat(inputDir, chainDir, file));
        bytes memory rawConfig = data.parseRaw("");
        return abi.decode(rawConfig, (Config));
    }

    function run() public {
        Config memory config = configureNetwork("config");
        if (block.chainid == 31337) {
            deployerPrivateKey = vm.envUint("ANVIL_PRIVATE_KEY");
        } else {
            deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        }

        vm.startBroadcast(deployerPrivateKey);

        raffleManager = new RaffleManager(
            config.wrapperAddress,
            config.requestConfirmations,
            config.callbackGasLimit,
            config.keepersRegistry,
            config.linkAddress
        );

        vm.stopBroadcast();
    }
}
