/* eslint-disable quotes */
/* eslint-disable quote-props */
exports.abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address",
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address",
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256",
      }
    ],
    "name": "Approval",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address",
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address",
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool",
      }
    ],
    "name": "ApprovalForAll",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address",
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "kittyId",
        "type": "uint256",
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "mumId",
        "type": "uint256",
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "dadId",
        "type": "uint256",
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "genes",
        "type": "uint256",
      }
    ],
    "name": "Birth",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "creator",
        "type": "address",
      }
    ],
    "name": "KittyCreatorAdded",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "creator",
        "type": "address",
      }
    ],
    "name": "KittyCreatorRemoved",
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address",
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address",
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256",
      }
    ],
    "name": "Transfer",
    "type": "event",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "CREATION_LIMIT_GEN0",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "DNA_LENGTH",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "NUM_CATTRIBUTES",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "RANDOM_DNA_THRESHOLD",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
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
        "name": "_address",
        "type": "address",
      }
    ],
    "name": "addKittyCreator",
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
        "name": "_approved",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      }
    ],
    "name": "approve",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address",
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256",
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      }
    ],
    "name": "cooldowns",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32",
      }
    ],
    "payable": false,
    "stateMutability": "view",
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
    "name": "getApproved",
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
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_kittyId",
        "type": "uint256",
      }
    ],
    "name": "getKitty",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "kittyId",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "genes",
        "type": "uint256",
      },
      {
        "internalType": "uint64",
        "name": "birthTime",
        "type": "uint64",
      },
      {
        "internalType": "uint64",
        "name": "cooldownEndTime",
        "type": "uint64",
      },
      {
        "internalType": "uint32",
        "name": "mumId",
        "type": "uint32",
      },
      {
        "internalType": "uint32",
        "name": "dadId",
        "type": "uint32",
      },
      {
        "internalType": "uint16",
        "name": "generation",
        "type": "uint16",
      },
      {
        "internalType": "uint16",
        "name": "cooldownIndex",
        "type": "uint16",
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address",
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getKittyCreators",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]",
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_kittyId",
        "type": "uint256",
      }
    ],
    "name": "isApproved",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "_operator",
        "type": "address",
      }
    ],
    "name": "isApprovedForAll",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_kittyId",
        "type": "uint256",
      }
    ],
    "name": "isApprovedOperatorOf",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address",
      }
    ],
    "name": "isKittyCreator",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_kittyId",
        "type": "uint256",
      }
    ],
    "name": "isKittyOwner",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      }
    ],
    "name": "kittyToApproved",
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
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "tokenName",
        "type": "string",
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
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address",
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
        "name": "_address",
        "type": "address",
      }
    ],
    "name": "removeKittyCreator",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
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
        "name": "_from",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      }
    ],
    "name": "safeTransferFrom",
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
        "name": "_from",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes",
      }
    ],
    "name": "safeTransferFrom",
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
        "name": "_operator",
        "type": "address",
      },
      {
        "internalType": "bool",
        "name": "_approved",
        "type": "bool",
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "_interfaceId",
        "type": "bytes4",
      }
    ],
    "name": "supportsInterface",
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
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "tokenSymbol",
        "type": "string",
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "total",
        "type": "uint256",
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
        "name": "_to",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      }
    ],
    "name": "transfer",
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
        "name": "_from",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      }
    ],
    "name": "transferFrom",
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
        "internalType": "address",
        "name": "_owner",
        "type": "address",
      }
    ],
    "name": "kittiesOf",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
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
    "name": "getGen0Count",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
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
        "name": "_genes",
        "type": "uint256",
      }
    ],
    "name": "createKittyGen0",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_dadId",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "_mumId",
        "type": "uint256",
      }
    ],
    "name": "breed",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_kittyId",
        "type": "uint256",
      }
    ],
    "name": "readyToBreed",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_dadId",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "_mumId",
        "type": "uint256",
      }
    ],
    "name": "isApprovedForSiring",
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
        "internalType": "uint256",
        "name": "_dadId",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "_mumId",
        "type": "uint256",
      },
      {
        "internalType": "bool",
        "name": "_isApproved",
        "type": "bool",
      }
    ],
    "name": "sireApprove",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  }
];
