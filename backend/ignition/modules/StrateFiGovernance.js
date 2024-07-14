const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StrateFiGovernance", (m) => {
    const stratefigovernance = m.contract("StrateFiGovernance", ["0x3646896622a41646b2810F8dfbd401Cff519aE35"]);
    return { stratefigovernance };
});