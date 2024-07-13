export const contractAddress = "0x8f9374e559272F7f8CB9AA5E6E207de02eD8A03B";
export const contractAbi = [    {
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
  }];