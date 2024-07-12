// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./Vault.sol";

/**
 * @title Strategy
 * @notice A contract that represent a strategy for managing assets in a vault
 */
contract Strategy {
    /// @notice Address of the strategy creator.
    address public immutable creator;

    /// @notice Type of the strategy.
    string public strategyType;

    /// @notice Address of the associated vault.
    address payable public immutable vault;

    event VaultCreated(address vaultAddress);

    /**
     * @notice Constructor to initialize the strategy contract
     * @param newCreator Address of the strategy creator
     * @param newStrategyType Type of the strategy.
     */
    constructor(address newCreator, string memory newStrategyType, address provider) {
        require(newCreator != address(0), "Creator address cannot be zero");

        // Assign values
        creator = newCreator;
        strategyType = newStrategyType;

        // Deploy Vault contract
        Vault newVault = new Vault(provider);
        vault = payable(address(newVault));
        emit VaultCreated(address(newVault));
    }

    function executeStrategy(address userAddress) payable external {
        Vault(vault).depositInVault{value: msg.value}(userAddress);
    }
}