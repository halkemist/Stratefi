// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./Vault.sol";

contract Strategy {
    address public immutable creator;
    address public immutable protocol;
    string public strategyType;
    address payable public immutable vault;

    event VaultCreated(address vaultAddress);

    constructor(address newCreator, address newProtocol, string memory newStrategyType) {
        require(newCreator != address(0), "Creator address cannot be zero");
        require(newProtocol != address(0), "Protocol address cannot be zero");

        // Assign values
        creator = newCreator;
        protocol = newProtocol;
        strategyType = newStrategyType;

        // Deploy Vault contract
        Vault newVault = new Vault(newProtocol);
        vault = payable(address(newVault));
        emit VaultCreated(address(newVault));
    }

    function executeStrategy(address userAddress) payable external {
        Vault(vault).depositInVault{value: msg.value}(userAddress);
    }
}