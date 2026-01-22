'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { WagmiProvider, type State } from 'wagmi'
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import { getConfig } from '@/app/components/Providers/wagmiProviderConfig'

type Props = {
  children: ReactNode
  initialState?: State
}

const rainbowKitTheme = lightTheme({
  borderRadius: 'large',
  accentColor: '#7b3fe4',
})
rainbowKitTheme.shadows.connectButton = 'none'
rainbowKitTheme.colors.modalBackground = 'lab(93.0838% 4.35197 -9.88284)'
rainbowKitTheme.colors.modalTextSecondary = '#65459c'
rainbowKitTheme.colors.modalText = '#3b00a0'
rainbowKitTheme.colors.connectButtonBackground = '#7b3fe4'
rainbowKitTheme.colors.connectButtonText = '#ece2ff'

export function ProvidersClient({ children, initialState }: Props) {
  const [config] = useState(() => getConfig())
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowKitTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
