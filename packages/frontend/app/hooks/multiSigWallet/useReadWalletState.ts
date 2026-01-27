import {
  useReadMultiSignatureWalletGetSigners,
  useReadMultiSignatureWalletSignaturesRequired,
  useReadMultiSignatureWalletNonce,
} from '@/app/lib/wagmiHooks/generated'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

/**
 * This hook fetches the state of a specific MultiSignatureWallet contract.
 * Its READ ONLY and it allows to invalidate the cache when needed
 * @param walletHash is the specific MultiSignatureWallet contract address
 */

export function useReadWalletState(walletHash: `0x${string}`) {
  const queryClient = useQueryClient()

  const signersQuery = useReadMultiSignatureWalletGetSigners({
    address: walletHash,
  })

  const thresholdQuery = useReadMultiSignatureWalletSignaturesRequired({
    address: walletHash,
  })

  const nonceQuery = useReadMultiSignatureWalletNonce({
    address: walletHash,
  })

  const invalidateWalletState = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: thresholdQuery.queryKey })
    queryClient.invalidateQueries({ queryKey: signersQuery.queryKey })
    queryClient.invalidateQueries({ queryKey: nonceQuery.queryKey })
  }, [
    queryClient,
    signersQuery.queryKey,
    thresholdQuery.queryKey,
    nonceQuery.queryKey,
  ])

  return {
    signers: signersQuery.data ?? [],
    requiredSigners: thresholdQuery.data ?? BigInt(-1),
    loading: signersQuery.isLoading || thresholdQuery.isLoading,
    error: signersQuery.error ?? thresholdQuery.error,
    invalidateWalletState,
    nonce: nonceQuery.data ?? 0,
  }
}
