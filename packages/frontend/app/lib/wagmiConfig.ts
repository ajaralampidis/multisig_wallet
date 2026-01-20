import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { mainnet, sepolia, anvil } from 'wagmi/chains'

export function getConfig() {
  return createConfig({
    chains: [mainnet, sepolia, anvil],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [anvil.id]: http('http://127.0.0.1:8545'),
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
  })
}
