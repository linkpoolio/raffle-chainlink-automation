import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers, network } from "hardhat";
import { deploy } from "./utils/helpers";

enum RaffleState {
  staged,
  live,
  finished,
}
const zeroAddress = ethers.constants.AddressZero;
describe("Raffle", function () {
  let keyHash: string,
    callbackGasLimit: number,
    requestConfirmations: number,
    subscriptionId: any,
    raffle: any,
    vrfCoordinatorV2Mock: any,
    _owner: any,
    acct2: any,
    acct3: any;

  beforeEach(async () => {
    const [owner, account2, account3] = await ethers.getSigners();
    const BASE_FEE = "2500000000";
    const GAS_PRICE_LINK = 1e9;
    acct2 = account2;
    acct3 = account3;
    _owner = owner;
    keyHash =
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15";
    callbackGasLimit = 10000000;
    requestConfirmations = 3;
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
      vrfCoordinatorV2Mock.address,
      subscriptionId,
      requestConfirmations,
      callbackGasLimit,
      keyHash,
      owner.address,
    ]);
    await vrfCoordinatorV2Mock.addConsumer(subscriptionId, raffle.address);
    const prizeStruct = { prizeName: "N64", claimed: false };
    const name = ethers.utils.formatBytes32String("first one");
    await raffle.createRaffle(
      prizeStruct,
      60,
      ethers.utils.parseEther("1"),
      name,
      zeroAddress,
      { value: ethers.utils.parseEther("1") }
    );
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
      const r = await raffle.getRaffle(0);
      expect(r.prize.prizeName).to.equal("N64");
      const returnName = ethers.utils
        .toUtf8String(r.raffleName)
        .replace(/\0.*$/, "");
      expect(returnName).to.equal("first one");
    });
    it("Should be able to join a live raffle", async function () {
      await expect(
        raffle.enterRaffle(0, 2, { value: ethers.utils.parseEther("2") })
      ).not.to.be.reverted;
    });
    it("Should be able to join a live when entries dont match fees", async function () {
      await expect(
        raffle.enterRaffle(0, 2, { value: ethers.utils.parseEther("1.8") })
      ).to.be.reverted;
    });

    it("Should not be able to join a raffle with insuffecient funds", async function () {
      await expect(
        raffle.enterRaffle(0, 1, { value: ethers.utils.parseEther("0.8") })
      ).to.be.revertedWith("Not enough ETH to join raffle");
    });
    it("Should return amount of user entries to a raffle", async function () {
      await raffle.enterRaffle(0, 1, { value: ethers.utils.parseEther("1") });
      await raffle
        .connect(acct2)
        .enterRaffle(0, 1, { value: ethers.utils.parseEther("1") });
      assert((await raffle.getUserEntries(_owner.address, 0)) == 1);
      assert((await raffle.getUserEntries(acct2.address, 0)) == 1);
      assert((await raffle.getUserEntries(acct3.address, 0)) == 0);
    });
  });

  describe("checkUpkeep", function () {
    it("returns false if raffle is not live", async () => {
      await network.provider.send("evm_increaseTime", [1]);
      await network.provider.request({ method: "evm_mine", params: [] });
      const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x");
      assert(!upkeepNeeded);
    });
  });

  describe("performUpkeep", function () {
    it("can only run if checkupkeep is true", async () => {
      await network.provider.send("evm_increaseTime", [1]);
      await network.provider.request({ method: "evm_mine", params: [] });
      await expect(raffle.performUpkeep("0x")).to.not.emit(
        raffle,
        "RaffleStaged"
      );
    });
    it("emits RaffleStaged event on perform upkeep", async () => {
      await network.provider.send("evm_increaseTime", [100000000]);
      await network.provider.request({ method: "evm_mine", params: [] });
      await expect(raffle.performUpkeep("0x")).to.emit(raffle, "RaffleStaged");
    });
    it("emits RaffleClosed event on perform upkeep", async () => {
      await network.provider.send("evm_increaseTime", [100000000]);
      await network.provider.request({ method: "evm_mine", params: [] });
      await expect(raffle.performUpkeep("0x")).to.emit(raffle, "RaffleClosed");
    });
  });

  describe("fulfillRandomWords", function () {
    it("can only be called after performupkeep", async () => {
      await expect(
        vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.address)
      ).to.be.revertedWith("nonexistent request");
      await expect(
        vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address)
      ).to.be.revertedWith("nonexistent request");
    });
    it("runs vrf after raffle is staged and picks winner", async () => {
      await raffle.enterRaffle(0, 1, { value: ethers.utils.parseEther("1") });
      await network.provider.send("evm_increaseTime", [100000000]);
      await network.provider.request({ method: "evm_mine", params: [] });
      let tx = await raffle.performUpkeep("0x");
      await tx.wait(1);
      tx = await vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address);
      await tx.wait(1);
      await expect(tx).to.emit(raffle, "RaffleWon");
    });
    it("updates live raffles array", async () => {
      await raffle.enterRaffle(0, 1, { value: ethers.utils.parseEther("1") });
      await network.provider.send("evm_increaseTime", [100000000]);
      await network.provider.request({ method: "evm_mine", params: [] });
      let tx = await raffle.performUpkeep("0x");
      await tx.wait(1);
      tx = await vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address);
      await tx.wait(1);
      await expect(tx).to.emit(raffle, "RaffleWon");
      assert((await raffle.getLiveRaffles()).length == 0);
    });
  });

  describe("claim prizes", function () {
    it("able to claim prize after raffle is done", async () => {
      await raffle.enterRaffle(0, 1, { value: ethers.utils.parseEther("1") });
      await network.provider.send("evm_increaseTime", [100000000]);
      await network.provider.request({ method: "evm_mine", params: [] });
      let tx = await raffle.performUpkeep("0x");
      await tx.wait(1);
      tx = await vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address);
      await tx.wait(1);
      await expect(raffle.claimPrize(0)).to.emit(raffle, "RafflePrizeClaimed");
    });
    it("not able to claim prize if raffle is not finished", async () => {
      await raffle.enterRaffle(0, 1, { value: ethers.utils.parseEther("1") });
      await expect(raffle.claimPrize(0)).to.be.revertedWith(
        "Raffle is not finished"
      );
    });
    it("not able to claim prize if not winner", async () => {
      await raffle.enterRaffle(0, 1, { value: ethers.utils.parseEther("1") });
      await network.provider.send("evm_increaseTime", [100000000]);
      await network.provider.request({ method: "evm_mine", params: [] });
      let tx = await raffle.performUpkeep("0x");
      await tx.wait(1);
      tx = await vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address);
      await tx.wait(1);
      await expect(raffle.connect(acct2).claimPrize(0)).to.be.revertedWith(
        "You are not the winner of this raffle"
      );
    });
    it("able to claim prize after raffle is done", async () => {
      await raffle.enterRaffle(0, 1, { value: ethers.utils.parseEther("1") });
      await network.provider.send("evm_increaseTime", [100000000]);
      await network.provider.request({ method: "evm_mine", params: [] });
      let tx = await raffle.performUpkeep("0x");
      await tx.wait(1);
      tx = await vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address);
      await tx.wait(1);
      await expect(raffle.claimPrize(0)).to.emit(raffle, "RafflePrizeClaimed");
    });
  });
});

describe("Raffle with fee token", function () {
  let keyHash: string,
    callbackGasLimit: number,
    requestConfirmations: number,
    subscriptionId: any,
    raffle: any,
    vrfCoordinatorV2Mock: any,
    erc20WETHMock: any,
    _owner: any,
    acct2: any,
    acct3: any;

  beforeEach(async () => {
    const [owner, account2, account3] = await ethers.getSigners();
    const BASE_FEE = "2500000000";
    const GAS_PRICE_LINK = 1e9;
    acct2 = account2;
    acct3 = account3;
    _owner = owner;
    keyHash =
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15";
    callbackGasLimit = 10000000;
    requestConfirmations = 3;
    vrfCoordinatorV2Mock = await deploy("VRFCoordinatorV2Mock", [
      BASE_FEE,
      GAS_PRICE_LINK,
    ]);
    erc20WETHMock = await deploy("ERC20Mock", ["Wrapped ETH", "WETH"]);
    const tx = await vrfCoordinatorV2Mock.createSubscription();
    let txReceipt = await tx.wait(1);
    subscriptionId = txReceipt.events[0].args.subId;
    await vrfCoordinatorV2Mock.fundSubscription(
      subscriptionId.toNumber(),
      ethers.utils.parseEther("5")
    );
    raffle = await deploy("Raffle", [
      vrfCoordinatorV2Mock.address,
      subscriptionId,
      requestConfirmations,
      callbackGasLimit,
      keyHash,
      owner.address,
    ]);
    await vrfCoordinatorV2Mock.addConsumer(subscriptionId, raffle.address);
    const prizeStruct = { prizeName: "N64", claimed: false };
    const name = ethers.utils.formatBytes32String("first one");
    await raffle.createRaffle(
      prizeStruct,
      60,
      ethers.utils.parseEther("1"),
      name,
      erc20WETHMock.address
    );
  });

  describe("using tokens for fees", function () {
    it("create raffle with fee token", async () => {
      const currentRaffle = await raffle.raffles(0);
      assert(currentRaffle.feeTokenAddress == erc20WETHMock.address);
    });
    it("enter raffle that requires a fee token", async () => {
      await erc20WETHMock.approve(raffle.address, ethers.utils.parseEther("1"));
      await raffle.enterRaffle(0, 1);
    });
    it("should fail if not approved", async () => {
      await erc20WETHMock.approve(raffle.address, ethers.utils.parseEther("1"));
      await expect(raffle.enterRaffle(0, 2)).to.be.revertedWith(
        "ERC20: insufficient allowance"
      );
    });
    it("able to claim fee tokens after raffle is done", async () => {
      await erc20WETHMock.approve(raffle.address, ethers.utils.parseEther("1"));
      await raffle.enterRaffle(0, 1);
      await network.provider.send("evm_increaseTime", [100000000]);
      await network.provider.request({ method: "evm_mine", params: [] });
      let tx = await raffle.performUpkeep("0x");
      await tx.wait(1);
      tx = await vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address);
      await tx.wait(1);
      await expect(raffle.claimPrize(0)).to.emit(raffle, "RafflePrizeClaimed");
    });
    it("should fail to claim winnings after already claimed", async () => {
      await erc20WETHMock.approve(raffle.address, ethers.utils.parseEther("1"));
      await raffle.enterRaffle(0, 1);
      await network.provider.send("evm_increaseTime", [100000000]);
      await network.provider.request({ method: "evm_mine", params: [] });
      let tx = await raffle.performUpkeep("0x");
      await tx.wait(1);
      tx = await vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address);
      await tx.wait(1);
      await expect(raffle.claimPrize(0)).to.emit(raffle, "RafflePrizeClaimed");
      await expect(raffle.claimPrize(0)).to.be.revertedWith(
        "Prize has already been claimed"
      );
    });
  });
});
