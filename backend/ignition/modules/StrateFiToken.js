const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StrateFiToken", (m) => {
    const stratefitoken = m.contract("StrateFiToken", ["0xE5a57698e67aFAE1f59912Ee09BFD3be090eb102"]);
    return { stratefitoken };
});
