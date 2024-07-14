export const contractAddress = "0x143FA7475B2Fe1AA402B24377d91aecd5C776c27";
export const contractAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "strategyAddress",
        "type": "address"
      }
    ],
    "name": "StrategyCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "newStrategyType",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "provider",
        "type": "address"
      }
    ],
    "name": "createStrategy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "strategies",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];