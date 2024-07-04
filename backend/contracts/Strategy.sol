// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./Vault.sol";

contract Strategy {
    address public creator;
    address public protocol;
    string public strategyType;
    address public vault;
    address public asset;

    event VaultCreated(address vaultAddress);

    constructor(address _creator, address _protocol, string memory _strategyType, address _asset) {
        creator = _creator;
        protocol = _protocol;
        strategyType = _strategyType;
        Vault newVault = new Vault(_protocol, _asset);
        emit VaultCreated(address(newVault));
    }

    function executeStrategy(address _address) external {
        Vault(vault).deposit(_address);
    }
}