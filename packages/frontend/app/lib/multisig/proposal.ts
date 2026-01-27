import { encodeAbiParameters, keccak256 } from 'viem'
import type { ExecutionTx, Address, Hex } from './executionTx'

/**
 * A proposal is just a wrapper of ExecutionTx with a list of signatures
 * All the signatures should be signed by the signers of the multisig wallet
 */

export type Signature = {
  signer: Address
  signature: Hex
}

export type Proposal = {
  version: '1'
  id: Hex
  tx: ExecutionTx
  signatures: Signature[]
}

// The parameters of an ExectuionTx are unique (the combination of them *)
// *If the chainId, to, value, data and nonce are the same, we are talking about the same tx
// That is why we use them to generate the proposal ID
// Proposal ID is not strictly needed, but it makes the code more ergonomic
function hashExecutionTx(tx: ExecutionTx): Hex {
  return keccak256(
    encodeAbiParameters(
      [
        { type: 'uint256' }, // chainId
        { type: 'address' }, // to
        { type: 'uint256' }, // value
        { type: 'bytes' }, // data
        { type: 'uint256' }, // nonce
      ],
      [BigInt(tx.chainId), tx.to, tx.value, tx.data, tx.nonce]
    )
  )
}

export function createProposal(tx: ExecutionTx): Proposal {
  return {
    version: '1',
    id: hashExecutionTx(tx),
    tx,
    signatures: [],
  }
}
