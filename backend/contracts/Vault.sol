// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IWETH {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
}

contract Vault is ReentrancyGuard {

    address public immutable protocol;
    address public constant WETH_ADDRESS_BASE_SEPOLIA = 0x4200000000000000000000000000000000000006;
    IWETH public weth;

    struct Account {
        uint256 balance;
        uint256 wethBalance; // WETH balance in protocol
        uint256 lastAction;
    }

    mapping(address => Account) balances;

    event VaultDeposited(address indexed account, uint256 amount, address protocol);
    event VaultWithdrawed(address indexed account, uint256 amount, address protocol);
    event ProtocolDeposited(address indexed account, uint256 amount, address protocol);
    event ProtocolWithdrawed(address indexed account, uint256 amount, address protocol);

    constructor(address newProtocol) {
        require(newProtocol != address(0), "Protocol address cannot be zero");
        weth = IWETH(WETH_ADDRESS_BASE_SEPOLIA);
        protocol = newProtocol;
    }
    
    function deposit(address userAddress) external payable {
        require(msg.value > 0, "Need more funds to deposit");
        balances[userAddress].balance += msg.value;
        balances[userAddress].lastAction = block.timestamp;
        emit VaultDeposited(userAddress, msg.value, protocol);
    }

    function withDraw(uint256 amount) external nonReentrant {
        // Check: Check the funds
        require(balances[msg.sender].balance >= amount, "Need more funds to withdraw");

        // Effect: Update the balance before sending
        balances[msg.sender].balance -= amount;

        emit VaultWithdrawed(msg.sender, amount, protocol);

        // Interaction: Send the amount to the caller
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdraw error");
    }

    function depositInProtocol(uint256 amount) external {
        require(balances[msg.sender].balance >= amount, "Insufficient funds in the Vault");
        
        // Update the balance
        balances[msg.sender].balance -= amount;
        balances[msg.sender].wethBalance += amount;

        // Convert ETH to WETH
        weth.deposit{value: amount}();
        
        // Emit an event
        emit ProtocolDeposited(msg.sender, amount, protocol);
    }

    function withwrawFromProtocol(uint256 amount) payable external nonReentrant {
        require(balances[msg.sender].wethBalance >= amount, "Insufficient WETH balance");
        balances[msg.sender].wethBalance -= amount;

        // Convert WETH to ETH
        weth.withdraw(amount);

        // Update the balance
        balances[msg.sender].balance += amount;

        // Emit an event
        emit ProtocolWithdrawed(msg.sender, amount, protocol);
    }

    function getBalance(address userAddress) external view returns(uint256) {
        return balances[userAddress].balance;
    }

    function getWETHBalance(address userAddress) external view returns (uint256) {
        return balances[userAddress].wethBalance;
    }
}