// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Strategy {
    address public creator;
    address public protocol;
    string public strategyType;

    constructor(address _creator, address _protocol, string memory _strategyType) {
        creator = _creator;
        protocol = _protocol;
        strategyType = _strategyType;
    }
}