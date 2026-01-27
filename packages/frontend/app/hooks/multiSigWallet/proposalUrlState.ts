'use client'

import type { Proposal } from '@/app/lib/multisig/proposal'
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string'

const FRAGMENT_KEY = 'state'

/// Encoding / decoding (pure)

function stableStringify(proposal: Proposal): string {
  return JSON.stringify({
    version: proposal.version,
    id: proposal.id,
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

export function encodeProposal(proposal: Proposal): string {
  return compressToEncodedURIComponent(stableStringify(proposal))
}

export function decodeProposal(encoded: string): Proposal {
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

/// Low-level URL access (pure)

export function readProposalFromUrl(urlHash?: string): Proposal | null {
  if (typeof window === 'undefined') return null

  const hash = window.location.hash || urlHash
  if (!hash || !hash.startsWith(`#${FRAGMENT_KEY}=`)) return null

  try {
    const encoded = hash.slice(FRAGMENT_KEY.length + 2)
    return decodeProposal(encoded)
  } catch {
    return null
  }
}

export function writeProposalToUrl(proposal: Proposal | null): void {
  if (typeof window === 'undefined') return

  const { pathname, search } = window.location
  const newHash = proposal ? `#${FRAGMENT_KEY}=${encodeProposal(proposal)}` : ''

  const newUrl = pathname + search + newHash
  window.history.replaceState(null, '', newUrl)
}
