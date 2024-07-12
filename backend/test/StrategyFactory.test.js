const { expect } = require("chai");
const hre = require("hardhat");
const { AaveV3BaseSepolia } = require("@bgd-labs/aave-address-book");

describe("StrategyFactory Test", function() {
    it("Should create a strategy", async function() {
        const [owner, addr1] = await ethers.getSigners();
        const StrategyFactory = await ethers.getContractFactory("StrategyFactory");
        const factory = await StrategyFactory.deploy();
        
        // Create strategy and check event
        expect(await factory.createStrategy("Staking WETH", AaveV3BaseSepolia.POOL_ADDRESSES_PROVIDER))
            .to.emit(factory, 'StrategyCreated');
        
        // Check strategy exist
        const strategyAddress = await factory.strategies(owner.address);
        expect(strategyAddress).to.not.equal(hre.ethers.ZeroAddress);
    });
});