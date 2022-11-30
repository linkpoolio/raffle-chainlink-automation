import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deploy } from "./utils/helpers";

describe("Raffle", function () {
  let keyHash: string,
    callbackGasLimit: number,
    requestConfirmations: number,
    COORDINATOR: string,
    subscriptionID: string,
    raffle: any;

  beforeEach(async () => {
    const [owner, otherAccount] = await ethers.getSigners();
    keyHash =
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15";
    callbackGasLimit = 100000;
    requestConfirmations = 3;
    COORDINATOR = "0x3d2341ADb2D31f1c5530cDC622016af293177AE0";
    subscriptionID =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    raffle = await deploy("Raffle", [
      COORDINATOR,
      subscriptionID,
      requestConfirmations,
      callbackGasLimit,
      keyHash,
    ]);
  });

  describe("Deployment", function () {
    it("Should not have a live raffle", async function () {
      expect(await raffle.raffleLive()).to.equal(false);
    });
  });

  describe("Raffle actions", function () {
    it("Should create new raffle", async function () {
      const prizeStruct = { prizeName: "N64" };
      await raffle.createRaffle(
        [prizeStruct],
        1,
        60,
        ethers.utils.parseEther("1"),
        "first one"
      );
      expect(await raffle.prizes(1, 0)).to.equal("N64");
    });
    it("Should not have a live raffle", async function () {
      expect(await raffle.raffleLive()).to.equal(false);
    });
    it("Should be able to join a live raffle", async function () {
      await expect(raffle.joinRaffle({ value: ethers.utils.parseEther("1") }))
        .not.to.be.reverted;
    });

    it("Should not be able to join a raffle with insuffecient funds", async function () {
      expect(
        await raffle.joinRaffle({ value: ethers.utils.parseEther("1") })
      ).to.be.revertedWith("Not enough ETH to join raffle");
    });

    it("Should not be able to join a raffle when live status is false", async function () {
      expect(
        await raffle.joinRaffle({ value: ethers.utils.parseEther("1") })
      ).to.be.revertedWith("Raffle is not live");
    });
  });
});
