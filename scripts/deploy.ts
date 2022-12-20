import { ethers } from "hardhat";
import { Raffle__factory } from "../typechain-types";

async function main() {
  const keyHash =
    "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15";
  const callbackGasLimit = 100000;
  const requestConfirmations = 3;
  const COORDINATOR = "0x3d2341ADb2D31f1c5530cDC622016af293177AE0";
  const subscriptionID =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  const keeperRegistry = "0x0000000000000000000000000000000000000000";

  const Raffle = await ethers.getContractFactory("Raffle");
  const raffle = await Raffle.deploy(
    COORDINATOR,
    subscriptionID,
    requestConfirmations,
    callbackGasLimit,
    keyHash,
    keeperRegistry
  );

  await raffle.deployed();

  console.log(`Raffle deployed to ${raffle.address}`);
  const prizeStruct = { prizeName: "N64" };
  await raffle.createRaffle(
    prizeStruct,
    60,
    ethers.utils.parseEther("1"),
    ethers.utils.formatBytes32String("---your name here---"),
    { value: ethers.utils.parseEther("1") }
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
