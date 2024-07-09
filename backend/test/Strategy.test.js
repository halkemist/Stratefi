const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Strategy Tests", function () {
  async function deployStrategyFixture() {
    const [owner, addr1] = await ethers.getSigners();

    const strategyContract = await ethers.getContractFactory('Strategy');
    const strategy = await strategyContract.deploy();

    return { strategy, owner, addr1 };
  }
});