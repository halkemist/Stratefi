// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./Vault.sol";

contract Strategy {
    address public immutable creator;
    address public immutable protocolPoolAddress;
    string public strategyType;
    address public immutable vault;

    event VaultCreated(address vaultAddress, address protocolPoolAddress, string strategyType);
    event StrategyExecuted(address userAddress, address vaultAddress, address protocolPoolAddress, string strategyType, uint256 amount);
    event ApprovalUpdated(address userAddress, address vaultAddress, uint256 amount);

    constructor(address newCreator, address newProtocol, string memory newStrategyType) {
        require(newCreator != address(0), "Creator address cannot be zero");
        require(newProtocol != address(0), "Protocol address cannot be zero");

        creator = newCreator;
        protocolPoolAddress = newProtocol;
        strategyType = newStrategyType;
        Vault newVault = new Vault(protocolPoolAddress);
        vault = address(newVault); 
        emit VaultCreated(address(newVault), protocolPoolAddress, strategyType);
    }

    function executeStrategy() payable external {
        // Deposit tokens into Vault
        Vault(vault).deposit{value: msg.value}();

        // Emit event
        emit StrategyExecuted(msg.sender, vault, protocolPoolAddress, strategyType, msg.value);
    }
}