'use client'
import { useChainId } from 'wagmi'
import {
  useReadMultiSignatureWalletFactoryGetAllMultiSignatureWallets,
  useWriteMultiSignatureWalletFactoryCreateChild,
  multiSignatureWalletFactoryAddress,
} from '@/app/lib/wagmiHooks/generated'

type FactoryChainId = keyof typeof multiSignatureWalletFactoryAddress

function isFactoryChainId(chainId: number): chainId is FactoryChainId {
  return chainId in multiSignatureWalletFactoryAddress
}

export default function Wallets() {
  const chainId = useChainId()

  const {
    data: multiSignatureWallets,
    isLoading,
    isError,
    error,
    refetch: refetchWallets,
  } = useReadMultiSignatureWalletFactoryGetAllMultiSignatureWallets()

  // write hook
  const {
    mutateAsync: createMultiSignatureWallet,
    data: createMultiSignatureWalletHash,
    isPending: isCreating,
    isSuccess,
    error: createError,
  } = useWriteMultiSignatureWalletFactoryCreateChild()

  const isReady = !isLoading && !isError

  const handleCreateWallet = async () => {
    if (!chainId) return
    if (!isFactoryChainId(chainId)) return
    await createMultiSignatureWallet({ chainId })
    await refetchWallets()
  }

  return (
    <div className="rounded border border-fuchsia-600 bg-violet-200 p-2 text-fuchsia-900 shadow-lg shadow-violet-900/5">
      <h1 className="text-2xl font-bold">Wallets</h1>

      {/* create button */}
      <button
        onClick={() => handleCreateWallet()}
        disabled={isCreating}
        className="mb-2 rounded bg-fuchsia-600 px-3 py-1 text-white disabled:opacity-50"
      >
        {isCreating ? 'Creating…' : 'Create Multisig'}
      </button>

      {createError && <p>{createError.message}</p>}
      {isSuccess && <p>Multisig created</p>}
      {createMultiSignatureWalletHash && (
        <>
          <p>Hash: {createMultiSignatureWalletHash}</p>
          <hr className="my-2" />
        </>
      )}

      <Error isError={isError} error={error} />
      <Loading isLoading={isLoading} />
      <WalletsMapping
        isReady={isReady}
        multiSignatureWallets={multiSignatureWallets}
      />
    </div>
  )
}

const Error = ({ isError, error }: { isError: boolean; error: any }) => {
  if (isError)
    return (
      <>
        <p> Error loading wallets </p>
        <p> {error && error.message} </p>
      </>
    )
  return <></>
}

const Loading = ({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) return <p> Loading... </p>
  return <></>
}

const WalletsMapping = ({
  isReady,
  multiSignatureWallets,
}: {
  isReady: boolean
  multiSignatureWallets: readonly `0x${string}`[] | undefined
}) => {
  console.log(multiSignatureWallets)
  if (!isReady || !multiSignatureWallets) return <></>
  if (multiSignatureWallets.length <= 0) return <p> No wallets found </p>
  return (
    <>
      {multiSignatureWallets.map((wallet, index) => (
        <p key={index}> {wallet} </p>
      ))}
    </>
  )
}
