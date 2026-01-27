'use client'

import { observable, observe } from '@legendapp/state'
import type { Proposal, Signature, Address, Hex } from '@/app/lib/multisig'
import {
  readProposalFromUrl,
  writeProposalToUrl,
} from '@/app/hooks/multiSigWallet/proposalUrlState'
import { pageHash, configurePageHash } from '@legendapp/state/helpers/pageHash'

/**
 * @module walletProposalsStore
 * @description
 * The central store for proposals.
 * User can have multiple wallets, and each wallet can have multiple proposals.
 * This store should not care about persistence module. It delegates that responsibility to the persistence module.
 */

/**
 * wallets$ shape:
 * {
 *   "<walletAddress>": {
 *      "<proposalId>": Proposal,
 *      ...
 *   },
 *   ...
 * }
 */
export const wallets$ = observable<Record<Address, Record<Hex, Proposal>>>({})

const defaultPersistence = 'url'

function hasSigner(proposal: Proposal, signer: Address): boolean {
  return proposal.signatures.some(
    (s) => s.signer.toLowerCase() === signer.toLowerCase()
  )
}

function executionTxEquals(a: Proposal['tx'], b: Proposal['tx']): boolean {
  return (
    a.chainId === b.chainId &&
    a.to.toLowerCase() === b.to.toLowerCase() &&
    a.value === b.value &&
    a.data === b.data &&
    a.nonce === b.nonce
  )
}

/* --------------------------
   Mutations (immutable)
   -------------------------- */

/**
 * Insert or merge a proposal.
 * If persistence === 'url' the function will write to URL after updating store.
 */
export function upsertProposal(
  walletHash: Address,
  proposal: Proposal,
  persistence: 'url' | null = defaultPersistence === 'url' ? 'url' : null
): void {
  const current = wallets$.peek() // snapshot
  const wallet = current[walletHash] ?? {}

  const existing = wallet[proposal.id]

  if (!existing) {
    const nextWallet = { ...wallet, [proposal.id]: proposal }
    const next = { ...current, [walletHash]: nextWallet }
    wallets$.set(next)

    if (persistence === 'url') writeProposalToUrl(proposal)
    return
  }

  if (!executionTxEquals(existing.tx, proposal.tx)) {
    return
  }

  // Merge signatures (only new ones)
  const existingSigners = new Set(
    existing.signatures.map((s) => s.signer.toLowerCase())
  )
  const newSignatures = proposal.signatures.filter(
    (s) => !existingSigners.has(s.signer.toLowerCase())
  )

  if (newSignatures.length === 0) return

  const merged: Proposal = {
    ...existing,
    signatures: [...existing.signatures, ...newSignatures],
  }

  const nextWallet = { ...wallet, [proposal.id]: merged }
  const next = { ...current, [walletHash]: nextWallet }
  wallets$.set(next)

  if (persistence === 'url') writeProposalToUrl(merged)
}

/**
 * Add a signature to an existing proposal immutably.
 */
export function mergeSignature(
  walletHash: Address,
  proposalId: Hex,
  signature: Signature,
  persistence: 'url' | null = null
): void {
  const current = wallets$.peek()
  const wallet = current[walletHash]
  if (!wallet) return
  const existing = wallet[proposalId]
  if (!existing) return
  if (hasSigner(existing, signature.signer)) return

  const updated: Proposal = {
    ...existing,
    signatures: [...existing.signatures, signature],
  }

  const nextWallet = { ...wallet, [proposalId]: updated }
  const next = { ...current, [walletHash]: nextWallet }
  wallets$.set(next)

  if (persistence === 'url') writeProposalToUrl(updated)
}

/**
 * Remove a proposal (immutable)
 */
export function removeProposal(walletHash: Address, proposalId: Hex): void {
  const current = wallets$.peek()
  const wallet = current[walletHash]
  if (!wallet || !wallet[proposalId]) return

  const nextWallet = { ...wallet }
  delete nextWallet[proposalId]

  const next = { ...current, [walletHash]: nextWallet }
  wallets$.set(next)
}

/**
 * Clear all proposals for a wallet
 */
export function clearWallet(walletHash: Address): void {
  const current = wallets$.peek()
  if (!current[walletHash]) return

  const next = { ...current }
  delete next[walletHash]
  wallets$.set(next)
}

/* --------------------------
   URL -> Store sync
   -------------------------- */

let initialized = false

configurePageHash({ setter: 'pushState' })
observe(() => {
  // TODO: Remove this. This makes a hydration error on local development
  if (!initialized) {
    new Promise((resolve) => {
      setTimeout(() => {
        initialized = true
        const pageHashValue = pageHash.get()
        const proposal = readProposalFromUrl(pageHashValue)
        if (!proposal) return resolve(null)
        upsertProposal(proposal.tx.to as Address, proposal)
        resolve(null)
      }, 100)
    })
    return
  }
  // if (!window || typeof window == 'undefined') return
  const pageHashValue = pageHash.get()
  const proposal = readProposalFromUrl(pageHashValue)
  if (!proposal) return
  upsertProposal(proposal.tx.to as Address, proposal)
})
