// contracts.ts
import MintableERC20 from '@contracts/out/MintableERC20.sol/MintableERC20.json'
import MultiSignatureWalletFactory from '@contracts/out/MultiSignatureWalletFactory.sol/MultiSignatureWalletFactory.json'
import MultiSignatureWallet from '@contracts/out/MultiSignatureWallet.sol/MultiSignatureWallet.json'
import UniV2Pool from '@contracts/out/UniV2Pool.sol/UniV2Pool.json'

import broadcastDeployAnvil from '@contracts/broadcast/Deploy.s.sol/31337/run-latest.json' with { type: 'json' }
// import broadcastDeployAnvil from '@contracts/broadcast/Deploy.s.sol/11155111/run-latest.json' with { type: 'json' } Sepolia
// import broadcastDeployAnvil from '@contracts/broadcast/Deploy.s.sol/1/run-latest.json' with { type: 'json' } Mainnet

import type { Abi } from 'viem'
import type { Address } from 'viem/accounts'

const _contracts = [
  {
    name: 'HELP',
    contractName: 'MintableERC20',
    abi: MintableERC20.abi as Abi,
  },
  {
    name: 'PROBLM',
    contractName: 'MintableERC20',
    abi: MintableERC20.abi as Abi,
  },
  {
    name: 'MultiSignatureWalletFactory',
    contractName: 'MultiSignatureWalletFactory',
    abi: MultiSignatureWalletFactory.abi as Abi,
  },
  {
    name: 'MultiSignatureWallet',
    contractName: 'MultiSignatureWallet',
    abi: MultiSignatureWallet.abi as Abi,
  },
  {
    name: 'UniV2Pool',
    contractName: 'UniV2Pool',
    abi: UniV2Pool.abi as Abi,
  },
] as const

export type ResolvedContract = {
  name: string
  abi: Abi
  address?: { [x: number]: Address }
  contractName: string
}

function resolveContracts(): ResolvedContract[] {
  return _contracts.map((contract) => {
    const tx = broadcastDeployAnvil.transactions.find(
      (tx) =>
        tx.transactionType === 'CREATE' &&
        tx.contractName === contract.contractName
    )

    if (!tx) {
      return contract
    }

    if (!tx.contractAddress) return contract
    const chainId = Number(tx.transaction.chainId)
    const address = tx.contractAddress as Address
    return {
      ...contract,
      address: { [chainId]: address },
    }
  })
}

export const resolvedContracts = resolveContracts()
