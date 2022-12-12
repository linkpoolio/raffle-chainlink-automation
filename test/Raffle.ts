import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { deploy } from "./utils/helpers";

enum RaffleState {
  staged,
  live,
  finished,
}

describe("Raffle", function () {
  let keyHash: string,
    callbackGasLimit: number,
    requestConfirmations: number,
    COORDINATOR: string,
    subscriptionId: any,
    raffle: any,
    vrfCoordinatorV2Mock: any;

  beforeEach(async () => {
    const [owner, otherAccount] = await ethers.getSigners();
    const BASE_FEE = "2500000000";
    const GAS_PRICE_LINK = 1e9;
    keyHash =
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15";
    callbackGasLimit = 100000;
    requestConfirmations = 3;
    COORDINATOR = "0x3d2341ADb2D31f1c5530cDC622016af293177AE0";
    vrfCoordinatorV2Mock = await deploy("VRFCoordinatorV2Mock", [
      BASE_FEE,
      GAS_PRICE_LINK,
    ]);
    const tx = await vrfCoordinatorV2Mock.createSubscription();
    let txReceipt = await tx.wait(1);
    subscriptionId = txReceipt.events[0].args.subId;
    await vrfCoordinatorV2Mock.fundSubscription(
      subscriptionId.toNumber(),
      ethers.utils.parseEther("5")
    );
    raffle = await deploy("Raffle", [
      COORDINATOR,
      subscriptionId,
      requestConfirmations,
      callbackGasLimit,
      keyHash,
    ]);
    await vrfCoordinatorV2Mock.addConsumer(subscriptionId, raffle.address);
  });

  describe("Deployment", function () {
    it("sets requestConfig", async () => {
      const rc = await raffle.requestConfig();
      assert.equal(rc[4], keyHash);
      assert.equal(rc[0], subscriptionId.toNumber());
    });
  });

  describe("Raffle actions", function () {
    it("Should create new raffle", async function () {
      const prizeStruct = { prizeName: "N64" };
      await raffle.createRaffle(
        prizeStruct,
        60,
        ethers.utils.parseEther("1"),
        "first one",
        { value: ethers.utils.parseEther("1") }
      );
      const r = await raffle.getRaffle(1);
      expect(r.prize.prizeName).to.equal("N64");
    });
    it("Should be able to join a live raffle", async function () {
      const prizeStruct = { prizeName: "N64" };
      await raffle.createRaffle(
        prizeStruct,
        60,
        ethers.utils.parseEther("1"),
        "first one",
        { value: ethers.utils.parseEther("1") }
      );
      await expect(
        raffle.joinRaffle(1, { value: ethers.utils.parseEther("1") })
      ).not.to.be.reverted;
    });

    it("Should not be able to join a raffle with insuffecient funds", async function () {
      const prizeStruct = { prizeName: "N64" };
      await raffle.createRaffle(
        prizeStruct,
        60,
        ethers.utils.parseEther("1"),
        "first one",
        { value: ethers.utils.parseEther("1") }
      );
      await expect(
        raffle.joinRaffle(1, { value: ethers.utils.parseEther("0.8") })
      ).to.be.revertedWith("Not enough ETH to join raffle");
    });

    it("Should not be able to join a raffle when live status is false", async function () {
      await expect(
        raffle.joinRaffle(1, { value: ethers.utils.parseEther("1") })
      ).to.be.revertedWith("Raffle is not live");
    });
  });
});
