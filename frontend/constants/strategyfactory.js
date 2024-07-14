export const contractAddress = "0x740418969eC7B1e89Ca05Cebc72b4C4391920f4a";
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