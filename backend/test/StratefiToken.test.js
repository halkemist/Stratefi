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

    describe("Mint Tokens", function () {
        it("Should owner mint tokens", async function() {
            const { token, owner, addr1 } = await loadFixture(deployTokenFixture);
            await token.connect(owner).mint(addr1.address, hre.ethers.parseEther("1000"));
            const addr1Balance = await token.balanceOf(addr1.address);
            expect(hre.ethers.formatEther(addr1Balance)).to.be.equal("1000.0");
        })
        it("Shouldn't mint tokens if we are not the owner", async function() {
            const { token, addr1 } = await loadFixture(deployTokenFixture);
            await expect(token.connect(addr1).mint(addr1.address, hre.ethers.parseEther("1500")))
                .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
                .withArgs(addr1);
        });
    })

    describe("Pause capability", function () {
        it("Should owner pause token", async function() {
            const { token, owner } = await loadFixture(deployTokenFixture);
            await token.connect(owner).pause();
            const pauseStatus = await token.paused();
            expect(pauseStatus).to.be.true;
        })
        it("Should owner unpause token", async function() {
            const { token, owner } = await loadFixture(deployTokenFixture);
            await token.connect(owner).pause();
            let pauseStatus = await token.paused();
            expect(pauseStatus).to.be.true;
            await token.connect(owner).unpause();
            pauseStatus = await token.paused();
            expect(pauseStatus).to.be.false
        })
    })

    describe("Nonces", function() {
        it("Should return the nonces of a user", async function() {
            const { token, owner } = await loadFixture(deployTokenFixture);
            const nonces = await token.connect(owner).nonces(owner.address);
            expect(Number(BigInt(nonces))).to.be.equal(0);
        })
    })
})