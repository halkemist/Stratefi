const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Vault", (m) => {
    const vault = m.contract("Vault", ["0xd449FeD49d9C443688d6816fE6872F21402e41de"]);
    return { vault };
});
