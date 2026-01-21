import { ConnectButton } from '@rainbow-me/rainbowkit'
import { MintableERC20 } from '@/app/components/MintableERC20'

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
        {/* <TokenMinter /> */}
        <MintableERC20 />
      </main>
    </div>
  )
}
