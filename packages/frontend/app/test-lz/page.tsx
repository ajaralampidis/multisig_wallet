'use client'

import LZString from 'lz-string'
import { encodeFunctionData, parseEther } from 'viem'
import {
  uniV2PoolAbi,
  uniV2PoolAddress,
  helpAddress,
} from '@/app/lib/wagmiHooks/generated'
import { useAccount, useSignTypedData } from 'wagmi'
import { useEffect, useState } from 'react'

export default function SimpleLZTest() {
  const { address } = useAccount()
  const {
    signTypedData,
    data: newSignature,
    isLoading,
    error,
  } = useSignTypedData()

  const [signatures, setSignatures] = useState<string[]>([])

  // Append new signature when wallet returns one
  useEffect(() => {
    if (newSignature) {
      setSignatures((prev) => [...prev, newSignature])
    }
  }, [newSignature])

  // Example swap calldata
  const calldata = encodeFunctionData({
    abi: uniV2PoolAbi,
    functionName: 'swap',
    args: [helpAddress[31337], parseEther('1.5')],
  })

  // tx structure — signatures added dynamically
  const txState = {
    version: '1',
    to: uniV2PoolAddress[31337],
    value: '0',
    data: calldata,
    nonce: '7',
    signatures, // ← grows as you sign
  }

  const json = JSON.stringify(txState)
  const compressed = LZString.compressToEncodedURIComponent(json)

  const originalSize = new Blob([json]).size
  const compressedSize = compressed.length

  const shareableUrl = `http://localhost:3000/test-lz-viewer#state=${compressed}`

  const decompressedJson =
    LZString.decompressFromEncodedURIComponent(compressed)
  const roundtripOk = decompressedJson === json

  // EIP-712
  const domain = {
    name: 'Test Multisig',
    version: '1',
    chainId: 31337,
    verifyingContract:
      '0x0000000000000000000000000000000000000000' as `0x${string}`,
  }

  const types = {
    Transaction: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'string' },
      { name: 'data', type: 'string' },
      { name: 'nonce', type: 'string' },
    ],
  }

  const message = {
    to: txState.to,
    value: txState.value,
    data: txState.data,
    nonce: txState.nonce,
  }

  const handleSign = () => {
    signTypedData({ domain, types, primaryType: 'Transaction', message })
  }

  const sigCount = signatures.length
  const estSize3 = compressedSize + (3 - sigCount) * 140 // rough per-sig overhead after compression

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '900px',
        margin: '40px auto',
        padding: '20px',
      }}
    >
      <h1>Minimal LZ + Signature Test</h1>

      {address && (
        <div style={{ margin: '20px 0' }}>
          <button
            onClick={handleSign}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              background: isLoading ? '#ccc' : '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Signing...' : `Sign (${sigCount}/3)`}
          </button>

          {error && (
            <p style={{ color: 'red', marginTop: '12px' }}>
              Error: {error.message}
            </p>
          )}

          {sigCount > 0 && (
            <div style={{ marginTop: '20px' }}>
              <strong>Collected signatures ({sigCount}):</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                {signatures.map((sig, i) => (
                  <li
                    key={i}
                    style={{ wordBreak: 'break-all', fontSize: '0.9em' }}
                  >
                    {sig.slice(0, 20)}…{sig.slice(-6)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div
        style={{
          margin: '30px 0',
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '8px',
        }}
      >
        <h3>Current State</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>
                Signatures:
              </td>
              <td style={{ padding: '8px' }}>{sigCount}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>
                Original JSON:
              </td>
              <td style={{ padding: '8px' }}>{originalSize} bytes</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>
                Compressed:
              </td>
              <td style={{ padding: '8px' }}>{compressedSize} chars</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Ratio:</td>
              <td style={{ padding: '8px' }}>
                {((compressedSize / originalSize) * 100).toFixed(1)}%
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>
                Est. at 3 sigs:
              </td>
              <td style={{ padding: '8px' }}>~{estSize3} chars</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>
                Round-trip:
              </td>
              <td
                style={{ padding: '8px', color: roundtripOk ? 'green' : 'red' }}
              >
                {roundtripOk ? 'OK' : 'Failed'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px' }}>
        <strong>Shareable fragment:</strong>
        <br />
        <div
          className="overflow-scroll"
          style={{ fontSize: '0.9em', wordBreak: 'break-all' }}
        >
          {compressed}
        </div>
        <br />
        <strong>URL:</strong>
        <br />
        {shareableUrl}
        <br />
        <br />
        <a
          href={shareableUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-blue-700 hover:text-blue-900"
        >
          Open in new tab [↗]
        </a>
      </div>

      <div style={{ marginTop: '40px', fontSize: '0.95em', color: '#555' }}>
        <p>
          Sign multiple times to simulate 2–3 signers. Compressed state updates
          live.
        </p>
      </div>
    </div>
  )
}
