// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IWETH {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
    function approve(address guy, uint wad) external returns (bool);
}

interface IATOKEN {
    function scaledBalanceOf(address user) external view returns (uint256);
}

contract Vault is ReentrancyGuard {

    address public constant WETH_ADDRESS_BASE_SEPOLIA = 0x4200000000000000000000000000000000000006;
    address public constant A_TOKEN_WETH_BASE_SEPOLIA = 0x96e32dE4B1d1617B8c2AE13a88B9cC287239b13f;
    IWETH public immutable weth;
    IATOKEN public immutable atoken;
    address public immutable protocol;

    struct Account {
        uint256 balance;
        uint256 wethBalance;
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
        atoken = IATOKEN(A_TOKEN_WETH_BASE_SEPOLIA);
        protocol = newProtocol;
    }

    receive() external payable {}
    
    function depositInVault(address userAddress) external payable {
        require(msg.value > 0, "Need more funds to deposit");
        balances[userAddress].balance += msg.value;
        balances[userAddress].lastAction = block.timestamp;
        emit VaultDeposited(userAddress, msg.value, protocol);
    }

    function withdrawFromVault(uint256 amount) external nonReentrant {
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

        weth.withdraw(amount);

        // Convert WETH to ETH
        //(bool success, bytes memory data) = WETH_ADDRESS_BASE_SEPOLIA.call(
        //    abi.encodeWithSignature("withdraw(uint256)", amount)
        //);

        //require(success, "WETH to ETH conversion failed");
        balances[msg.sender].balance += amount;
    }

    function approveProtocol(uint256 amount) external {
        // Approve WETH to interact with AAVE
        (bool success, ) = WETH_ADDRESS_BASE_SEPOLIA.call(
            abi.encodeWithSignature("approve(address, uint256)", protocol, amount)
        );

        require(success, "WETH approval for AAVE failed");
    }

    function depositInProtocol(uint256 amount) external {
        require(balances[msg.sender].wethBalance >= amount, "Insufficient WETH balance");

        // Update balance
        balances[msg.sender].wethBalance -= amount;

        // Emit an event
        emit ProtocolDeposited(msg.sender, amount, protocol);

        // Deposit in AAVE
        (bool success, ) = protocol.call(
            abi.encodeWithSignature("supply(address, address, address, uint256, uint16)", address(weth), msg.sender, address(0), amount, 0)
        );

        require(success, "AAVE deposit failed");
    }

    function withwrawFromProtocol(uint256 amount) payable external {
        // Update balance
        balances[msg.sender].wethBalance += amount;

        // Emit an event
        emit ProtocolWithdrawed(msg.sender, amount, protocol);

        // Withdraw from AAVE
        (bool success, ) = protocol.call(
            abi.encodeWithSignature("withdraw(address, address, address, uint256)", address(weth), address(this), msg.sender, amount)
        );

        require(success, "AAVE withdrawal failed");
    }

    function getProtocolBalance(address userAddress) external view returns(uint256) {
        return atoken.scaledBalanceOf(userAddress);
    }

    function getBalance(address userAddress) external view returns(uint256) {
        return balances[userAddress].balance;
    }

    function getWETHBalance(address userAddress) external view returns(uint256) {
        return balances[userAddress].wethBalance;
    }
}