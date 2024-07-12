// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { IPool } from "@aave/core-v3/contracts/interfaces/IPool.sol";
import { IPoolAddressesProvider } from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";

interface IWETH {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
    function approve(address guy, uint wad) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Vault is ReentrancyGuard {
    // Constants
    address public constant WETH_ADDRESS_BASE_SEPOLIA = 0x4200000000000000000000000000000000000006;
    address public constant A_TOKEN_WETH_BASE_SEPOLIA = 0x96e32dE4B1d1617B8c2AE13a88B9cC287239b13f;

    // Token and pool and provider
    IWETH public immutable weth;
    IPool internal lendingPool;
    IPoolAddressesProvider public providerFull;

    // Pool address
    address public poolAddress;

    struct Account {
        uint256 balance;
        uint256 wethBalance;
        uint256 lastAction;
    }

    mapping(address => Account) balances;

    event VaultDeposited(address indexed account, uint256 amount);
    event VaultWithdrawed(address indexed account, uint256 amount);
    event ProtocolDeposited(address indexed account, uint256 amount);
    event ProtocolWithdrawed(address indexed account, uint256 amount);

    constructor(address provider) {
        weth = IWETH(WETH_ADDRESS_BASE_SEPOLIA);
        providerFull = IPoolAddressesProvider(provider);
        lendingPool = IPool(providerFull.getPool());
        poolAddress = providerFull.getPool();
    }

    receive() external payable {}
    
    function depositInVault(address userAddress) external payable {
        require(msg.value > 0, "Need more funds to deposit");
        balances[userAddress].balance += msg.value;
        balances[userAddress].lastAction = block.timestamp;
        emit VaultDeposited(userAddress, msg.value);
    }

    function withdrawFromVault(uint256 amount) external nonReentrant {
        // Check the funds
        require(balances[msg.sender].balance >= amount, "Need more funds to withdraw");

        // Update the balance
        balances[msg.sender].balance -= amount;

        // Send the amount to the caller
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdraw failed");

        emit VaultWithdrawed(msg.sender, amount);
    }

    function convertToWeth(uint256 amount) external {
        require(balances[msg.sender].balance >= amount, "Insufficient funds in the Vault");
        
        // Update the balance
        balances[msg.sender].balance -= amount;
        balances[msg.sender].wethBalance += amount;

        // Convert ETH to WETH
        weth.deposit{value: amount}();
    }

    function convertToEth(uint256 amount) external {
        require(balances[msg.sender].wethBalance >= amount, "Insufficient WETH balance");

        // Update balance
        balances[msg.sender].wethBalance -= amount;

        // Convert WETH to ETH
        weth.withdraw(amount);

        // update balance
        balances[msg.sender].balance += amount;
    }

    function approveProtocol(uint256 amount) external {
        // Approve WETH to interact with AAVE
        weth.approve(poolAddress, amount);
    }

    function depositInProtocol(uint256 amount) external {
        require(balances[msg.sender].wethBalance >= amount, "Insufficient WETH balance");

        // Update balance
        balances[msg.sender].wethBalance -= amount;

        // Deposit in POOL.
        lendingPool.supply(address(weth), amount, msg.sender, 0);

        // Emit an event
        emit ProtocolDeposited(msg.sender, amount);
    }

    function withdrawFromProtocol(uint256 amount) payable external {
        // Update balance
        balances[msg.sender].wethBalance += amount;

        //lendingPool.withdraw();

        // Emit an event
        emit ProtocolWithdrawed(msg.sender, amount);
    }

    function getContractBalance() external view returns(uint256) {
        return weth.balanceOf(address(this));
    }

    function getBalance(address userAddress) external view returns(uint256) {
        return balances[userAddress].balance;
    }

    function getWETHBalance(address userAddress) external view returns(uint256) {
        return balances[userAddress].wethBalance;
    }
}