import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import { resolvedContracts } from './app/lib/contracts/contracts'

export default defineConfig({
  out: './app/lib/wagmiHooks/generated.ts',
  contracts: resolvedContracts,
  plugins: [react()],
})
