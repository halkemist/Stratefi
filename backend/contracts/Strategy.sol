// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./Vault.sol";

contract Strategy {
    address public immutable CREATOR;
    address public immutable PROTOCOL;
    string public strategyType;
    address public immutable VAULT;
    address public immutable ASSET;

    event VaultCreated(address vaultAddress);

    constructor(address newCreator, address newProtocol, string memory newStrategyType, address newAsset) {
        require(newCreator != address(0), "Creator address cannot be zero");
        require(newProtocol != address(0), "Protocol address cannot be zero");
        require(newAsset != address(0), "Asset address cannot be zero");

        CREATOR = newCreator;
        PROTOCOL = newProtocol;
        strategyType = newStrategyType;
        ASSET = newAsset;
        Vault newVault = new Vault(newProtocol, newAsset);
        VAULT = address(newVault);
        emit VaultCreated(address(newVault));
    }

    function executeStrategy(address userAddress) payable external {
        Vault(VAULT).deposit{value: msg.value}(userAddress);
    }
}