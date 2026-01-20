import { ConnectButton } from '@rainbow-me/rainbowkit'
import { MintableERC20 } from './components/MintableERC20'
/**
 *
 * ================
 * 3. Allow to check ERC20 balances → we will need the deployments/anvil.json
 * ================
 *
 */

export default function Home() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl">
      <main className="m-4 flex flex-col gap-2">
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus="address"
        />
        <MintableERC20 mintableToken="HELP" />
        <MintableERC20 mintableToken="PROBLM" />
      </main>
    </div>
  )
}
