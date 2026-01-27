import { Abi, encodeFunctionData } from 'viem'

/**
 * This file exist mainly to ensure ExecutionTx remains invariant, and we don't accidentally change it
 * ExectuionTx is an object with the properties needed to execute a transaction
 * To build an ExecutionTx, we need the params defined in the type BuildExecutionTxParams
 * Just for reference:
 * - Abi: (Application Binary Interface) Is the specific ABI of the specific contract. It defines how we interact with the contract
 * - FunctionName: The name of the function we want to call on the contract. (needs to be inside the abi)
 * - Args: The arguments we want to pass to the function. (needs to be inside the abi, and we need to read the ABI to know the params the function needs)
 * - To: The address of the contract we want to call (we send the tx to the contract specifying the function ... to execute that function)
 * - Nonce: The nonce of the transaction - (Tx intented to be executed by the multisig needs the mutlis wallet nonce, not the user nonce)
 * - Value: The amount of ETH we want to send to the contract
 */

export type Address = `0x${string}`
export type Hex = `0x${string}`

export type ExecutionTx = {
  chainId: number
  to: Address
  value: bigint
  data: Hex
  nonce: bigint
}

type BuildExecutionTxParams = {
  chainId: number
  abi: Abi
  functionName: string
  args?: readonly unknown[]
  to: Address
  nonce: bigint
  value?: bigint
}

export function buildExecutionTx(params: BuildExecutionTxParams): ExecutionTx {
  const {
    chainId,
    abi,
    functionName,
    args = [],
    to,
    nonce,
    value = BigInt(0),
  } = params

  const data = encodeFunctionData({
    abi,
    functionName,
    args,
  })

  return {
    chainId,
    to,
    value,
    data,
    nonce,
  }
}
