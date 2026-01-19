import MultiSignatureWallet from '@contracts/out/MultiSignatureWallet.sol/MultiSignatureWallet.json'
import { ConnectWallet } from './components/WagmiWalletConnector'

/**
 *
 * ================
 * 1. Use reown + wagmi + viem
 * 2. Allow wallet connection
 * 3. Allow to check ERC20 balances → we will need the deployments/anvil.json
 * ================
 *
 */

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between px-16 py-32 sm:items-start">
        <ConnectWallet />
        <div> {JSON.stringify(MultiSignatureWallet.abi)} </div>
      </main>
    </div>
  )
}
