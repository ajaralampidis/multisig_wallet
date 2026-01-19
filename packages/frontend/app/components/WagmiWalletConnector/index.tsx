'use client'
import { WagmiConnection } from './WagmiConnection'
import { WalletOptions } from './WalletOptions'
import { useConnection } from 'wagmi'

export function ConnectWallet() {
  const { isConnected } = useConnection()
  if (isConnected) return <WagmiConnection />
  return <WalletOptions />
}
