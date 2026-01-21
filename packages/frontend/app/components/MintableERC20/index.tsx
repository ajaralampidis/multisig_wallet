'use client'
import {
  useReadHelpBalanceOf,
  useReadHelpSymbol,
  useReadHelpName,
  useWriteHelpMint,
} from '@/app/lib/wagmiHooks/generated'
import { useConnection, useWaitForTransactionReceipt } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'

export function MintableERC20() {
  const { address: userAddress, isConnected } = useConnection()
  const queryClient = useQueryClient()

  const { data: helpBalance, queryKey: helpBalanceQueryKey } =
    useReadHelpBalanceOf({
      args: [userAddress as `0x${string}`], // Assumes userAddress is a valid Ethereum address string like '0x...'
      query: { enabled: isConnected && !!userAddress },
    })
  const { data: helpSymbol } = useReadHelpSymbol()
  const { data: helpName } = useReadHelpName()
  const { mutateAsync: mintHelp, data: helpMintHash } = useWriteHelpMint()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: helpMintHash,
      query: { enabled: !!helpMintHash },
    })

  const handleMint = async () => {
    if (!userAddress || !isConnected) return
    await mintHelp(
      {
        args: [userAddress, BigInt(1)],
      },
      {
        onSuccess: () => {
          console.log('success')
          queryClient.invalidateQueries(helpBalanceQueryKey)
        },
      }
    )
  }

  return (
    <div>
      <ul>
        <li>Balance: {helpBalance}</li>
        <li>Symbol: {helpSymbol}</li>
        <li>Name: {helpName}</li>
      </ul>

      <button
        className="rounded-md bg-fuchsia-200 px-4 py-2 hover:bg-fuchsia-300"
        onClick={handleMint}
      >
        Mint Broken
      </button>

      <div>
        {isConfirming && <div>Confirming...</div>}
        {isConfirmed && <div>Confirmed!</div>}
        {helpMintHash && <div>Transaction Hash: {helpMintHash}</div>}
        {!helpMintHash && <div>Transaction Hash: N/A</div>}
      </div>
    </div>
  )
}
