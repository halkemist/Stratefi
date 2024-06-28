const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StrateFiGovernance", (m) => {
    const stratefitoken = m.contractAt("StrateFiToken", "0x5FbDB2315678afecb367f032d93F642f64180aa3");

    console.log(stratefitoken.address)
    const stratefigovernance = m.contract("StrateFiGovernance", [stratefitoken.address]);
    return { stratefigovernance };
});