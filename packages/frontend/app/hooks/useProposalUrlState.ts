'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string'
import type { Proposal } from '@/app/lib/multisig/proposal'

const FRAGMENT_KEY = 'state'

/// Pure URL codec helpers

function stableStringify(proposal: Proposal): string {
  return JSON.stringify({
    version: proposal.version,
    tx: {
      chainId: proposal.tx.chainId,
      to: proposal.tx.to,
      value: proposal.tx.value.toString(),
      data: proposal.tx.data,
      nonce: proposal.tx.nonce.toString(),
    },
    signatures: proposal.signatures,
  })
}

export function encodeProposalToUrlFragment(proposal: Proposal): string {
  const json = stableStringify(proposal)
  return compressToEncodedURIComponent(json)
}

export function decodeProposalFromUrlFragment(encoded: string): Proposal {
  const json = decompressFromEncodedURIComponent(encoded)
  if (!json) {
    throw new Error('Invalid proposal encoding')
  }

  const parsed = JSON.parse(json)

  return {
    version: parsed.version,
    id: parsed.id,
    tx: {
      chainId: parsed.tx.chainId,
      to: parsed.tx.to,
      value: BigInt(parsed.tx.value),
      data: parsed.tx.data,
      nonce: BigInt(parsed.tx.nonce),
    },
    signatures: parsed.signatures,
  }
}

function readProposalFromHash(): Proposal | null {
  if (typeof window === 'undefined') return null

  const hash = window.location.hash
  if (!hash.startsWith(`#${FRAGMENT_KEY}=`)) return null

  try {
    const encoded = hash.slice(FRAGMENT_KEY.length + 2)
    return decodeProposalFromUrlFragment(encoded)
  } catch {
    return null
  }
}

function replaceHashFragment(encoded: string | null) {
  // Use replaceState to avoid adding a history entry.
  const newHash = encoded ? `#${FRAGMENT_KEY}=${encoded}` : ''
  const { pathname, search } = window.location
  // Keep pathname + querystring; replace full URL to ensure consistent state
  const newUrl = pathname + search + newHash
  window.history.replaceState(null, '', newUrl)
}

/// React hook

export function useProposalUrlState() {
  // Initialize synchronously from location.hash (avoids effect-setState cascade)
  const [proposal, setProposalState] = useState<Proposal | null>(() =>
    readProposalFromHash()
  )

  // Keep hook in sync with manual hash changes / back-forward navigation
  useEffect(() => {
    const onHashChange = () => {
      setProposalState(readProposalFromHash())
    }
    window.addEventListener('hashchange', onHashChange, false)
    return () => window.removeEventListener('hashchange', onHashChange, false)
  }, [])

  // useCallback becuase functions that are the public API of the hook might end up as the dependency of other hooks
  const setProposal = useCallback((next: Proposal) => {
    const encoded = encodeProposalToUrlFragment(next)
    replaceHashFragment(encoded)
    setProposalState(next)
  }, [])

  const clearProposal = useCallback(() => {
    replaceHashFragment(null)
    setProposalState(null)
  }, [])

  return { proposal, setProposal, clearProposal }
}
