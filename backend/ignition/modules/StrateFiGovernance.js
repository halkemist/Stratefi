const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StrateFiGovernance", (m) => {
    const stratefigovernance = m.contract("StrateFiGovernance", ["0xE08eB087BFe6Acb4f4e76c6A624b2e2e231514F4"]);
    return { stratefigovernance };
});