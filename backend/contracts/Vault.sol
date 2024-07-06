// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract Vault {

    address public immutable protocol;
    address public immutable asset;

    struct Account {
        uint256 balance;
        uint256 lastAction;
    }

    mapping(address => Account) balances;

    event VaultDeposited(address indexed account, uint256 amount, address protocol, address asset);
    event VaultWithdrawed(address indexed account, uint256 amount, address protocol, address asset);

    constructor(address newProtocol, address newAsset) {
        require(newProtocol != address(0), "Protocol address cannot be zero");
        require(newAsset != address(0), "Asset address cannot be zero");

        protocol = newProtocol;
        asset = newAsset;
    }
    
    function deposit(address userAddress) external payable {
        require(msg.value > 0, "Need more funds to deposit");
        balances[userAddress].balance += msg.value;
        balances[userAddress].lastAction = block.timestamp;
        emit VaultDeposited(userAddress, msg.value, protocol, asset);
    }

    function withDraw(uint256 amount) external {
        // Check: Check the funds
        require(balances[msg.sender].balance >= amount, "Need more funds to withdraw");

        // Effect: Update the balance before sending
        balances[msg.sender].balance -= amount;

        emit VaultWithdrawed(msg.sender, amount, protocol, asset);

        // Interaction: Send the amount to the caller
        (bool received, ) = msg.sender.call{value: amount}("");
        require(received, "Error");
    }

    function getBalance(address userAddress) external view returns(uint256) {
        return balances[userAddress].balance;
    }
}