export const contractAbi = [
    {
        "inputs": [
          {
            "internalType": "address",
            "name": "newCreator",
            "type": "address"
          },
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
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "vaultAddress",
            "type": "address"
          }
        ],
        "name": "VaultCreated",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "creator",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "userAddress",
            "type": "address"
          }
        ],
        "name": "executeStrategy",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "strategyType",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "uses",
        "outputs": [
          {
            "internalType": "uint16",
            "name": "",
            "type": "uint16"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "vault",
        "outputs": [
          {
            "internalType": "address payable",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
];