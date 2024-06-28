const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StrateFiToken", (m) => {
    const stratefitoken = m.contract("StrateFiToken", ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]);
    return { stratefitoken };
});
