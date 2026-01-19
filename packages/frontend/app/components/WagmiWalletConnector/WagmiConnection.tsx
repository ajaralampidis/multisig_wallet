'use client'
import { useConnection, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export function WagmiConnection() {
  const { address } = useConnection()
  const { mutate } = useDisconnect() // disconnect → deprecated, use mutate
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  return (
    <div className="flex items-center">
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && (
        <div className="font-mono text-base font-medium">
          {ensName ? `${ensName} (${address})` : address}
        </div>
      )}
      <button
        className="rounded bg-fuchsia-700 px-4 py-2 font-bold text-white hover:bg-fuchsia-800"
        onClick={() => mutate()}
      >
        Disconnect
      </button>
    </div>
  )
}
