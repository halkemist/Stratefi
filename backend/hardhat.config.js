require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  //defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: process.env.BASE_SEPOLIA_URL_ALCHEMY,
      }
    },
    base_testnet: {
      url: process.env.BASE_SEPOLIA_URL_ALCHEMY,
      accounts: [`0x${process.env.PK}`],
      chainId: 84532
    }
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BASE_SEPOLIA_SCAN_API_KEY,
    }
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
