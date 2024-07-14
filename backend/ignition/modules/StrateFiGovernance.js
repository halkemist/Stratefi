const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StrateFiGovernance", (m) => {
    const stratefigovernance = m.contract("StrateFiGovernance", ["0x8f9374e559272F7f8CB9AA5E6E207de02eD8A03B"]);
    return { stratefigovernance };
});