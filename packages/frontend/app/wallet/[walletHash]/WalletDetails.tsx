'use client'

import { useRef, useState } from 'react'
import {
  XCircleIcon,
  InformationCircleIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { useReadWalletState } from '@/app/hooks/multiSigWallet/useReadWalletState'
import { useWalletProposalCodec } from '@/app/hooks/multiSigWallet/useWalletProposalCodec'
import {
  wallets$,
  upsertProposal,
} from '@/app/hooks/multiSigWallet/walletProposalsStore'
import { useConnection } from 'wagmi'
import { useValue } from '@legendapp/state/react'

export function WalletDetails({ walletHash }: { walletHash: `0x${string}` }) {
  const { address, isConnected } = useConnection()
  const walletState = useReadWalletState(walletHash)
  const walletProposalCodec = useWalletProposalCodec(walletHash)

  const proposals = useValue(() => {
    const walletObs = wallets$[walletHash] // this is an observable path
    if (!walletObs) return []
    const walletSnapshot = walletObs.get()
    if (!walletSnapshot) return []
    return Object.values(walletSnapshot)
  })

  const handleCreateRandomProposal = async () => {
    if (!isConnected || !address) return
    const proposal =
      await walletProposalCodec.encodeMultiSignatureWalletAddSignerProposal({
        newSigner: address,
        nonce: BigInt(walletState.nonce),
      })

    upsertProposal(walletHash, proposal)
  }

  const [copied, setCopied] = useState(false)

  // --- Stateless refs ---
  const addSignerRef = useRef<HTMLInputElement>(null)
  const thresholdRef = useRef<HTMLInputElement>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(walletHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const handleAddSigner = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = addSignerRef.current?.value
    if (!value) return

    // Basic validation
    if (!value.startsWith('0x') || value.length !== 42) {
      console.error('Invalid address format')
      return
    }

    try {
      const proposal =
        await walletProposalCodec.encodeMultiSignatureWalletAddSignerProposal({
          newSigner: value as `0x${string}`,
          nonce: BigInt(walletState.nonce),
        })
      upsertProposal(walletHash, proposal)
      if (addSignerRef.current) {
        addSignerRef.current.value = ''
      }
    } catch (error) {
      console.error('Failed to create add signer proposal:', error)
    }
  }

  const handleUpdateThreshold = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = thresholdRef.current?.value
    if (!value) return

    // Basic validation
    const thresholdValue = parseInt(value)
    if (isNaN(thresholdValue) || thresholdValue <= 0) {
      console.error('Invalid threshold value')
      return
    }

    try {
      const proposal =
        await walletProposalCodec.encodeMultiSignatureWalletUpdateSignaturesRequiredProposal(
          {
            newSignaturesRequired: BigInt(thresholdValue),
            nonce: BigInt(walletState.nonce),
          }
        )
      upsertProposal(walletHash, proposal)
      if (thresholdRef.current) {
        thresholdRef.current.value = ''
      }
    } catch (error) {
      console.error('Failed to create update threshold proposal:', error)
    }
  }

  const handleRemoveSinger = async (signer: `0x${string}`) => {
    if (!signer) return

    try {
      const proposal =
        await walletProposalCodec.encodeMultiSignatureWalletRemoveSignerProposal(
          {
            signerToRemove: signer,
            nonce: BigInt(walletState.nonce),
          }
        )
      upsertProposal(walletHash, proposal)
    } catch (error) {
      console.error('Failed to create remove signer proposal:', error)
    }
  }

  return (
    <section aria-labelledby="wallet-title">
      <p className="mb-2 w-fit rounded-md bg-violet-300/30 px-2 py-0.5 text-sm text-violet-600">
        Wallet
      </p>

      <h1
        id="wallet-title"
        className="mb-4 w-fit cursor-text font-mono text-2xl font-semibold"
        onClick={handleCopy}
      >
        {walletHash}{' '}
        {copied ? (
          <CheckCircleIcon className="inline size-6 rounded hover:bg-violet-300/40" />
        ) : (
          <ClipboardDocumentIcon className="inline size-6 rounded hover:bg-violet-300/40" />
        )}
      </h1>

      {/* Wallet summary */}
      <section>
        <ul className="mb-4 flex items-center justify-between border-b border-violet-300">
          <li>
            Total Signers:{' '}
            <strong className="font-semibold">
              {walletState.signers.length}
            </strong>
            <br />
            Signatures Required:{' '}
            <strong className="font-semibold">
              {walletState.requiredSigners.toString()}
            </strong>
            <div className="group relative mb-1 ml-1 inline-flex h-5 align-middle">
              <InformationCircleIcon className="size-5" />
              <div className="pointer-events-none absolute top-1/2 left-6 z-50 hidden -translate-y-1/2 rounded-md bg-violet-900 px-2 py-1 text-sm font-light whitespace-nowrap text-violet-50 italic group-hover:block">
                Signatures required to execute a transaction
              </div>
            </div>
          </li>

          <li>
            <form
              onSubmit={handleUpdateThreshold}
              className="flex items-center"
            >
              <input
                ref={thresholdRef}
                type="number"
                name="signaturesRequired"
                placeholder={walletState.requiredSigners.toString()}
                className="mr-2 w-[5ch] grow rounded border border-violet-300 bg-violet-50 pl-1"
              />
              <button
                type="submit"
                className="rounded bg-violet-300/30 px-3 py-0.5 hover:bg-violet-300/70"
              >
                Update Signatures Required
              </button>
            </form>
          </li>
        </ul>
      </section>

      {/* Signers */}
      <section aria-labelledby="signers-title">
        <h2 id="signers-title" className="text-lg font-semibold">
          Signers:
        </h2>

        <ul className="mb-4 border-b border-violet-300 pb-2">
          {walletState.signers.map((signer) => (
            <Signer
              key={signer}
              signer={signer}
              handleRemoveSinger={handleRemoveSinger}
            />
          ))}
        </ul>

        <form onSubmit={handleAddSigner} className="flex w-full">
          <input
            ref={addSignerRef}
            className="mr-2 grow rounded border border-violet-300 bg-violet-50 pl-1 font-mono"
            placeholder="0x…"
          />
          <button
            type="submit"
            className="rounded bg-violet-300/30 px-3 py-0.5 hover:bg-violet-300/70"
          >
            + Add Signer
          </button>
        </form>
      </section>
      <section>
        <div className="my-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Proposals:</h2>
          <button
            className="my-4 rounded bg-violet-200 px-2"
            onClick={handleCreateRandomProposal}
          >
            Create random proposal
          </button>
        </div>

        {proposals.map((proposal) => (
          <div
            key={proposal.id}
            className="rounded border border-violet-200 p-2"
          >
            <p>id: {proposal.id}</p>
            <div>
              Signatures:
              {proposal.signatures.map((s) => (
                <p key={s.signer + s.signature} className="ml-4">
                  Signer: ${s.signer}
                  <br />
                  Signature:{' '}
                  <span className="wrap-break-word break-all">
                    ${s.signature}
                  </span>
                </p>
              ))}
            </div>
            <p>tx.chainId: {String(proposal.tx.chainId)}</p>
            <p>tx.to: {String(proposal.tx.to)}</p>
            <p>tx.value: {String(proposal.tx.value)}</p>
            <p>tx.data: {String(proposal.tx.data)}</p>
            <p>tx.nonce: {String(proposal.tx.nonce)}</p>
            <p>version: {String(proposal.version)}</p>
          </div>
        ))}
      </section>
    </section>
  )
}

function Signer({
  signer,
  handleRemoveSinger,
}: {
  signer: `0x${string}`
  handleRemoveSinger: (signer: `0x${string}`) => void
}) {
  return (
    <li className="my-2 flex w-full justify-between font-mono font-light">
      <span>{signer}</span>
      <button
        onClick={() => handleRemoveSinger(signer)}
        type="button"
        aria-label="Remove signer"
      >
        <XCircleIcon className="size-6 rounded-full hover:bg-red-200/10 hover:text-red-700" />
      </button>
    </li>
  )
}
