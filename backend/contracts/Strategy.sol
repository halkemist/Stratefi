// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./Vault.sol";

contract Strategy {
    address public immutable creator;
    address public immutable protocol;
    string public strategyType;
    address public immutable vault;
    address public immutable asset;

    event VaultCreated(address vaultAddress);

    constructor(address newCreator, address newProtocol, string memory newStrategyType, address newAsset) {
        require(newCreator != address(0), "Creator address cannot be zero");
        require(newProtocol != address(0), "Protocol address cannot be zero");
        require(newAsset != address(0), "Asset address cannot be zero");

        creator = newCreator;
        protocol = newProtocol;
        strategyType = newStrategyType;
        asset = newAsset;
        Vault newVault = new Vault(newProtocol, newAsset);
        vault = address(newVault);
        emit VaultCreated(address(newVault));
    }

    function executeStrategy(address userAddress) payable external {
        Vault(vault).deposit{value: msg.value}(userAddress);
    }
}