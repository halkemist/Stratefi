// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract Vault {

    address public protocol;
    address public asset;

    struct Account {
        uint256 balance;
        uint256 lastAction;
    }

    mapping(address => Account) balances;

    event VaultDeposited(address indexed account, uint256 amount, address protocol, address asset);
    event VaultWithdrawed(address indexed account, uint256 amount, address protocol, address asset);

    constructor(address _protocol, address _asset) {
        protocol = _protocol;
        asset = _asset;
    }
    
    function deposit(address _address) external payable {
        require(msg.value > 0, "Need more funds to deposit");
        balances[_address].balance += msg.value;
        balances[_address].lastAction = block.timestamp;
        emit VaultDeposited(_address, msg.value, protocol, asset);
    }

    function withDraw(uint256 _amount) external {
        // Check: Check the funds
        require(balances[msg.sender].balance >= _amount, "Need more funds to withdraw");

        // Effect: Update the balance before sending
        balances[msg.sender].balance -= _amount;

        emit VaultWithdrawed(msg.sender, _amount, protocol, asset);

        // Interaction: Send the amount to the caller
        (bool received, ) = msg.sender.call{value: _amount}("");
        require(received, "Error");
    }

    function getBalance(address _address) external view returns(uint256) {
        return balances[_address].balance;
    }
}