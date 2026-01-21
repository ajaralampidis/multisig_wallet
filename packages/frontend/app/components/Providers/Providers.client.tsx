'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { WagmiProvider, type State } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { getConfig } from '@/app/components/Providers/wagmiProviderConfig'

type Props = {
  children: ReactNode
  initialState?: State
}

export function ProvidersClient({ children, initialState }: Props) {
  const [config] = useState(() => getConfig())
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
