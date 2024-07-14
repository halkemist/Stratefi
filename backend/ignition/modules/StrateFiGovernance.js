const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StrateFiGovernance", (m) => {
    const stratefigovernance = m.contract("StrateFiGovernance", ["0x6329ba2C86c746792B9c3eBf874573d2C4A5b9D3"]);
    return { stratefigovernance };
});