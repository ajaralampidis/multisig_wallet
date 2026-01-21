import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'
import { ProvidersClient } from './Providers.client'
import { getConfig } from '@/app/components/Providers/wagmiProviderConfig'

export async function Providers({ children }: { children: React.ReactNode }) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get('cookie')
  )

  return (
    <ProvidersClient initialState={initialState}>{children}</ProvidersClient>
  )
}
