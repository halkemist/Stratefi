// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IWETH {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
    function approve(address guy, uint wad) external returns (bool);
}

contract Vault is ReentrancyGuard {

    address public constant WETH_ADDRESS_BASE_SEPOLIA = 0x4200000000000000000000000000000000000006;
    IWETH public weth;
    address public protocol;

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

    function withdraw(uint256 amount) external nonReentrant {
        // Check the funds
        require(balances[msg.sender].balance >= amount, "Need more funds to withdraw");

        // Update the balance
        balances[msg.sender].balance -= amount;

        // Send the amount to the caller
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdraw failed");

        emit VaultWithdrawed(msg.sender, amount, protocol);
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
        WETH_ADDRESS_BASE_SEPOLIA.call(abi.encodeWithSignature("withdraw(uint256)", amount));

        // Update balance
        balances[msg.sender].balance += amount;
    }

    function approveProtocol(uint256 amount) external {
        // Approve WETH to interact with AAVE
        WETH_ADDRESS_BASE_SEPOLIA.call(abi.encodeWithSignature("approve(address, uint)", protocol, amount));
    }

    function depositInProtocol(uint256 amount) external {
        // Deposit in AAVE
        protocol.call(abi.encodeWithSignature("supply(address, address, address, uint256, uint16)", address(weth), msg.sender, address(0), amount, 0));
 
        // Update balance
        balances[msg.sender].wethBalance -= amount;
        
        // Emit an event
        emit ProtocolDeposited(msg.sender, amount, protocol);
    }

    function withwrawFromProtocol(uint256 amount) payable external {
        // Withdraw from AAVE
        protocol.call(abi.encodeWithSignature("withdraw(address, address, address, uint256)", address(weth), address(this), msg.sender, amount));

        // Update balance
        balances[msg.sender].wethBalance += amount;

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