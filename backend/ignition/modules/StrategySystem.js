const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StrategyFactory", (m) => {
    const strategyFactory = m.contract("StrategyFactory");
    return { strategyFactory };
});
