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

    struct Account {
        uint256 balance;
        uint256 lastAction;
    }

    mapping(address => Account) public balances;

    event VaultDeposited(address indexed account, uint256 amount);
    event VaultWithdrawed(address indexed account, uint256 amount);
    event ProtocolDeposited(address indexed account, uint256 amount);
    event ProtocolWithdrawed(address indexed account, uint256 amount);

    constructor(address protocolPoolAddress) {
        lendingPool = IPool(protocolPoolAddress);
    }
    
    function deposit() external payable nonReentrant {
        require(msg.value > 0, "Not enough funds deposited");
        balances[msg.sender].balance += msg.value;
        balances[msg.sender].lastAction = block.timestamp;
        emit VaultDeposited(msg.sender, msg.value);
    }

    function withDraw(uint256 amount) external nonReentrant {
        require(balances[msg.sender].balance >= amount, "Need more funds");
        balances[msg.sender].balance -= amount;
        (bool received, ) = msg.sender.call{value: amount}("");
        require(received, "An error occured");
        emit VaultWithdrawed(msg.sender, amount);
    }

    function getBalance(address userAddress) external view returns(uint256) {
        return balances[userAddress].balance;
    }
}