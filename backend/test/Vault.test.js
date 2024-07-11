const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const hre = require("hardhat");

const protocolAddress = "0x07eA79F68B2B3df564D0A34F8e19D9B1e339814b";
const strategyType = "Supply WETH";

describe("Vault Tests", function () {
    async function deployVaultFixture() {
      const [owner, addr1] = await hre.ethers.getSigners();
      const StrategyFactory = await hre.ethers.getContractFactory("StrategyFactory");
  
      // Deploy strategy factory
      const factory = await StrategyFactory.deploy();
      await factory.createStrategy(protocolAddress, strategyType);
      
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

    describe("Initialize Vault", function() {
        it("Should have correct default values", async function() {
            const { vault } = await loadFixture(deployVaultFixture);
            
            // Check protocol address
            expect(await vault.protocol()).to.be.equal(protocolAddress);
        })
    })

    describe("Deposit and withdraw", function() {
        it("Should deposit", async function() {
            const { strategy, vault, addr1 } = await loadFixture(deployVaultFixture);

            // Deposit in vault from strategy
            await strategy.executeStrategy(addr1.address, {value: hre.ethers.parseEther("1")});
            const userVaultBalance = await vault.getBalance(addr1.address);
            expect(hre.ethers.formatEther(userVaultBalance))
                .to.be.equal("1.0");
        })
        it("Should withdraw", async function() {
            const { strategy, vault, addr1 } = await loadFixture(deployVaultFixture);

            // Deposit in vault from strategy
            await strategy.executeStrategy(addr1.address, {value: hre.ethers.parseEther("1")});
            const userVaultBalance = await vault.getBalance(addr1.address);
            expect(hre.ethers.formatEther(userVaultBalance))
                .to.be.equal("1.0");

            // Withdraw from vault
            let vaultUserBalance = await vault.getBalance(addr1.address);
            await vault.connect(addr1).withdrawFromVault(vaultUserBalance);

            // Check contract amount after withdraw
            let contractVaultBalance = await hre.ethers.provider.getBalance(vault.target);
            expect(contractVaultBalance).to.be.equal(hre.ethers.parseEther("0"));

            // Check user amount after withdraw
            vaultUserBalance = await vault.getBalance(addr1.address);
            expect(vaultUserBalance).to.be.equal(hre.ethers.parseEther("0"));
        })
        it("Should'nt withdraw if you don't have deposited funds", async function() {
            const { vault, addr1 } = await loadFixture(deployVaultFixture);

            // Try to withdraw
            await expect(
                vault.connect(addr1).withdrawFromVault(hre.ethers.parseEther("1"))
            ).to.be.revertedWith("Need more funds to withdraw");
        })
        it("Shouldn't withdraw more funds than your deposit amount", async function() {
            const { strategy, vault, addr1 } = await loadFixture(deployVaultFixture);

            // Deposit in vault from strategy
            await strategy.executeStrategy(addr1.address, {value: hre.ethers.parseEther("1")});

            // Try to withdraw more funds
            await expect(
                vault.connect(addr1).withdrawFromVault(hre.ethers.parseEther("2"))
            ).to.be.revertedWith("Need more funds to withdraw");
        })
    })

    describe("ETH/WETH Conversion", function() {
        it("Should convert ETH to WETH", async function() {
            const { strategy, vault, addr1 } = await loadFixture(deployVaultFixture);

            // Deposit ETH into the vault
            await strategy.executeStrategy(addr1.address, {value: hre.ethers.parseEther("2")});
            
            // Check balance before convert
            const wethBalanceBefore = await vault.getWETHBalance(addr1.address);

            const vaultEthBalance = await vault.getBalance(addr1.address);
            
            // Convert ETH to WETH
            await vault.connect(addr1).convertToWeth(vaultEthBalance);

            // Check balance after convert
            const wethBalanceAfter = await vault.getWETHBalance(addr1.address);

            expect(wethBalanceBefore).to.be.not.equal(wethBalanceAfter);
        })

        it("Shouldn't convert ETH to WETH if insufficient ETH balance", async function() {
            const { strategy, vault, addr1 } = await loadFixture(deployVaultFixture);

            // Deposit ETH into the vault
            await strategy.executeStrategy(addr1.address, {value: hre.ethers.parseEther("1")});
                        
            // Convert ETH to WETH
            await expect(
                vault.connect(addr1).convertToWeth(hre.ethers.parseEther("2"))
            ).to.be.revertedWith("Insufficient funds in the Vault");
        })

        it("Should convert WETH to ETH", async function() {
            const { strategy, vault, addr1 } = await loadFixture(deployVaultFixture);

            // Deposit ETH into the vault
            await strategy.executeStrategy(addr1.address, {value: hre.ethers.parseEther("2")});
            
            // Check balance before convert
            const wethBalanceBefore = await vault.getWETHBalance(addr1.address);

            const vaultEthBalance = await vault.getBalance(addr1.address);
            
            // Convert ETH to WETH
            await vault.connect(addr1).convertToWeth(vaultEthBalance);

            // Check balance after convert
            const wethBalanceAfter = await vault.getWETHBalance(addr1.address);

            expect(wethBalanceBefore).to.be.not.equal(wethBalanceAfter);

            // Convert WETH to ETH
            await vault.connect(addr1).convertToEth(wethBalanceAfter);

            // Check weth balance after convert
            const wethBalanceAfterSecond = await vault.getWETHBalance(addr1.address);

            expect(wethBalanceAfterSecond).to.be.equal(hre.ethers.parseEther("0"));
        })

        it("Shouldn't convert WETH to ETH is insufficient WETH balance", async function() {
            const { strategy, vault, addr1 } = await loadFixture(deployVaultFixture);

            // Deposit ETH into the vault
            await strategy.executeStrategy(addr1.address, {value: hre.ethers.parseEther("2")});
            
            // Check balance before convert
            const wethBalanceBefore = await vault.getWETHBalance(addr1.address);

            const vaultEthBalance = await vault.getBalance(addr1.address);
            
            // Convert ETH to WETH
            await vault.connect(addr1).convertToWeth(vaultEthBalance);

            // Check balance after convert
            const wethBalanceAfter = await vault.getWETHBalance(addr1.address);

            expect(wethBalanceBefore).to.be.not.equal(wethBalanceAfter);

            // Convert WETH to ETH
            await expect(
                vault.connect(addr1).convertToEth(hre.ethers.parseEther("3"))
            ).to.be.revertedWith("Insufficient WETH balance");
        })
    })

    describe("Deposit/Withdraw from protocol", function() {
        it("Should deposit WETH to protocol supply pool", async function() {
            const { strategy, vault, addr1 } = await loadFixture(deployVaultFixture);

            // Deposit ETH into the vault
            await strategy.executeStrategy(addr1.address, {value: hre.ethers.parseEther("2")});
            
            // Check balance before convert
            const vaultEthUserBalance = await vault.getBalance(addr1.address);
            
            // Convert ETH to WETH
            await vault.connect(addr1).convertToWeth(vaultEthUserBalance);

            const vaultWethUserBalance = await vault.getWETHBalance(addr1.address);

            // Approve protocol
            await vault.connect(addr1).approveProtocol(vaultWethUserBalance);

            // Deposit in protocol
            await vault.connect(addr1).depositInProtocol(vaultWethUserBalance);

            // Get protocol aTOKEN balance
            const aTOKENBalance = await vault.getProtocolBalance(addr1.address);
            console.log(aTOKENBalance);
        })
        it("Shouldn't deposit WETH without funds", async function() {

        })
    })
  
/*     describe("Initialize Strategy", function() {
      it("Should have variables", async function() {
        const { strategy, vault, owner } = await loadFixture(deployStrategyFixture);
  
        // Check creator
        expect(await strategy.creator())
          .to.be.equal(owner.address);
  
        // Check protocol
        expect(await strategy.protocol())
          .to.be.equal(protocolAddress);
  
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
    }) */
  });