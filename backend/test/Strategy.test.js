const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const hre = require("hardhat");
const { AaveV3BaseSepolia } = require("@bgd-labs/aave-address-book");

const strategyType = "Supply WETH";

describe("Strategy Tests", function () {
  async function deployStrategyFixture() {
    const [owner, addr1] = await hre.ethers.getSigners();
    const StrategyFactory = await hre.ethers.getContractFactory("StrategyFactory");

    // Deploy strategy factory
    const factory = await StrategyFactory.deploy();
    await factory.createStrategy(strategyType, AaveV3BaseSepolia.POOL_ADDRESSES_PROVIDER);
    
    // Get strategy contract from address
    const strategyAddress = await factory.strategies(owner.address);
    const Strategy = await hre.ethers.getContractFactory("Strategy");
    const strategy = Strategy.attach(strategyAddress);

    // Get vault contract from strategy
    const vaultAddress = await strategy.vault();
    const Vault = await hre.ethers.getContractFactory("Vault");
    const vault = Vault.attach(vaultAddress);

    return { strategy, vault, owner, addr1 };
  }

  describe("Strategy constructor", function() {
    it("should revert if creator address is zero", async function() {
      const Strategy = await hre.ethers.getContractFactory("Strategy");
  
      // Tenter de déployer le contrat avec une adresse créateur zéro
      await expect(
        Strategy.deploy(hre.ethers.ZeroAddress, strategyType, AaveV3BaseSepolia.POOL_ADDRESSES_PROVIDER)
      ).to.be.revertedWith("Creator address cannot be zero");
    })
  })

  describe("Initialize Strategy", function() {
    it("Should have variables", async function() {
      const { strategy, vault, owner } = await loadFixture(deployStrategyFixture);

      // Check creator
      expect(await strategy.creator())
        .to.be.equal(owner.address);

      // Check strategyType
      expect(await strategy.strategyType())
        .to.be.equal(strategyType);

      // Check vault address
      expect(await strategy.vault())
        .to.be.equal(vault.target);
    })
  })

  describe("Strategy Execution", function() {
    it("Should owner deposit on the vault", async function() {
      const { strategy, vault, owner } = await loadFixture(deployStrategyFixture);
      await strategy.executeStrategy(owner.address, {value: hre.ethers.parseEther("1")});
      const ownerBalance = await vault.getBalance(owner.address);
      expect(hre.ethers.formatEther(ownerBalance))
        .to.be.equal("1.0");
    })
    it("Should other deposit on the vault", async function() {
      const { strategy, vault, addr1 } = await loadFixture(deployStrategyFixture);
      await strategy.executeStrategy(addr1.address, {value: hre.ethers.parseEther("1")});
      const addr1Balance = await vault.getBalance(addr1.address);
      expect(hre.ethers.formatEther(addr1Balance))
        .to.be.equal("1.0");
    })
  })
});