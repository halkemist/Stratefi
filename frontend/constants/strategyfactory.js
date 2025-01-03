export const contractAddress = "0xa759c39d4b472D5ac690D5fF2aFFf4C945ce7C94";
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