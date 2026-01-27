'use client'

import { Abi, Address, getAbiItem } from 'viem'
import { useChainId, useWalletClient } from 'wagmi'
import {
  buildExecutionTx,
  ExecutionTx,
  Proposal,
  createProposal,
} from '@/app/lib/multisig'
import { multiSignatureWalletAbi } from '@/app/lib/wagmiHooks/generated'

type TransactionParams = {
  functionName: string
  args?: readonly unknown[]
  abi: Abi
  nonce: bigint
  value?: bigint
}

/**
 * This hook creates tx intents.
 * @param walletHash is the specific MultiSignatureWallet contract address
 */

export function useWalletProposalCodec(walletHash: `0x${string}`) {
  const chainId = useChainId()
  const { data: walletClient } = useWalletClient()

  const signer = walletClient?.account.address

  /**
   * Build + sign a proposal
   */
  const encodeProposal = async (
    params: TransactionParams
  ): Promise<Proposal> => {
    if (!walletClient) throw new Error('Wallet client not available')
    if (!signer) throw new Error('Wallet not connected')
    const { functionName, args = [], nonce, value, abi } = params

    try {
      getAbiItem({
        abi,
        name: functionName,
      })
    } catch {
      throw new Error(`Function ${functionName} not found in ABI`)
    }

    // ---- Build execution tx ----
    const tx: ExecutionTx = buildExecutionTx({
      chainId,
      abi,
      functionName,
      args,
      to: walletHash,
      nonce,
      value,
    })

    // ---- Create proposal (ID is generated here) ----
    const proposal = createProposal(tx)
    // ↑ remember that our proposal id is not part of EIP-712
    // we use proposal.id to keep track of the proposal in our system

    // ---- EIP-712 signing ----
    const domain = {
      name: 'Multisig Wallet',
      version: '1',
      chainId,
      verifyingContract: walletHash,
    }

    const types = {
      ExecutionTx: [
        { name: 'chainId', type: 'uint256' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'data', type: 'bytes' },
        { name: 'nonce', type: 'uint256' },
      ],
    }

    const signature = await walletClient.signTypedData({
      domain,
      types,
      primaryType: 'ExecutionTx',
      message: proposal.tx,
    })

    // ---- Attach signature into the proposal ----
    proposal.signatures.push({
      signer,
      signature,
    })

    return proposal
  }

  const encodeMultiSignatureWalletAddSignerProposal = ({
    newSigner,
    nonce,
  }: {
    newSigner: Address
    nonce: bigint
  }) => {
    return encodeProposal({
      abi: multiSignatureWalletAbi,
      functionName: 'addSigner',
      args: [newSigner],
      nonce: nonce,
      value: BigInt(0),
    })
  }

  return {
    encodeProposal,
    encodeMultiSignatureWalletAddSignerProposal,
    // decodeProposal,
  }
}
