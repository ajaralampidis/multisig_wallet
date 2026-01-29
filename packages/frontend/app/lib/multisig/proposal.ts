import { encodeAbiParameters, keccak256, Abi, decodeFunctionData } from 'viem'
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

function txArgToString(arg: unknown): string {
  if (typeof arg === 'bigint') return arg.toString()
  if (typeof arg === 'string') return arg
  if (typeof arg === 'number') return arg.toString()
  if (Array.isArray(arg)) return `[${arg.map(txArgToString).join(', ')}]`
  if (arg && typeof arg === 'object') return JSON.stringify(arg)
  return String(arg)
}

/**
 * Decode calldata (tx.data) using provided abi.
 * Returns { functionName, args } — no extra types.
 */
export function decodeExecutionTxData(
  txData: Hex,
  abi: Abi
): { functionName: string; args: readonly unknown[] } {
  const decoded = decodeFunctionData({ abi, data: txData }) as {
    functionName: string
    args?: readonly unknown[]
  }

  return {
    functionName: decoded.functionName,
    args: decoded.args ?? [],
  }
}

/**
 * getDisplayString expects the correct ABI to be passed in (for now).
 * If abi is null/undefined decoding will be skipped and a fallback returned.
 */
export function getProposalDisplayString(
  proposal: Proposal,
  abi?: Abi | null
): string {
  const { tx } = proposal

  if (!abi) {
    return `Unknown call (${tx.data.slice(0, 10)}…)`
    // TODO: we can attempt to get the abi from third-party servicies or with other helper functions
  }

  try {
    const { functionName, args } = decodeExecutionTxData(tx.data, abi)

    const argsStr = args.map(txArgToString).join(', ')
    const valueStr =
      tx.value > BigInt(0) ? ` + value ${tx.value.toString()}` : ''
    return `${functionName}(${argsStr})${valueStr}`
  } catch {
    return `Un-decodable call (${tx.data.slice(0, 10)}…)`
  }
}
