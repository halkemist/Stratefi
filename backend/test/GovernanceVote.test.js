const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect, assert } = require("chai");
const hre = require("hardhat");

describe("StratefiGovernance Tests", function () {
    async function deployGovernanceFixture() {
        const [owner, addr1] = await hre.ethers.getSigners();
    
        const StrateFiToken = await hre.ethers.getContractFactory('StrateFiToken');
        const token = await StrateFiToken.deploy(owner.address);
        const StrateFiGovernance = await hre.ethers.getContractFactory('StrateFiGovernance');
        const governance = await StrateFiGovernance.deploy(token.target);
    
        return { token, governance, owner, addr1 };
    }

    describe("Should deploy the governance with the token", function() {
        it("Should token match between token and governance", async function() {
            const { token, governance } = await loadFixture(deployGovernanceFixture);
            const tokenAddress = await governance.token();
            expect(tokenAddress).to.be.equal(token.target);            
        })
    })

    describe("Governance Settings", function() {
        it("Voting Delay should be 0", async function() {
            const { governance } = await loadFixture(deployGovernanceFixture);
            const governanceVotingDelay = await governance.votingDelay();
            expect(governanceVotingDelay).to.be.equal(0);
        })
        it("Voting Period should be 2 weeks", async function() {
            const { governance } = await loadFixture(deployGovernanceFixture);
            const governanceVotingPeriod = await governance.votingPeriod();
            const averageBlockTimeInSeconds = 12;
            const secondsInTwoWeeks = 3600 * 336;
            const blocksInTwoWeeks = secondsInTwoWeeks / averageBlockTimeInSeconds;
            expect(governanceVotingPeriod).to.be.equal(blocksInTwoWeeks);
        })
        it("Quorum Percentage is 66", async function() {
            const { governance } = await loadFixture(deployGovernanceFixture);
            const governanceQuorum = await governance.quorumNumerator();
            expect(governanceQuorum).to.be.equal(66);
        })
        it("Proposal Threshold is 1", async function() {
            const { governance } = await loadFixture(deployGovernanceFixture);
            const governanceThreshold = await governance.proposalThreshold();
            expect(governanceThreshold).to.be.equal(1);
        })
    })
})