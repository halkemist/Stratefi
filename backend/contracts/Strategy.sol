// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./Vault.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Strategy {
    address public immutable creator;
    address public immutable protocolPoolAddress;
    string public strategyType;
    address public immutable vault;
    IERC20 public immutable asset;

    event VaultCreated(address vaultAddress, address asset, address protocolPoolAddress, string strategyType);
    event StrategyExecuted(address userAddress, address vaultAddress, address asset, address protocolPoolAddress, string strategyType, uint256 amount);
    event ApprovalUpdated(address userAddress, address vaultAddress, uint256 amount);

    constructor(address newCreator, address newProtocol, string memory newStrategyType, address newAsset) {
        require(newCreator != address(0), "Creator address cannot be zero");
        require(newProtocol != address(0), "Protocol address cannot be zero");
        require(newAsset != address(0), "Asset address cannot be zero");

        creator = newCreator;
        protocolPoolAddress = newProtocol;
        strategyType = newStrategyType;
        asset = IERC20(newAsset);
        Vault newVault = new Vault(newAsset, protocolPoolAddress);
        vault = address(newVault); 
        emit VaultCreated(address(newVault), address(asset), protocolPoolAddress, strategyType);
    }

    function approveStrategy(uint256 amount) external {
        require(asset.approve(vault, amount), "Contract approval failed");
        emit ApprovalUpdated(msg.sender, address(vault), amount);
    }

    function approveUser(uint256 amount) external {
        require(asset.approve(msg.sender, amount), "User approval failed");
        emit ApprovalUpdated(msg.sender, address(vault), amount);

    }

    function executeStrategy(uint256 amount) payable external {
        // Check user balance
        require(asset.balanceOf(msg.sender) >= amount, "Insufficient balance");

        // Check allowance
        uint256 allowance = asset.allowance(address(this), vault);
        if (allowance < amount) {
            require(asset.approve(vault, 0), "Approval reset failed");
            require(asset.approve(vault, amount), "Approval for Vault failed");
        }

        // Transfer tokens to this contract 
        require(asset.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // Deposit tokens into Vault
        Vault(vault).deposit(amount);

        // Emit event
        emit StrategyExecuted(msg.sender, vault, address(asset), protocolPoolAddress, strategyType, amount);
    }
}