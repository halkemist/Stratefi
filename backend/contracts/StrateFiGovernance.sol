// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";

/**
 * @title Governance contract for StrateFi DAO.
 * @dev Extends various OpenZeppelin governance modules.
 */
contract StrateFiGovernance is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction {
    /**
     * @dev Initialize the contract.
     * @param _token The address of the governance token used for voting.
     */
    constructor(IVotes _token)
        Governor("StrateFiGovernance")
        GovernorSettings(0 days, 2 weeks, 0)
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(66)
    {}

    // The following functions are overrides required by Solidity.

    /**
     * @notice Override function to custom the voting delay value.
     * @return The voting delay required for voting.
     */
    function votingDelay()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    /**
     * @notice Override function to custom the voting period value.
     * @return The voting period required for voting.
     */
    function votingPeriod()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    /**
     * @notice Override function to custom the quorum value (min voters to accept the proposal).
     * @return The quorum required for voting.
     */
    function quorum(uint256 blockNumber)
        public
        view
        override(Governor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    /**
     * @notice Override function to custom the proposal threshold value.
     * @return The min of votes required to create a proposal.
     */
    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    /**
     * @notice Override function to create a proposal with default parameters except for the description.
     * @param targets List of contract addresses.
     * @param values List of ETH values to send.
     * @param calldatas List of function to call.
     * @param description Description of the proposal.
     */
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    )
        public
        override(Governor)
        returns (uint256)
    {
        targets[0] = 0x0000000000000000000000000000000000000000;
        values[0] = 0;
        calldatas[0] = "";

        address proposer = _msgSender();

        // check description restriction
        if (!_isValidDescriptionForProposer(proposer, description)) {
            revert GovernorRestrictedProposer(proposer);
        }

        // check proposal threshold
        uint256 proposerVotes = getVotes(proposer, clock() - 1);
        uint256 votesThreshold = proposalThreshold();
        if (proposerVotes < votesThreshold) {
            revert GovernorInsufficientProposerVotes(proposer, proposerVotes, votesThreshold);
        }

        return _propose(targets, values, calldatas, description, proposer);
    }
}
