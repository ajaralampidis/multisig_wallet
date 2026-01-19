'use client'
import { /* Connector, */ useConnect, useConnectors } from 'wagmi'

export function WalletOptions() {
  const { /* connect → deprecated, use mutate */ mutate } = useConnect()
  const connectors = useConnectors()

  return (
    <>
      <h2 className="text-2xl font-bold">Connect Wallet</h2>
      <ul>
        {connectors.map((connector) => (
          <li
            key={connector.uid}
            className="my-2 rounded-xl bg-fuchsia-300 p-2 decoration-0 hover:bg-fuchsia-400"
          >
            <button
              onClick={() => mutate({ connector })}
              className="font-medium"
            >
              {connector.name}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
