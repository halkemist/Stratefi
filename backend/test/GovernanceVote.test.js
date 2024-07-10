const { loadFixture, mine } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const hre = require("hardhat");

describe("StratefiGovernance Tests", function () {
    async function deployGovernanceFixture() {
        const [owner, addr1, addr2] = await hre.ethers.getSigners();
    
        const StrateFiToken = await hre.ethers.getContractFactory('StrateFiToken');
        const token = await StrateFiToken.deploy(owner.address);
        const StrateFiGovernance = await hre.ethers.getContractFactory('StrateFiGovernance');
        const governance = await StrateFiGovernance.deploy(token.target);
    
        return { token, governance, owner, addr1, addr2 };
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
            // Get voting delay.
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
            // Get quorum value.
            const governanceQuorum = await governance.quorumNumerator();
            expect(governanceQuorum).to.be.equal(66);
        })
        it("Proposal Threshold is 1", async function() {
            const { governance } = await loadFixture(deployGovernanceFixture);
            // Get threshold value. 
            const governanceThreshold = await governance.proposalThreshold();
            expect(governanceThreshold).to.be.equal(1);
        })
    })

    describe("Proposal", function() {
        it("Should propose if user have at least the threshold", async function() {
            const { governance, token, owner, addr1 } = await loadFixture(deployGovernanceFixture);
            const proposalThreshold = await governance.proposalThreshold();

            // Mint enough tokens to propose to addr1
            await token.connect(owner).mint(addr1.address, proposalThreshold);
            await expect(governance.connect(addr1).propose(["0x0000000000000000000000000000000000000000"], [0], ["0x"], "Test Proposal"))
                .to.emit(governance, "ProposalCreated");
        })
        it("Should'nt propose if user doesnt have at least the threshold", async function() {
            const { governance, token, owner, addr1 } = await loadFixture(deployGovernanceFixture);
            
            // Mint tokens but not enough to propose to addr1
            await token.connect(owner).mint(addr1.address, 0);
            await expect(governance.connect(addr1).propose(["0x0000000000000000000000000000000000000000"], [0], ["0x"], "Test Proposal"))
                .to.be.revertedWithCustomError(governance, "GovernorInsufficientProposerVotes");
        })
    })

    describe("Voting", function() {
        it("Should allow users to vote on a proposal", async function() {
            const { governance, token, owner, addr1 } = await loadFixture(deployGovernanceFixture);

            // Create proposal.
            const proposal = await governance.connect(owner).propose(["0x0000000000000000000000000000000000000000"], [0], ["0x"], "Test Proposal");

            // Wait for event to get the proposal ID.
            const proposalReceipt = await proposal.wait();
            const proposalId = proposalReceipt.logs[0].args.proposalId;

            // Get proposal state.
            const stateBefore = await governance.state(proposalId);

            // Check that proposal not active.
            expect(Number(stateBefore)).to.be.equal(0);

            // Mint tokens for the voter
            await token.connect(owner).mint(addr1.address, 1000);
            const stateAfter = await governance.state(proposalId);

            // Check that proposal is active.
            expect(Number(stateAfter)).to.be.equal(1);

            // Try to vote
            await governance.connect(addr1).castVote(proposalId, 2);

            // Get the hasVoted status.
            const hasVoted = await governance.hasVoted(proposalId, addr1.address);
            expect(hasVoted).to.be.equal(true);
        })
    })

    describe("Quorum", function() {
        it("Should require quorum to pass proposal", async function() {
            const { governance, token, owner, addr1, addr2 } = await loadFixture(deployGovernanceFixture);

            // Initial distribution of tokens
            const totalSupply = await token.totalSupply();
            const decimals = await token.decimals();
            const amount = hre.ethers.parseUnits("400000000", decimals);

            // Transfer tokens to addr1 and addr2
            await token.connect(owner).transfer(addr1.address, amount); // 40% of the supply to addr1
            await token.connect(owner).transfer(addr2.address, amount); // 40% of the supply to addr2

            // Self delegate voters
            await token.connect(addr1).delegate(addr1.address);
            await token.connect(addr2).delegate(addr2.address);

            // Create proposal
            const proposal = await governance.connect(owner).propose(["0x0000000000000000000000000000000000000000"], [0], ["0x"], "Test Proposal");

            // Wait for event to get the proposal ID.
            const proposalReceipt = await proposal.wait();
            const proposalId = proposalReceipt.logs[0].args.proposalId;

            // Mine to next block
            await mine(1);

            // Vote
            await governance.connect(addr1).castVote(proposalId, 1);
            await governance.connect(addr2).castVote(proposalId, 1);

            // Advance blocks by 2 weeks (in seconds)
            await mine(100800);

            // Check proposal state, it should be Succeeded (state 4) if quorum is met
            let proposalState = await governance.state(proposalId);
            expect(Number(proposalState)).to.be.equal(4);
        })

        it("Should proposal be defeated if quorum is not enough", async function() {
            const { governance, token, owner, addr1, addr2 } = await loadFixture(deployGovernanceFixture);

            // Initial distribution of tokens
            const totalSupply = await token.totalSupply();
            const decimals = await token.decimals();
            const amount = hre.ethers.parseUnits("100000000", decimals);

            // Transfer tokens to addr1 and addr2
            await token.connect(owner).transfer(addr1.address, amount); // 10% of the supply to addr1
            await token.connect(owner).transfer(addr2.address, amount); // 10% of the supply to addr2

            // Self delegate voters
            await token.connect(addr1).delegate(addr1.address);
            await token.connect(addr2).delegate(addr2.address);

            // Create proposal
            const proposal = await governance.connect(owner).propose(["0x0000000000000000000000000000000000000000"], [0], ["0x"], "Test Proposal");

            // Wait for event to get the proposal ID.
            const proposalReceipt = await proposal.wait();
            const proposalId = proposalReceipt.logs[0].args.proposalId;

            // Mine to next block
            await mine(1);

            // Vote
            await governance.connect(addr1).castVote(proposalId, 1);
            await governance.connect(addr2).castVote(proposalId, 1);

            // Advance blocks by 2 weeks (in seconds)
            await mine(100800);

            // Check proposal state, it should be Succeeded (state 4) if quorum is met
            let proposalState = await governance.state(proposalId);
            expect(Number(proposalState)).to.be.equal(3);
        })
    })
})