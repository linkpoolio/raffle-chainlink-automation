import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const keyHash =
  "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15";
const callbackGasLimit = 100000;
const requestConfirmations = 3;
const COORDINATOR = "0x3d2341ADb2D31f1c5530cDC622016af293177AE0";
const subscriptionID =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

describe("Raffle", function () {
  async function deploRaffle() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Raffle = await ethers.getContractFactory("Raffle");
    const raffle = await Raffle.deploy(
      COORDINATOR,
      subscriptionID,
      requestConfirmations,
      callbackGasLimit,
      keyHash
    );

    return { raffle, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should not have a live raffle", async function () {
      const { raffle } = await loadFixture(deploRaffle);

      expect(await raffle.raffleLive()).to.equal(false);
    });
  });

  describe("Raffle actions", function () {
    it("Should create new raffle", async function () {
      const { raffle } = await loadFixture(deploRaffle);
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
      const { raffle } = await loadFixture(deploRaffle);

      expect(await raffle.raffleLive()).to.equal(false);
    });
    it("Should be able to join a live raffle", async function () {
      const { raffle } = await loadFixture(deploRaffle);
      await expect(raffle.joinRaffle({ value: ethers.utils.parseEther("1") }))
        .not.to.be.reverted;
    });

    it("Should not be able to join a raffle with insuffecient funds", async function () {
      const { raffle } = await loadFixture(deploRaffle);

      expect(
        await raffle.joinRaffle({ value: ethers.utils.parseEther("1") })
      ).to.be.revertedWith("Not enough ETH to join raffle");
    });

    it("Should not be able to join a raffle when live status is false", async function () {
      const Raffle = await ethers.getContractFactory("Raffle");
      const raffle = await Raffle.deploy(
        COORDINATOR,
        subscriptionID,
        requestConfirmations,
        callbackGasLimit,
        keyHash
      );
      expect(
        await raffle.joinRaffle({ value: ethers.utils.parseEther("1") })
      ).to.be.revertedWith("Raffle is not live");
    });
  });
});
