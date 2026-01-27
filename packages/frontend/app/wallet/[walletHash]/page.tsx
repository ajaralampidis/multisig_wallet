import Link from 'next/link'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { isAddress } from 'viem' // Import from viem, not wagmi directly
import { WalletDetails } from './WalletDetails'

export default async function Wallet({
  params,
}: PageProps<'/wallet/[walletHash]'>) {
  const { walletHash } = await params

  console.log('walletHash', walletHash, isAddress(walletHash))
  if (!isAddress(walletHash)) return <InvalidWallet />
  return <WalletDetails walletHash={walletHash} />
}

// We could generate the pages ahead of time
// export async function generateStaticParams() {
//   return [{ slug: '1' }, { slug: '2' }, { slug: '3' }]
// }

function InvalidWallet() {
  return (
    <div className="p-4 text-center">
      <Link
        className="flex size-8 items-center justify-center rounded-full border border-violet-300 hover:bg-violet-300/30"
        href="/wallets"
      >
        <ChevronLeftIcon className="size-6 pr-0.5" />
      </Link>
      <p className="mb-2 text-center text-lg font-semibold">
        Invalid wallet hash.
      </p>

      <Link
        className="mx-auto rounded-lg bg-violet-300/30 px-2 py-1 hover:bg-violet-300"
        href="/wallets"
      >
        Back to wallet list
      </Link>
    </div>
  )
}
