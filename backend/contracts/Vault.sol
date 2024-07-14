// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import { IPool } from "@aave/core-v3/contracts/interfaces/IPool.sol";
import { IPoolAddressesProvider } from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";

interface IWETH {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
    function approve(address guy, uint wad) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address account, address to, uint amount) external returns(bool);
}

/**
 * @title Vault.
 * @notice A contract that allow users to deposit ETH, convert to WETH and interact with AAVE protocol.
 */
contract Vault is ReentrancyGuard {
    // Constants
    address public constant WETH_ADDRESS_BASE_SEPOLIA = 0x4200000000000000000000000000000000000006;
    address public constant A_TOKEN_WETH_BASE_SEPOLIA = 0x96e32dE4B1d1617B8c2AE13a88B9cC287239b13f;

    // Token and pool and provider
    IWETH public immutable weth;
    IPool internal lendingPool;
    IPoolAddressesProvider public providerFull;
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
    event LogError(string message);

    /**
     * @notice Sets the WETH address, provider and lending pool.
     * @param provider Address of the Aave PoolAddressesProvider.
     */
    constructor(address provider) {
        weth = IWETH(WETH_ADDRESS_BASE_SEPOLIA);
        providerFull = IPoolAddressesProvider(provider);
        lendingPool = IPool(providerFull.getPool());
        poolAddress = providerFull.getPool();
    }

    /**
     * @dev Function fallback allowing contract to receive ETH
     */
    receive() external payable {}
    
    /**
     * @notice Deposit ETH in the user vault balance.
     */
    function depositInVault(address userAddress) external payable nonReentrant {
        // Check the funds
        require(msg.value > 0, "Need more funds to deposit");

        // Update balance
        balances[userAddress].balance += msg.value;
        balances[userAddress].lastAction = block.timestamp;

        // Emit event
        emit VaultDeposited(userAddress, msg.value);
    }

    /**
     * @notice Withdraw ETH from user vault.
     * @param amount Amount of ETH to withdraw.
     */
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

    /**
     * @notice Convert user balance of ETH to WETH.
     * @param amount Amount to ETH to convert to WETH.
     */
    function convertToWeth(uint256 amount) external nonReentrant {
        // Check the funds
        require(balances[msg.sender].balance >= amount, "Insufficient funds in the Vault");
        
        // Update the balance
        balances[msg.sender].balance -= amount;
        balances[msg.sender].wethBalance += amount;

        // Convert ETH to WETH
        weth.deposit{value: amount}();
    }

    /**
     * @notice Convert user balance of WETH to ETH.
     * @param amount Amount of WETH to convert to ETH.
     */
    function convertToEth(uint256 amount) external nonReentrant {
        require(balances[msg.sender].wethBalance >= amount, "Insufficient WETH balance");

        // Update balance
        balances[msg.sender].wethBalance -= amount;
        balances[msg.sender].balance += amount;

        // Convert WETH to ETH
        weth.withdraw(amount);        
    }

    /**
     * @notice Approve the protocol to spend a specified amount of WETH.
     * @param amount Amount of WETH to approve.
     */
    function approveProtocol(uint256 amount) external {
        // Approve WETH to interact with AAVE
        require(weth.approve(poolAddress, amount), "Approval Failed");
    }

    /**
     * @notice Deposit WETH in Aave protocol.
     * @param amount Amount of WETH to deposit in the protocol.
     */
    function depositInProtocol(uint256 amount) external nonReentrant {
        require(balances[msg.sender].wethBalance >= amount, "Insufficient WETH balance");

        // Update balance
        balances[msg.sender].wethBalance -= amount;

        // Approve lending pool to spend WETH
        require(weth.approve(poolAddress, amount), "Approval failed");

        // Deposit in pool
        lendingPool.supply(address(weth), amount, msg.sender, 0);

        // Emit an event
        emit ProtocolDeposited(msg.sender, amount);
    }

    /**
     * @notice Withdraw WETH from AAVE protocol to user WETH balance.
     * @param amount Amount of WETH to withdraw.
     * @param aToken The address of the Aave aToken corresponding to WETH.
     */
    function withdrawFromProtocol(uint256 amount, address aToken) payable external nonReentrant {
        IWETH(aToken).transferFrom(msg.sender, address(this), amount);
        require(IWETH(aToken).approve(poolAddress, amount), "Approval Failed");

        // Withdraw from pool
        lendingPool.withdraw(address(weth), amount, address(this));

        // Update balance
        balances[msg.sender].wethBalance += amount;

        // Emit an event
        emit ProtocolWithdrawed(msg.sender, amount);
    }

    /**
     * @dev Return the WETH contract balance of the contract.
     * @return WETH Balance of the contract.
     */
    function getContractBalance() external view returns(uint256) {
        return weth.balanceOf(address(this));
    }

    /**
     * @notice Return the ETH vault balance of the user.
     * @param userAddress Address of the user.
     * @return ETH Balance of the user.
     */
    function getBalance(address userAddress) external view returns(uint256) {
        return balances[userAddress].balance;
    }

    /**
     * @notice Return the WETH vault balance of the user.
     * @param userAddress Address of the user.
     * @return WETH Balance of the user.
     */
    function getWETHBalance(address userAddress) external view returns(uint256) {
        return balances[userAddress].wethBalance;
    }
}