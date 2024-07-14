const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StrateFiToken", (m) => {
    const stratefitoken = m.contract("Strategy", ["0xd449FeD49d9C443688d6816fE6872F21402e41de", "salut", "0xd449FeD49d9C443688d6816fE6872F21402e41de"]);
    return { stratefitoken };
});
