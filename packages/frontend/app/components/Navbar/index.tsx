import { ConnectButton } from '@rainbow-me/rainbowkit'
import {
  HomeIcon,
  WalletIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="border-b border-fuchsia-600 bg-violet-200">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between py-1">
        <h1 className="text-2xl font-medium text-fuchsia-800">
          👛 Simple Multi Signature App
        </h1>
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus="address"
        />
      </div>
      <div className="w-full border-t border-fuchsia-400">
        <div className="mx-auto flex w-full max-w-3xl gap-4 text-lg text-fuchsia-700">
          <Link
            className="flex items-center pr-1.5 align-bottom hover:bg-violet-300/50 hover:text-fuchsia-950"
            href="/"
          >
            <HomeIcon className="mr-1 size-6 pt-0.5 pb-1" />
            <span className="my-auto h-min leading-0">Home</span>
          </Link>
          <Link
            className="flex items-center pr-1.5 align-bottom hover:bg-violet-300/50 hover:text-fuchsia-950"
            href="/wallets"
          >
            <WalletIcon className="mr-1 size-6 pt-0.5 pb-1" />
            <span className="my-auto h-min leading-0">Wallets</span>
          </Link>
          <Link
            className="flex items-center pr-1.5 align-bottom hover:bg-violet-300/50 hover:text-fuchsia-950"
            href="/pool"
          >
            <CurrencyDollarIcon className="mr-1 size-6 pt-0.5 pb-1" />
            <span className="my-auto h-min leading-0">Liquidity Pool</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
