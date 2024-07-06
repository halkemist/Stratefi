// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IPool {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint256 amount, address to) external returns (uint256);
}

contract Vault is ReentrancyGuard {

    IPool public lendingPool;
    IERC20 public asset;

    struct Account {
        uint256 balance;
        uint256 lastAction;
    }

    mapping(address => Account) public balances;

    event VaultDeposited(address indexed account, uint256 amount, address asset);
    event VaultWithdrawed(address indexed account, uint256 amount, address asset);
    event ProtocolDeposited(address indexed account, uint256 amount);
    event ProtocolWithdrawed(address indexed account, uint256 amount);

    constructor(address newAsset, address protocolPoolAddress) {
        lendingPool = IPool(protocolPoolAddress);
        asset = IERC20(newAsset);
    }
    
    function deposit(uint256 amount) external payable nonReentrant {
        require(amount > 0, "Need more funds to deposit");
        require(asset.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        balances[msg.sender].balance += amount;
        balances[msg.sender].lastAction = block.timestamp;

        emit VaultDeposited(msg.sender, amount, address(asset));
    }

    function withDraw(uint256 amount) external nonReentrant {
        // Check: Check the funds
        require(amount > 0, "Withdrawal amount must be greater than zero");
        require(balances[msg.sender].balance >= amount, "Need more funds to withdraw");

        // Effect: Update the balance before sending
        balances[msg.sender].balance -= amount;

        emit VaultWithdrawed(msg.sender, amount, address(asset));

        // Interaction: Send the amount to the caller
        require(asset.transfer(msg.sender, amount), "Withdraw failed");
    }

    function depositInProtocol(uint256 amount) external nonReentrant {
        require(amount > 0, "Deposit amount must be greater than zero");
        require(balances[msg.sender].balance >= amount, "Insufficient balance");

        balances[msg.sender].balance -= amount;

        // Approve pool to transfer amount from this contract
        IERC20(asset).approve(address(lendingPool), amount);

        lendingPool.supply(address(asset), amount, address(this), 0);

        emit ProtocolDeposited(msg.sender, amount);
    }

    function withdrawFromProtocol(uint256 amount) external nonReentrant {
        require(amount > 0, "Withdrawal amount must be greater than zero");

        uint256 withdrawnAmount = lendingPool.withdraw(address(asset), amount, address(this));
        balances[msg.sender].balance += withdrawnAmount;

        emit ProtocolWithdrawed(msg.sender, withdrawnAmount);
    }

    function getBalance(address userAddress) external view returns(uint256) {
        return balances[userAddress].balance;
    }
}