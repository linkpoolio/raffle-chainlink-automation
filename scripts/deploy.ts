import { network } from "hardhat";
import { deploy } from "../test/utils/helpers";
import { networkConfig } from "../network.config";

async function main() {
  const chainId =
    network.config.chainId != undefined ? network.config.chainId : 31337;
  const networkName = {
    name: networkConfig[chainId].name,
    subscriptionId: networkConfig[chainId].subscriptionId,
    requestConfirmations: networkConfig[chainId].requestConfirmations,
    callbackGasLimit: networkConfig[chainId].callbackGasLimit,
    vrfCoordinatorV2: networkConfig[chainId].vrfCoordinatorV2,
    keepersRegistry: networkConfig[chainId].keepersRegistry,
    keyHash: networkConfig[chainId].keyHash,
  };

  const raffle = await deploy("Raffle", [
    networkName.vrfCoordinatorV2,
    networkName.subscriptionId,
    networkName.requestConfirmations,
    networkName.callbackGasLimit,
    networkName.keyHash,
    networkName.keepersRegistry,
  ]);

  await raffle.deployed();

  console.log(`Raffle deployed to ${raffle.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
