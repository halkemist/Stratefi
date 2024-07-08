const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StrategySystem", (m) => {
    const strategysystem = m.contract("StrategyFactory");
    return { strategysystem };
});