'use client'

import LZString from 'lz-string'
import { useEffect, useState } from 'react'
import { decodeAbiParameters, parseAbiParameters } from 'viem'

export default function LZViewer() {
  const [state, setState] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [compressed, setCompressed] = useState<string>('')

  useEffect(() => {
    const hash = window.location.hash
    if (!hash.startsWith('#state=')) {
      setError('No #state= fragment found in URL')
      return
    }

    const encoded = hash.slice('#state='.length)
    setCompressed(encoded)

    try {
      const decompressed = LZString.decompressFromEncodedURIComponent(encoded)
      if (!decompressed) throw new Error('Decompression returned empty string')

      const parsed = JSON.parse(decompressed)
      setState(parsed)
      setError(null)
    } catch (err: any) {
      setError('Failed to decode: ' + (err.message || String(err)))
      setState(null)
    }
  }, [])

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '960px',
        margin: '40px auto',
        padding: '20px',
        lineHeight: 1.5,
      }}
    >
      <h1>LZ Compressed State Viewer</h1>
      <p>Paste or open any #state=... link here to inspect it.</p>

      {error && (
        <div
          style={{
            padding: '16px',
            background: '#ffebee',
            borderRadius: '8px',
            margin: '20px 0',
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {compressed && (
        <div style={{ margin: '24px 0' }}>
          <strong>Compressed fragment (from URL):</strong>
          <div
            style={{
              background: '#f5f5f5',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '0.92em',
              wordBreak: 'break-all',
              marginTop: '8px',
            }}
          >
            {compressed}
          </div>
        </div>
      )}

      {state ? (
        <div>
          <h2 style={{ marginTop: '32px' }}>Decoded State</h2>
          <pre
            style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              overflowX: 'auto',
              fontSize: '0.95em',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {JSON.stringify(state, null, 2)}
          </pre>

          {/* Optional: try to show calldata more readably */}
          {state.tx?.data && state.tx.data.startsWith('0x') && (
            <div style={{ marginTop: '24px' }}>
              <h3>Calldata (raw)</h3>
              <div
                style={{
                  background: '#e8f5e9',
                  padding: '12px',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  fontSize: '0.9em',
                }}
              >
                {state.tx.data}
              </div>
            </div>
          )}

          {state.signatures?.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h3>Signatures ({state.signatures.length})</h3>
              <ul style={{ paddingLeft: '20px' }}>
                {state.signatures.map((sig: string, i: number) => (
                  <li
                    key={i}
                    style={{
                      marginBottom: '8px',
                      wordBreak: 'break-all',
                      fontFamily: 'monospace',
                    }}
                  >
                    {sig}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        !error && (
          <p style={{ color: '#555', marginTop: '40px' }}>
            Waiting for valid #state=...
          </p>
        )
      )}

      <div style={{ marginTop: '48px', fontSize: '0.9em', color: '#666' }}>
        <p>
          Test it: Copy your full link
          <br />
          <code
            style={{
              background: '#f0f0f0',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            https://localhost:3000/test-lz-viewer#state=...
          </code>
          <br />
          (replace the compressed part with your real one)
        </p>
        <p>
          You can also open your original link and change /test-lz-simple →
          /test-lz-viewer in the URL.
        </p>
      </div>
    </div>
  )
}
