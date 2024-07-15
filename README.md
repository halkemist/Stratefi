### Stratefi is a dapp to make and follow DeFi strategies !

![Logo](https://github.com/Tony-S201/Stratefi/blob/main/frontend/public/assets/right-image.jpg?raw=true)

## Getting Started

Config files:
frontend/app/config.js
frontend/app/RainbowKitAndWagmiProvider.js
backend/hardhat.config.js

First, deploy the smart contracts (be careful you need to put the correct addresses in different ignition modules):
```bash
yarn hardhat ignition deploy ./ignition/modules StrateFiToken.js --network localhost
yarn hardhat ignition deploy ./ignition/modules StrateFiGovernance.js --network localhost
yarn hardhat ignition deploy ./ignition/modules StrategySystem.js --network localhost
```

And change contract addresses in frontend constants folder.

Then, run the development server:
```bash
yarn run dev
```

Note: Between two batch of contract deployment, please remove the ignition deployment folder.