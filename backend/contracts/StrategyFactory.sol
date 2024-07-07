// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./Strategy.sol";

contract StrategyFactory {
    mapping (address => address) public strategies;

    event StrategyCreated(address strategyAddress);

    function createStrategy(address newProtocol, string memory newStrategyType) public {
        Strategy newStrategy = new Strategy(msg.sender, newProtocol, newStrategyType);
        strategies[msg.sender] = address(newStrategy);
        emit StrategyCreated(address(newStrategy));
    }
}