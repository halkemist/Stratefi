const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StrategyFactory", (m) => {
    // Deploy factory
    const strategyFactory = m.contract("StrategyFactory");

    // Strategy
    //const strategyAddress = m.readEventArgument(deployedFactory, "StrategyCreated", "strategyAddress");
    //const strategy = m.contractAt("Strategy", strategyAddress);

    // Vault
    //const vaultAddress = m.readEventArgument(strategy, "VaultCreated", "vaultAddress");
    //const vault = m.contractAt("Vault", vaultAddress);
    
    return { strategyFactory };
});
