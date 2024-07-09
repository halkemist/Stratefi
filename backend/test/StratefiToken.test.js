const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const hre = require("hardhat");

describe("StratefiToken Tests", function () {
    async function deployTokenFixture() {
        const [owner, addr1] = await hre.ethers.getSigners();
    
        const StrateFiToken = await hre.ethers.getContractFactory('StrateFiToken');
        const token = await StrateFiToken.deploy(owner.address);
    
        return { token, owner, addr1 };
    }

    describe("Test Supply", function () {
        it("Should have a correct initial supply of 1000000000 tokens", async function() {
            const { token, owner } = await loadFixture(deployTokenFixture);
            const ownerBalance = await token.balanceOf(owner.address);
            expect(hre.ethers.formatEther(ownerBalance)).to.be.equal("1000000000.0");
        })
    })
})