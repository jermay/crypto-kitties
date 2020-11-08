/* eslint-disable quotes */
/* eslint-disable quote-props */
exports.abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_kittyContractAddress",
        "type": "address",
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "TxType",
        "type": "string",
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address",
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256",
      }
    ],
    "name": "MarketTransaction",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address",
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address",
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "isOwner",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool",
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address",
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      }
    ],
    "name": "hasActiveOffer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool",
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "_kittyContractAddress",
        "type": "address",
      }
    ],
    "name": "setKittyContract",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      }
    ],
    "name": "getOffer",
    "outputs": [
      {
        "internalType": "address",
        "name": "seller",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256",
      },
      {
        "internalType": "bool",
        "name": "isSireOffer",
        "type": "bool",
      },
      {
        "internalType": "bool",
        "name": "active",
        "type": "bool",
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getAllTokenOnSale",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "listOfOffers",
        "type": "uint256[]",
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getAllSireOffers",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "listOfOffers",
        "type": "uint256[]",
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      }
    ],
    "name": "setOffer",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      }
    ],
    "name": "setSireOffer",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      }
    ],
    "name": "removeOffer",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      }
    ],
    "name": "buyKitty",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_sireTokenId",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "_matronTokenId",
        "type": "uint256",
      }
    ],
    "name": "buySireRites",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function",
  }
];
