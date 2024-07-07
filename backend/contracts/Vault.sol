// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Vault is ReentrancyGuard {

    address public immutable protocol;

    struct Account {
        uint256 balance;
        uint256 lastAction;
    }

    mapping(address => Account) balances;

    event VaultDeposited(address indexed account, uint256 amount, address protocol);
    event VaultWithdrawed(address indexed account, uint256 amount, address protocol);

    constructor(address newProtocol) {
        require(newProtocol != address(0), "Protocol address cannot be zero");

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

    function getBalance(address userAddress) external view returns(uint256) {
        return balances[userAddress].balance;
    }
}