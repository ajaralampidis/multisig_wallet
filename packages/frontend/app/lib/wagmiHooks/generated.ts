import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HELP
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const helpAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      { name: 'initialAccount', internalType: 'address', type: 'address' },
      { name: 'initialBalance', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approveInternal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferInternal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
] as const

/**
 *
 */
export const helpAddress = {
  31337: '0xfbC22278A96299D91d41C453234d97b4F5Eb9B2d',
} as const

/**
 *
 */
export const helpConfig = { address: helpAddress, abi: helpAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MultiSignatureWallet
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const multiSignatureWalletAbi = [
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [{ name: 'newSigner', internalType: 'address', type: 'address' }],
    name: 'addSigner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newSigner', internalType: 'address', type: 'address' },
      {
        name: 'newSignaturesRequired',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'addSignerAndUpdateSignaturesRequired',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address payable', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'signatures', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'executeTransaction',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_hash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'getSignerAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSigners',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'getTransactionHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_signers', internalType: 'address[]', type: 'address[]' },
      { name: '_signaturesRequired', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isSigner',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signerToRemove', internalType: 'address', type: 'address' },
    ],
    name: 'removeSigner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signerToRemove', internalType: 'address', type: 'address' },
      {
        name: 'newSignaturesRequired',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'removeSignersAndUpdateSignaturesRequired',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'signaturesRequired',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'signers',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newSignaturesRequired',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'updateSignaturesRequired',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EtherReceived',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'signer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'to',
        internalType: 'address payable',
        type: 'address',
        indexed: false,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'nonce',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'hash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'ExecuteTransaction',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'signaturesRequired',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'SignaturesRequiredUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'signer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'SignerAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'signer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'SignerRemoved',
  },
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  {
    type: 'error',
    inputs: [],
    name: 'MultiSignatureWallet__AddressIsNotASigner',
  },
  { type: 'error', inputs: [], name: 'MultiSignatureWallet__AlreadyASigner' },
  {
    type: 'error',
    inputs: [],
    name: 'MultiSignatureWallet__AlreadyInitialized',
  },
  {
    type: 'error',
    inputs: [],
    name: 'MultiSignatureWallet__DuplicatedOrRevertedSignature',
  },
  {
    type: 'error',
    inputs: [],
    name: 'MultiSignatureWallet__ExternalTransactionFailed',
  },
  {
    type: 'error',
    inputs: [],
    name: 'MultiSignatureWallet__LessSignersThanSingaturesRequired',
  },
  {
    type: 'error',
    inputs: [],
    name: 'MultiSignatureWallet__NotEnoughValidSignatures',
  },
  { type: 'error', inputs: [], name: 'MultiSignatureWallet__OnlySelfAllowed' },
  {
    type: 'error',
    inputs: [],
    name: 'MultiSignatureWallet__SignaturesRequiredCantBe0',
  },
  { type: 'error', inputs: [], name: 'NotInitializing' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MultiSignatureWalletFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const multiSignatureWalletFactoryAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'MULTI_SIGNATURE_WALLET_IMPLEMENTATION',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'createChild',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'salt', internalType: 'bytes32', type: 'bytes32' }],
    name: 'createChildDeterministic',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllMultiSignatureWallets',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'salt', internalType: 'bytes32', type: 'bytes32' }],
    name: 'predictDeterministicAddress',
    outputs: [{ name: 'predicted', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'multiSignatureWallet',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'MultiSignatureWalletCreated',
  },
  { type: 'error', inputs: [], name: 'FailedDeployment' },
  {
    type: 'error',
    inputs: [
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
] as const

/**
 *
 */
export const multiSignatureWalletFactoryAddress = {
  31337: '0xC9a43158891282A2B1475592D5719c001986Aaec',
} as const

/**
 *
 */
export const multiSignatureWalletFactoryConfig = {
  address: multiSignatureWalletFactoryAddress,
  abi: multiSignatureWalletFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PROBLM
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const problmAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'symbol', internalType: 'string', type: 'string' },
      { name: 'initialAccount', internalType: 'address', type: 'address' },
      { name: 'initialBalance', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approveInternal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferInternal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
] as const

/**
 *
 */
export const problmAddress = {
  31337: '0xfbC22278A96299D91d41C453234d97b4F5Eb9B2d',
} as const

/**
 *
 */
export const problmConfig = { address: problmAddress, abi: problmAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UniV2Pool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const uniV2PoolAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'tokenAAddr', internalType: 'address', type: 'address' },
      { name: 'tokenBAddr', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'yOutput', internalType: 'uint256', type: 'uint256' },
      { name: 'xReserves', internalType: 'uint256', type: 'uint256' },
      { name: 'yReserves', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'calculateXInput',
    outputs: [{ name: 'xInput', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'currentPrice',
    outputs: [
      { name: '_currentPrice', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenAAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenBAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'deposit',
    outputs: [
      { name: 'liquidityMinted', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenAAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenBAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'init',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'liquidity',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'xInput', internalType: 'uint256', type: 'uint256' },
      { name: 'xReserves', internalType: 'uint256', type: 'uint256' },
      { name: 'yReserves', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'price',
    outputs: [{ name: 'yOutput', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'inputToken', internalType: 'address', type: 'address' },
      { name: 'inputAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'swap',
    outputs: [
      { name: 'outputAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalLiquidity',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'withdraw',
    outputs: [
      { name: 'tokenAAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenBAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'liquidityProvider',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'liquidityMinted',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'tokenAInput',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'tokenBInput',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'LiquidityProvided',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'liquidityRemover',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'liquidityWithdrawn',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'tokenAOutput',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'tokenBOutput',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'LiquidityRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'price',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PriceUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'swapper',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'inputToken',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'inputAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'outputToken',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'outputAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Swap',
  },
] as const

/**
 *
 */
export const uniV2PoolAddress = {
  31337: '0x1c85638e118b37167e9298c2268758e058DdfDA0',
} as const

/**
 *
 */
export const uniV2PoolConfig = {
  address: uniV2PoolAddress,
  abi: uniV2PoolAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link helpAbi}__
 *
 *
 */
export const useReadHelp = /*#__PURE__*/ createUseReadContract({
  abi: helpAbi,
  address: helpAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"allowance"`
 *
 *
 */
export const useReadHelpAllowance = /*#__PURE__*/ createUseReadContract({
  abi: helpAbi,
  address: helpAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"balanceOf"`
 *
 *
 */
export const useReadHelpBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: helpAbi,
  address: helpAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"decimals"`
 *
 *
 */
export const useReadHelpDecimals = /*#__PURE__*/ createUseReadContract({
  abi: helpAbi,
  address: helpAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"name"`
 *
 *
 */
export const useReadHelpName = /*#__PURE__*/ createUseReadContract({
  abi: helpAbi,
  address: helpAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"symbol"`
 *
 *
 */
export const useReadHelpSymbol = /*#__PURE__*/ createUseReadContract({
  abi: helpAbi,
  address: helpAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"totalSupply"`
 *
 *
 */
export const useReadHelpTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: helpAbi,
  address: helpAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link helpAbi}__
 *
 *
 */
export const useWriteHelp = /*#__PURE__*/ createUseWriteContract({
  abi: helpAbi,
  address: helpAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"approve"`
 *
 *
 */
export const useWriteHelpApprove = /*#__PURE__*/ createUseWriteContract({
  abi: helpAbi,
  address: helpAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"approveInternal"`
 *
 *
 */
export const useWriteHelpApproveInternal = /*#__PURE__*/ createUseWriteContract(
  { abi: helpAbi, address: helpAddress, functionName: 'approveInternal' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"burn"`
 *
 *
 */
export const useWriteHelpBurn = /*#__PURE__*/ createUseWriteContract({
  abi: helpAbi,
  address: helpAddress,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"mint"`
 *
 *
 */
export const useWriteHelpMint = /*#__PURE__*/ createUseWriteContract({
  abi: helpAbi,
  address: helpAddress,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"transfer"`
 *
 *
 */
export const useWriteHelpTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: helpAbi,
  address: helpAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"transferFrom"`
 *
 *
 */
export const useWriteHelpTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: helpAbi,
  address: helpAddress,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"transferInternal"`
 *
 *
 */
export const useWriteHelpTransferInternal =
  /*#__PURE__*/ createUseWriteContract({
    abi: helpAbi,
    address: helpAddress,
    functionName: 'transferInternal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link helpAbi}__
 *
 *
 */
export const useSimulateHelp = /*#__PURE__*/ createUseSimulateContract({
  abi: helpAbi,
  address: helpAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"approve"`
 *
 *
 */
export const useSimulateHelpApprove = /*#__PURE__*/ createUseSimulateContract({
  abi: helpAbi,
  address: helpAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"approveInternal"`
 *
 *
 */
export const useSimulateHelpApproveInternal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: helpAbi,
    address: helpAddress,
    functionName: 'approveInternal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"burn"`
 *
 *
 */
export const useSimulateHelpBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: helpAbi,
  address: helpAddress,
  functionName: 'burn',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"mint"`
 *
 *
 */
export const useSimulateHelpMint = /*#__PURE__*/ createUseSimulateContract({
  abi: helpAbi,
  address: helpAddress,
  functionName: 'mint',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"transfer"`
 *
 *
 */
export const useSimulateHelpTransfer = /*#__PURE__*/ createUseSimulateContract({
  abi: helpAbi,
  address: helpAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"transferFrom"`
 *
 *
 */
export const useSimulateHelpTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: helpAbi,
    address: helpAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link helpAbi}__ and `functionName` set to `"transferInternal"`
 *
 *
 */
export const useSimulateHelpTransferInternal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: helpAbi,
    address: helpAddress,
    functionName: 'transferInternal',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link helpAbi}__
 *
 *
 */
export const useWatchHelpEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: helpAbi,
  address: helpAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link helpAbi}__ and `eventName` set to `"Approval"`
 *
 *
 */
export const useWatchHelpApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: helpAbi,
    address: helpAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link helpAbi}__ and `eventName` set to `"Transfer"`
 *
 *
 */
export const useWatchHelpTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: helpAbi,
    address: helpAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__
 */
export const useReadMultiSignatureWallet = /*#__PURE__*/ createUseReadContract({
  abi: multiSignatureWalletAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"getSignerAddress"`
 */
export const useReadMultiSignatureWalletGetSignerAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSignatureWalletAbi,
    functionName: 'getSignerAddress',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"getSigners"`
 */
export const useReadMultiSignatureWalletGetSigners =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSignatureWalletAbi,
    functionName: 'getSigners',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"getTransactionHash"`
 */
export const useReadMultiSignatureWalletGetTransactionHash =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSignatureWalletAbi,
    functionName: 'getTransactionHash',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"isSigner"`
 */
export const useReadMultiSignatureWalletIsSigner =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSignatureWalletAbi,
    functionName: 'isSigner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"nonce"`
 */
export const useReadMultiSignatureWalletNonce =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSignatureWalletAbi,
    functionName: 'nonce',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"signaturesRequired"`
 */
export const useReadMultiSignatureWalletSignaturesRequired =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSignatureWalletAbi,
    functionName: 'signaturesRequired',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"signers"`
 */
export const useReadMultiSignatureWalletSigners =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSignatureWalletAbi,
    functionName: 'signers',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__
 */
export const useWriteMultiSignatureWallet =
  /*#__PURE__*/ createUseWriteContract({ abi: multiSignatureWalletAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"addSigner"`
 */
export const useWriteMultiSignatureWalletAddSigner =
  /*#__PURE__*/ createUseWriteContract({
    abi: multiSignatureWalletAbi,
    functionName: 'addSigner',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"addSignerAndUpdateSignaturesRequired"`
 */
export const useWriteMultiSignatureWalletAddSignerAndUpdateSignaturesRequired =
  /*#__PURE__*/ createUseWriteContract({
    abi: multiSignatureWalletAbi,
    functionName: 'addSignerAndUpdateSignaturesRequired',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"executeTransaction"`
 */
export const useWriteMultiSignatureWalletExecuteTransaction =
  /*#__PURE__*/ createUseWriteContract({
    abi: multiSignatureWalletAbi,
    functionName: 'executeTransaction',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteMultiSignatureWalletInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: multiSignatureWalletAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"removeSigner"`
 */
export const useWriteMultiSignatureWalletRemoveSigner =
  /*#__PURE__*/ createUseWriteContract({
    abi: multiSignatureWalletAbi,
    functionName: 'removeSigner',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"removeSignersAndUpdateSignaturesRequired"`
 */
export const useWriteMultiSignatureWalletRemoveSignersAndUpdateSignaturesRequired =
  /*#__PURE__*/ createUseWriteContract({
    abi: multiSignatureWalletAbi,
    functionName: 'removeSignersAndUpdateSignaturesRequired',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"updateSignaturesRequired"`
 */
export const useWriteMultiSignatureWalletUpdateSignaturesRequired =
  /*#__PURE__*/ createUseWriteContract({
    abi: multiSignatureWalletAbi,
    functionName: 'updateSignaturesRequired',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__
 */
export const useSimulateMultiSignatureWallet =
  /*#__PURE__*/ createUseSimulateContract({ abi: multiSignatureWalletAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"addSigner"`
 */
export const useSimulateMultiSignatureWalletAddSigner =
  /*#__PURE__*/ createUseSimulateContract({
    abi: multiSignatureWalletAbi,
    functionName: 'addSigner',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"addSignerAndUpdateSignaturesRequired"`
 */
export const useSimulateMultiSignatureWalletAddSignerAndUpdateSignaturesRequired =
  /*#__PURE__*/ createUseSimulateContract({
    abi: multiSignatureWalletAbi,
    functionName: 'addSignerAndUpdateSignaturesRequired',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"executeTransaction"`
 */
export const useSimulateMultiSignatureWalletExecuteTransaction =
  /*#__PURE__*/ createUseSimulateContract({
    abi: multiSignatureWalletAbi,
    functionName: 'executeTransaction',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateMultiSignatureWalletInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: multiSignatureWalletAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"removeSigner"`
 */
export const useSimulateMultiSignatureWalletRemoveSigner =
  /*#__PURE__*/ createUseSimulateContract({
    abi: multiSignatureWalletAbi,
    functionName: 'removeSigner',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"removeSignersAndUpdateSignaturesRequired"`
 */
export const useSimulateMultiSignatureWalletRemoveSignersAndUpdateSignaturesRequired =
  /*#__PURE__*/ createUseSimulateContract({
    abi: multiSignatureWalletAbi,
    functionName: 'removeSignersAndUpdateSignaturesRequired',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `functionName` set to `"updateSignaturesRequired"`
 */
export const useSimulateMultiSignatureWalletUpdateSignaturesRequired =
  /*#__PURE__*/ createUseSimulateContract({
    abi: multiSignatureWalletAbi,
    functionName: 'updateSignaturesRequired',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSignatureWalletAbi}__
 */
export const useWatchMultiSignatureWalletEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: multiSignatureWalletAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `eventName` set to `"EtherReceived"`
 */
export const useWatchMultiSignatureWalletEtherReceivedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: multiSignatureWalletAbi,
    eventName: 'EtherReceived',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `eventName` set to `"ExecuteTransaction"`
 */
export const useWatchMultiSignatureWalletExecuteTransactionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: multiSignatureWalletAbi,
    eventName: 'ExecuteTransaction',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchMultiSignatureWalletInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: multiSignatureWalletAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `eventName` set to `"SignaturesRequiredUpdated"`
 */
export const useWatchMultiSignatureWalletSignaturesRequiredUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: multiSignatureWalletAbi,
    eventName: 'SignaturesRequiredUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `eventName` set to `"SignerAdded"`
 */
export const useWatchMultiSignatureWalletSignerAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: multiSignatureWalletAbi,
    eventName: 'SignerAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSignatureWalletAbi}__ and `eventName` set to `"SignerRemoved"`
 */
export const useWatchMultiSignatureWalletSignerRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: multiSignatureWalletAbi,
    eventName: 'SignerRemoved',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSignatureWalletFactoryAbi}__
 *
 *
 */
export const useReadMultiSignatureWalletFactory =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSignatureWalletFactoryAbi,
    address: multiSignatureWalletFactoryAddress,
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSignatureWalletFactoryAbi}__ and `functionName` set to `"MULTI_SIGNATURE_WALLET_IMPLEMENTATION"`
 *
 *
 */
export const useReadMultiSignatureWalletFactoryMultiSignatureWalletImplementation =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSignatureWalletFactoryAbi,
    address: multiSignatureWalletFactoryAddress,
    functionName: 'MULTI_SIGNATURE_WALLET_IMPLEMENTATION',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSignatureWalletFactoryAbi}__ and `functionName` set to `"getAllMultiSignatureWallets"`
 *
 *
 */
export const useReadMultiSignatureWalletFactoryGetAllMultiSignatureWallets =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSignatureWalletFactoryAbi,
    address: multiSignatureWalletFactoryAddress,
    functionName: 'getAllMultiSignatureWallets',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link multiSignatureWalletFactoryAbi}__ and `functionName` set to `"predictDeterministicAddress"`
 *
 *
 */
export const useReadMultiSignatureWalletFactoryPredictDeterministicAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: multiSignatureWalletFactoryAbi,
    address: multiSignatureWalletFactoryAddress,
    functionName: 'predictDeterministicAddress',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSignatureWalletFactoryAbi}__
 *
 *
 */
export const useWriteMultiSignatureWalletFactory =
  /*#__PURE__*/ createUseWriteContract({
    abi: multiSignatureWalletFactoryAbi,
    address: multiSignatureWalletFactoryAddress,
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSignatureWalletFactoryAbi}__ and `functionName` set to `"createChild"`
 *
 *
 */
export const useWriteMultiSignatureWalletFactoryCreateChild =
  /*#__PURE__*/ createUseWriteContract({
    abi: multiSignatureWalletFactoryAbi,
    address: multiSignatureWalletFactoryAddress,
    functionName: 'createChild',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link multiSignatureWalletFactoryAbi}__ and `functionName` set to `"createChildDeterministic"`
 *
 *
 */
export const useWriteMultiSignatureWalletFactoryCreateChildDeterministic =
  /*#__PURE__*/ createUseWriteContract({
    abi: multiSignatureWalletFactoryAbi,
    address: multiSignatureWalletFactoryAddress,
    functionName: 'createChildDeterministic',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSignatureWalletFactoryAbi}__
 *
 *
 */
export const useSimulateMultiSignatureWalletFactory =
  /*#__PURE__*/ createUseSimulateContract({
    abi: multiSignatureWalletFactoryAbi,
    address: multiSignatureWalletFactoryAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSignatureWalletFactoryAbi}__ and `functionName` set to `"createChild"`
 *
 *
 */
export const useSimulateMultiSignatureWalletFactoryCreateChild =
  /*#__PURE__*/ createUseSimulateContract({
    abi: multiSignatureWalletFactoryAbi,
    address: multiSignatureWalletFactoryAddress,
    functionName: 'createChild',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link multiSignatureWalletFactoryAbi}__ and `functionName` set to `"createChildDeterministic"`
 *
 *
 */
export const useSimulateMultiSignatureWalletFactoryCreateChildDeterministic =
  /*#__PURE__*/ createUseSimulateContract({
    abi: multiSignatureWalletFactoryAbi,
    address: multiSignatureWalletFactoryAddress,
    functionName: 'createChildDeterministic',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSignatureWalletFactoryAbi}__
 *
 *
 */
export const useWatchMultiSignatureWalletFactoryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: multiSignatureWalletFactoryAbi,
    address: multiSignatureWalletFactoryAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link multiSignatureWalletFactoryAbi}__ and `eventName` set to `"MultiSignatureWalletCreated"`
 *
 *
 */
export const useWatchMultiSignatureWalletFactoryMultiSignatureWalletCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: multiSignatureWalletFactoryAbi,
    address: multiSignatureWalletFactoryAddress,
    eventName: 'MultiSignatureWalletCreated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link problmAbi}__
 *
 *
 */
export const useReadProblm = /*#__PURE__*/ createUseReadContract({
  abi: problmAbi,
  address: problmAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"allowance"`
 *
 *
 */
export const useReadProblmAllowance = /*#__PURE__*/ createUseReadContract({
  abi: problmAbi,
  address: problmAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"balanceOf"`
 *
 *
 */
export const useReadProblmBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: problmAbi,
  address: problmAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"decimals"`
 *
 *
 */
export const useReadProblmDecimals = /*#__PURE__*/ createUseReadContract({
  abi: problmAbi,
  address: problmAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"name"`
 *
 *
 */
export const useReadProblmName = /*#__PURE__*/ createUseReadContract({
  abi: problmAbi,
  address: problmAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"symbol"`
 *
 *
 */
export const useReadProblmSymbol = /*#__PURE__*/ createUseReadContract({
  abi: problmAbi,
  address: problmAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"totalSupply"`
 *
 *
 */
export const useReadProblmTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: problmAbi,
  address: problmAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link problmAbi}__
 *
 *
 */
export const useWriteProblm = /*#__PURE__*/ createUseWriteContract({
  abi: problmAbi,
  address: problmAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"approve"`
 *
 *
 */
export const useWriteProblmApprove = /*#__PURE__*/ createUseWriteContract({
  abi: problmAbi,
  address: problmAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"approveInternal"`
 *
 *
 */
export const useWriteProblmApproveInternal =
  /*#__PURE__*/ createUseWriteContract({
    abi: problmAbi,
    address: problmAddress,
    functionName: 'approveInternal',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"burn"`
 *
 *
 */
export const useWriteProblmBurn = /*#__PURE__*/ createUseWriteContract({
  abi: problmAbi,
  address: problmAddress,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"mint"`
 *
 *
 */
export const useWriteProblmMint = /*#__PURE__*/ createUseWriteContract({
  abi: problmAbi,
  address: problmAddress,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"transfer"`
 *
 *
 */
export const useWriteProblmTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: problmAbi,
  address: problmAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"transferFrom"`
 *
 *
 */
export const useWriteProblmTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: problmAbi,
  address: problmAddress,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"transferInternal"`
 *
 *
 */
export const useWriteProblmTransferInternal =
  /*#__PURE__*/ createUseWriteContract({
    abi: problmAbi,
    address: problmAddress,
    functionName: 'transferInternal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link problmAbi}__
 *
 *
 */
export const useSimulateProblm = /*#__PURE__*/ createUseSimulateContract({
  abi: problmAbi,
  address: problmAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"approve"`
 *
 *
 */
export const useSimulateProblmApprove = /*#__PURE__*/ createUseSimulateContract(
  { abi: problmAbi, address: problmAddress, functionName: 'approve' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"approveInternal"`
 *
 *
 */
export const useSimulateProblmApproveInternal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: problmAbi,
    address: problmAddress,
    functionName: 'approveInternal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"burn"`
 *
 *
 */
export const useSimulateProblmBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: problmAbi,
  address: problmAddress,
  functionName: 'burn',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"mint"`
 *
 *
 */
export const useSimulateProblmMint = /*#__PURE__*/ createUseSimulateContract({
  abi: problmAbi,
  address: problmAddress,
  functionName: 'mint',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"transfer"`
 *
 *
 */
export const useSimulateProblmTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: problmAbi,
    address: problmAddress,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"transferFrom"`
 *
 *
 */
export const useSimulateProblmTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: problmAbi,
    address: problmAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link problmAbi}__ and `functionName` set to `"transferInternal"`
 *
 *
 */
export const useSimulateProblmTransferInternal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: problmAbi,
    address: problmAddress,
    functionName: 'transferInternal',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link problmAbi}__
 *
 *
 */
export const useWatchProblmEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: problmAbi,
  address: problmAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link problmAbi}__ and `eventName` set to `"Approval"`
 *
 *
 */
export const useWatchProblmApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: problmAbi,
    address: problmAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link problmAbi}__ and `eventName` set to `"Transfer"`
 *
 *
 */
export const useWatchProblmTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: problmAbi,
    address: problmAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniV2PoolAbi}__
 *
 *
 */
export const useReadUniV2Pool = /*#__PURE__*/ createUseReadContract({
  abi: uniV2PoolAbi,
  address: uniV2PoolAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniV2PoolAbi}__ and `functionName` set to `"calculateXInput"`
 *
 *
 */
export const useReadUniV2PoolCalculateXInput =
  /*#__PURE__*/ createUseReadContract({
    abi: uniV2PoolAbi,
    address: uniV2PoolAddress,
    functionName: 'calculateXInput',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniV2PoolAbi}__ and `functionName` set to `"currentPrice"`
 *
 *
 */
export const useReadUniV2PoolCurrentPrice = /*#__PURE__*/ createUseReadContract(
  {
    abi: uniV2PoolAbi,
    address: uniV2PoolAddress,
    functionName: 'currentPrice',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniV2PoolAbi}__ and `functionName` set to `"liquidity"`
 *
 *
 */
export const useReadUniV2PoolLiquidity = /*#__PURE__*/ createUseReadContract({
  abi: uniV2PoolAbi,
  address: uniV2PoolAddress,
  functionName: 'liquidity',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniV2PoolAbi}__ and `functionName` set to `"price"`
 *
 *
 */
export const useReadUniV2PoolPrice = /*#__PURE__*/ createUseReadContract({
  abi: uniV2PoolAbi,
  address: uniV2PoolAddress,
  functionName: 'price',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link uniV2PoolAbi}__ and `functionName` set to `"totalLiquidity"`
 *
 *
 */
export const useReadUniV2PoolTotalLiquidity =
  /*#__PURE__*/ createUseReadContract({
    abi: uniV2PoolAbi,
    address: uniV2PoolAddress,
    functionName: 'totalLiquidity',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniV2PoolAbi}__
 *
 *
 */
export const useWriteUniV2Pool = /*#__PURE__*/ createUseWriteContract({
  abi: uniV2PoolAbi,
  address: uniV2PoolAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniV2PoolAbi}__ and `functionName` set to `"deposit"`
 *
 *
 */
export const useWriteUniV2PoolDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: uniV2PoolAbi,
  address: uniV2PoolAddress,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniV2PoolAbi}__ and `functionName` set to `"init"`
 *
 *
 */
export const useWriteUniV2PoolInit = /*#__PURE__*/ createUseWriteContract({
  abi: uniV2PoolAbi,
  address: uniV2PoolAddress,
  functionName: 'init',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniV2PoolAbi}__ and `functionName` set to `"swap"`
 *
 *
 */
export const useWriteUniV2PoolSwap = /*#__PURE__*/ createUseWriteContract({
  abi: uniV2PoolAbi,
  address: uniV2PoolAddress,
  functionName: 'swap',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link uniV2PoolAbi}__ and `functionName` set to `"withdraw"`
 *
 *
 */
export const useWriteUniV2PoolWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: uniV2PoolAbi,
  address: uniV2PoolAddress,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniV2PoolAbi}__
 *
 *
 */
export const useSimulateUniV2Pool = /*#__PURE__*/ createUseSimulateContract({
  abi: uniV2PoolAbi,
  address: uniV2PoolAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniV2PoolAbi}__ and `functionName` set to `"deposit"`
 *
 *
 */
export const useSimulateUniV2PoolDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: uniV2PoolAbi,
    address: uniV2PoolAddress,
    functionName: 'deposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniV2PoolAbi}__ and `functionName` set to `"init"`
 *
 *
 */
export const useSimulateUniV2PoolInit = /*#__PURE__*/ createUseSimulateContract(
  { abi: uniV2PoolAbi, address: uniV2PoolAddress, functionName: 'init' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniV2PoolAbi}__ and `functionName` set to `"swap"`
 *
 *
 */
export const useSimulateUniV2PoolSwap = /*#__PURE__*/ createUseSimulateContract(
  { abi: uniV2PoolAbi, address: uniV2PoolAddress, functionName: 'swap' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link uniV2PoolAbi}__ and `functionName` set to `"withdraw"`
 *
 *
 */
export const useSimulateUniV2PoolWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: uniV2PoolAbi,
    address: uniV2PoolAddress,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniV2PoolAbi}__
 *
 *
 */
export const useWatchUniV2PoolEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: uniV2PoolAbi, address: uniV2PoolAddress },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniV2PoolAbi}__ and `eventName` set to `"LiquidityProvided"`
 *
 *
 */
export const useWatchUniV2PoolLiquidityProvidedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: uniV2PoolAbi,
    address: uniV2PoolAddress,
    eventName: 'LiquidityProvided',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniV2PoolAbi}__ and `eventName` set to `"LiquidityRemoved"`
 *
 *
 */
export const useWatchUniV2PoolLiquidityRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: uniV2PoolAbi,
    address: uniV2PoolAddress,
    eventName: 'LiquidityRemoved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniV2PoolAbi}__ and `eventName` set to `"PriceUpdated"`
 *
 *
 */
export const useWatchUniV2PoolPriceUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: uniV2PoolAbi,
    address: uniV2PoolAddress,
    eventName: 'PriceUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link uniV2PoolAbi}__ and `eventName` set to `"Swap"`
 *
 *
 */
export const useWatchUniV2PoolSwapEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: uniV2PoolAbi,
    address: uniV2PoolAddress,
    eventName: 'Swap',
  })
