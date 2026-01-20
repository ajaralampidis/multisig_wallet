'use client'
import { useConnection, useReadContract, useWriteContract } from 'wagmi'

import MintableERC20Artifact from '@contracts/out/MintableERC20.sol/MintableERC20.json' with { type: 'json' }

const HELP_TOKEN_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const PROBLM_TOKEN_ADDRESS = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'

const tokenAbi = MintableERC20Artifact.abi

export function MintableERC20({
  mintableToken,
}: {
  mintableToken: 'HELP' | 'PROBLM'
}) {
  const { address: userAddress, isConnected } = useConnection()
  const tokenAddress =
    mintableToken === 'HELP' ? HELP_TOKEN_ADDRESS : PROBLM_TOKEN_ADDRESS

  // --- Reading Data ---
  const {
    data: balance,
    isLoading,
    error,
  } = useReadContract({
    abi: tokenAbi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [userAddress],
    query: { enabled: isConnected }, // Only run if connected
  })

  const {
    data: symbol,
    isLoading: tickerLoading,
    error: tickerError,
  } = useReadContract({
    abi: tokenAbi,
    address: tokenAddress,
    functionName: 'symbol',
    query: { enabled: isConnected }, // Only run if connected
  })

  // --- Writing Data ---
  const { data, isPending, mutate, error: writeError } = useWriteContract()

  const handleMint = () => {
    mutate({
      abi: tokenAbi,
      address: tokenAddress,
      functionName: 'mint', // We know mint exists from the ABI
      args: [userAddress, 1], // We know the arguments from the ABI
    })
  }

  return (
    <div className="m-2 border border-fuchsia-200 p-4">
      <div>
        Props: <br />
        Symbol: {String(mintableToken)} | Address:{' '}
        {mintableToken === 'HELP' ? HELP_TOKEN_ADDRESS : PROBLM_TOKEN_ADDRESS}
      </div>
      <div>
        Dynamic: <br />
        {tickerLoading ? (
          <span>Loading...</span>
        ) : tickerError ? (
          <span>Error: {tickerError.message}</span>
        ) : (
          <span>Symbol: {symbol as string}</span>
        )}{' '}
        | Address: {tokenAddress}
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <p>Balance: {balance?.toString()}</p>
      )}
      {isPending ? (
        <p>Minting...</p>
      ) : writeError ? (
        <p>Error: {writeError.message}</p>
      ) : (
        <button
          className="rounded bg-fuchsia-700 px-2 py-0.5 font-bold text-white hover:bg-fuchsia-800"
          onClick={handleMint}
        >
          Mint
        </button>
      )}
      {data && <p>Minted: {data.toString()}</p>}
    </div>
  )
}
