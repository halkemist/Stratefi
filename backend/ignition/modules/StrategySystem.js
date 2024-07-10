const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StrategyFactory", (m) => {
    // Deploy factory
    const strategyFactory = m.contract("StrategyFactory");

    // Deploy strategy from factory
    const deployedFactory = m.call(strategyFactory, "createStrategy", ["0x07eA79F68B2B3df564D0A34F8e19D9B1e339814b", "Supply WETH"]);

    // Strategy
    const strategyAddress = m.readEventArgument(deployedFactory, "StrategyCreated", "strategyAddress");
    const strategy = m.contractAt("Strategy", strategyAddress);

    // Vault
    const vaultAddress = m.readEventArgument(strategy, "VaultCreated", "vaultAddress");
    const vault = m.contractAt("Vault", vaultAddress);
    
    return { strategyFactory, strategy, vault };
});
