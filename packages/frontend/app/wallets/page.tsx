// app/components/WalletsCard.tsx
'use client'
import React, { useCallback, useMemo } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import {
  ErrorBoundary,
  FallbackProps,
  useErrorBoundary,
} from 'react-error-boundary'
import { useChainId, usePublicClient } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import type { ReadContractErrorType, WriteContractErrorType } from 'viem'
import {
  useReadMultiSignatureWalletFactoryGetAllMultiSignatureWallets,
  useWriteMultiSignatureWalletFactoryCreateChild,
  multiSignatureWalletFactoryAddress,
} from '@/app/lib/wagmiHooks/generated'
import Link from 'next/link'

type FactoryChainId = keyof typeof multiSignatureWalletFactoryAddress

function isFactoryChainId(
  chainId: number | undefined
): chainId is FactoryChainId {
  return (
    typeof chainId === 'number' && chainId in multiSignatureWalletFactoryAddress
  )
}

// Hook
function useMultiSigFactory() {
  const chainId = useChainId()
  if (!isFactoryChainId(chainId)) throw new Error('invalid chainId')

  const publicClient = usePublicClient()
  const queryClient = useQueryClient()

  const {
    data: wallets,
    isLoading,
    error: readError,
  } = useReadMultiSignatureWalletFactoryGetAllMultiSignatureWallets({ chainId })

  const {
    mutateAsync: create,
    isPending: isCreating,
    error: writeError,
  } = useWriteMultiSignatureWalletFactoryCreateChild({
    mutation: {
      onSuccess: async (hash) => {
        if (!hash || !publicClient) return
        const receipt = await publicClient.waitForTransactionReceipt({ hash })
        if (receipt?.status === 'success') {
          // invalidate only the readContract query that targets getAllMultiSignatureWallets
          const factoryAddress = multiSignatureWalletFactoryAddress[
            chainId
          ] as string
          queryClient.invalidateQueries({
            predicate: (query) => {
              const qk = query.queryKey
              if (!Array.isArray(qk) || qk.length < 2) return false
              const meta = qk[1]
              return (
                qk[0] === 'readContract' &&
                meta?.functionName === 'getAllMultiSignatureWallets' &&
                (meta?.address === factoryAddress ||
                  String(meta?.address) === factoryAddress)
              )
            },
          })
        }
      },
    },
  })

  const error = (readError ?? writeError) as
    | ReadContractErrorType
    | WriteContractErrorType
    | null

  const createWallet = useCallback(async () => {
    // generated write expects chainId typed
    return await create({ chainId })
  }, [chainId, create])

  return {
    wallets: wallets ?? undefined,
    isLoading,
    isCreating,
    error,
    createWallet,
  }
}

// Error fallback UI
const ErrorFallback: React.ComponentType<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const _error: Error | null = error as Error | null
  return (
    <div role="alert" className="rounded border bg-red-50 p-4 text-red-800">
      <p className="font-semibold">Something went wrong</p>
      <pre className="wrap-break-words mt-2 text-sm">
        {_error && _error?.message}
      </pre>
      <div className="mt-3">
        <button
          onClick={resetErrorBoundary}
          className="rounded bg-white px-3 py-1 text-sm"
        >
          Retry
        </button>
      </div>
    </div>
  )
}

//   The UI component (no chain guards)
function WalletsCardRaw() {
  const { showBoundary } = useErrorBoundary()

  const { wallets, isLoading, isCreating, error, createWallet } =
    useMultiSigFactory()

  // Surface any sync errors from previous writes to the boundary:
  if (error) throw error as unknown as Error

  const onCreate = () => createWallet().catch(showBoundary)

  const content = useMemo(() => {
    if (isLoading) return <p>Loading…</p>
    if (!wallets || wallets.length === 0) return <p>No wallets found</p>
    return wallets.map((wallet) => (
      <Link
        href={`/wallet/${wallet}`}
        key={wallet}
        className="flex w-full justify-between p-2 hover:bg-violet-300/30"
      >
        <span className="font-mono break-all">{wallet}</span>{' '}
        <span>See details</span>
      </Link>
    ))
  }, [isLoading, wallets])

  return (
    <div className="rounded border border-fuchsia-600 bg-violet-200 text-violet-900">
      <div className="my-2 flex items-center justify-between p-2">
        <h1 className="text-2xl font-semibold">All Multisignature Wallets</h1>
        <button
          onClick={onCreate}
          disabled={isCreating}
          className="rounded-lg bg-fuchsia-700 px-3 py-1 text-white disabled:opacity-50"
        >
          {isCreating ? 'Creating…' : 'New Multisig Wallet +'}
        </button>
      </div>

      <div className="border-t border-violet-300">{content}</div>
    </div>
  )
}

//   Exported wrapper with ErrorBoundary
export default function WalletsCard() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <WalletsCardRaw />
    </ErrorBoundary>
  )
}
