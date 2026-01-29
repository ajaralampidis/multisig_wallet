'use client'
import { wallets$ } from '@/app/hooks/multiSigWallet/walletProposalsStore'
import { Proposal } from '@/app/lib/multisig'
import {
  multiSignatureWalletFactoryAddress,
  multiSignatureWalletFactoryAbi,
  multiSignatureWalletAbi,
  useReadMultiSignatureWalletFactoryGetAllMultiSignatureWallets,
} from '@/app/lib/wagmiHooks/generated'
import { useValue } from '@legendapp/state/react'
import { useParams } from 'next/navigation'
import { useChainId, useConnection } from 'wagmi'
import { getProposalDisplayString } from '@/app/lib/multisig'
import { useReadWalletState } from '@/app/hooks/multiSigWallet/useReadWalletState'
import { Abi } from 'viem'
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

const useGetAbi = () => {
  const chainId = useChainId()
  const allMultiSignatureWallets =
    useReadMultiSignatureWalletFactoryGetAllMultiSignatureWallets({
      chainId: chainId,
    })

  const getAbi = (proposal: Proposal): Abi | null => {
    // TODO: this helper will probably grow in complexity
    if (proposal.tx.to === multiSignatureWalletFactoryAddress[chainId])
      return multiSignatureWalletFactoryAbi

    if (
      allMultiSignatureWallets.data?.includes(proposal.tx.to as `0x${string}`)
    ) {
      return multiSignatureWalletAbi
    }

    return null
  }

  return { getAbi }
}

export function ProposalsList({
  walletHashProps,
}: {
  walletHashProps?: string
}) {
  const { address: connectedAddress, isConnected } = useConnection()
  const urlParams = useParams()
  const walletHash = walletHashProps || (urlParams?.walletHash as unknown) // on some urls walletHash doesn't exist
  const wallets = useValue(() => wallets$.get())
  const proposalsOfwalletHash = wallets[walletHash as `0x${string}`]

  const walletState = useReadWalletState(walletHash as `0x${string}`)
  const isConnectedAddressSignerOfMultisigWallet =
    walletState.signers &&
    walletState.signers.includes(connectedAddress as `0x${string}`)

  const { getAbi } = useGetAbi()

  const canExecute = (proposal: Proposal) => {
    return (
      proposal.signatures.length >= walletState.requiredSigners &&
      isConnectedAddressSignerOfMultisigWallet
    )
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  if (!isConnectedAddressSignerOfMultisigWallet) return <></>
  if (
    !proposalsOfwalletHash ||
    Object.values(proposalsOfwalletHash).length === 0
  ) {
    return <></>
  }
  if (!walletHash) return <></>
  if (!isConnected || !connectedAddress) return <></>
  const proposal = Object.values(proposalsOfwalletHash)[0]
  return (
    <>
      {isModalOpen && (
        <ProposalsListModal
          walletHash={walletHash as `0x${string}`}
          proposalsOfwalletHash={proposalsOfwalletHash}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
      <div className="sticky bottom-0 w-full border-t border-fuchsia-400 bg-violet-200 pt-4 pb-8 text-center">
        {
          <div
            key={proposal.id}
            className="mx-auto flex max-w-3xl items-center justify-center gap-2"
          >
            <div className="inline shrink overflow-hidden font-mono text-ellipsis">
              {getProposalDisplayString(proposal, getAbi(proposal))}
            </div>
            <div className="shrink-0">
              Signatures: {proposal.signatures.length} /{' '}
              {walletState.requiredSigners}
            </div>

            <button
              disabled={!canExecute(proposal)}
              className={`shrink-0 rounded bg-fuchsia-300/50 p-2 text-fuchsia-950 hover:bg-fuchsia-300 ${!canExecute(proposal) && 'opacity-50 grayscale-100'}`}
            >
              {canExecute(proposal) && 'Execute Transaction'}
              {!canExecute(proposal) && 'Cannot Execute Transaction'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="shrink-0 rounded bg-fuchsia-300/50 p-2 text-fuchsia-950 hover:bg-fuchsia-300"
            >
              <DocumentMagnifyingGlassIcon className="h-6 w-6" />
            </button>
          </div>
        }
      </div>
    </>
  )
}

function ProposalsListModal({
  proposalsOfwalletHash,
  isModalOpen,
  setIsModalOpen,
  walletHash,
}: {
  proposalsOfwalletHash: { [x: `0x${string}`]: Proposal }
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  walletHash: `0x${string}`
}) {
  const { address: connectedAddress } = useConnection()
  const { getAbi } = useGetAbi()
  const walletState = useReadWalletState(walletHash as `0x${string}`)

  const isConnectedAddressSignerOfMultisigWallet =
    walletState.signers &&
    walletState.signers.includes(connectedAddress as `0x${string}`)

  const canExecute = (proposal: Proposal) => {
    return (
      proposal.signatures.length >= walletState.requiredSigners &&
      isConnectedAddressSignerOfMultisigWallet
    )
  }

  if (!isModalOpen) return <></>
  return (
    <div
      className="fixed top-0 right-0 bottom-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="max-h-162.5 max-w-2xl overflow-auto rounded-2xl bg-violet-200 p-4 wrap-break-word break-all"
      >
        {Object.values(proposalsOfwalletHash).map((proposal: Proposal) => (
          <div key={proposal.id} className="not-first:mt-12">
            <h3 className="flex justify-between text-lg font-semibold not-first:mt-8">
              Transaction Proposal
              <span className="my-auto text-sm">
                Signatures: {proposal.signatures.length} /{' '}
                {walletState.requiredSigners}
                {canExecute(proposal) && (
                  <span className="my-auto text-xs font-light">
                    {' '}
                    (Can Execute Transaction)
                  </span>
                )}
              </span>
            </h3>
            <p className="text-xs font-light">
              ID: {proposal.id.slice(0, 8) + '...' + proposal.id.slice(-8)}
            </p>
            <p className="mt-2">
              Function and Arguments to execute: <br />
              <span className="block w-full bg-violet-300 p-1 font-mono text-sm wrap-break-word break-all">
                {getProposalDisplayString(proposal, getAbi(proposal))}
              </span>
            </p>
            <hr className="my-2 border-violet-400" />
            <div>
              Signatures:
              {proposal.signatures.map((s) => (
                <ul className="my-2 ml-4" key={s.signer + s.signature}>
                  <li>
                    <span className="font-semibold">Signer:</span> <br />
                    <span className="font-mono font-light">{s.signer}</span>
                  </li>
                  <li>
                    <span className="font-semibold">Signature:</span> <br />
                    <span className="font-mono font-light">{s.signature}</span>
                  </li>
                </ul>
              ))}
            </div>
            <hr className="my-2 border-violet-400" />
            <p>tx.chainId: {String(proposal.tx.chainId)}</p>
            <p>tx.to: {String(proposal.tx.to)}</p>
            <p>tx.value: {String(proposal.tx.value)}</p>
            <p>tx.data: {String(proposal.tx.data)}</p>
            <p>tx.nonce: {String(proposal.tx.nonce)}</p>
            <p>version: {String(proposal.version)}</p>
            <hr className="my-2 border-violet-400" />

            <div className="w-full text-right">
              <button
                disabled={!canExecute(proposal)}
                className={`ml-auto rounded-md bg-fuchsia-300/50 p-2 text-fuchsia-950 hover:bg-fuchsia-300 ${!canExecute(proposal) && 'opacity-50 grayscale-100'}`}
              >
                {canExecute(proposal) && 'Execute Transaction'}
                {!canExecute(proposal) && 'Cannot Execute Transaction'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
