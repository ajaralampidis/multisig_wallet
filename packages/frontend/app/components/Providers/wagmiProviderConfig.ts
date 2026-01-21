import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { sepolia, anvil } from 'wagmi/chains'

const devChains = [anvil] as const
const prodChains = [sepolia] as const

export function getConfig() {
  return createConfig({
    chains: process.env.NODE_ENV === 'development' ? devChains : prodChains,
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [anvil.id]: http('http://127.0.0.1:8545'),
      [sepolia.id]: http(),
    },
  })
}
