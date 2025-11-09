'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface SandboxResult {
  stdout: string
  stderr: string
  exitCode: number
}

interface InteractiveSandboxProps {
  code: string
  language?: string
  title?: string
}

/**
 * InteractiveSandbox - Executes code in YOUR local Cloudflare Sandbox
 *
 * This component requires you to have a local sandbox running on port 8787.
 * Follow the article instructions to set up your local sandbox.
 */
export function InteractiveSandbox({ code, language = 'python', title = 'Python' }: InteractiveSandboxProps) {
  const [output, setOutput] = useState<SandboxResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sandboxUrl, setSandboxUrl] = useState<string>('http://localhost:8787')

  async function runCode() {
    setLoading(true)
    setError(null)
    setOutput(null)

    try {
      const baseUrl = sandboxUrl.trim()

      if (!baseUrl) {
        throw new Error('Please enter your local sandbox URL (default: http://localhost:8787)')
      }

      // Append /run endpoint if not already present
      const cleanUrl = baseUrl.replace(/\/$/, '')
      const workerUrl = cleanUrl.endsWith('/run') ? cleanUrl : `${cleanUrl}/run`

      const response = await fetch(workerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code
        })
      })

      if (!response.ok) {
        throw new Error(`Sandbox execution failed: ${response.statusText}`)
      }

      const result = await response.json()
      setOutput(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="interactive-sandbox">
      {/* Local sandbox URL input */}
      <div className="sandbox-url-switcher">
        <details open>
          <summary>Local Sandbox URL (must be running)</summary>
          <div className="url-input-group">
            <input
              type="text"
              placeholder="http://localhost:8787"
              value={sandboxUrl}
              onChange={(e) => setSandboxUrl(e.target.value)}
            />
            <span style={{ fontSize: '0.85rem', color: '#666' }}>
              Make sure your local sandbox is running (npm run dev)
            </span>
          </div>
        </details>
      </div>

      <div className="sandbox-header">
        <span className="sandbox-title">
          {title}
          <span className="sandbox-badge" title="Running on your local sandbox">
            🖥️ Local
          </span>
        </span>
        <button
          onClick={runCode}
          disabled={loading}
          className="sandbox-run-button"
        >
          {loading ? '⏳ Running...' : '▶ Run in Sandbox'}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '4px',
          fontSize: '0.9rem',
        }}
        showLineNumbers={false}
      >
        {code}
      </SyntaxHighlighter>

      {output && (
        <div className="sandbox-output">
          <div className="output-header">Output:</div>
          {output.stdout && (
            <div className="output-section">
              <strong>stdout:</strong>
              <pre>{output.stdout}</pre>
            </div>
          )}
          {output.stderr && (
            <div className="output-section error">
              <strong>stderr:</strong>
              <pre>{output.stderr}</pre>
            </div>
          )}
          <div className="output-section">
            <strong>Exit Code:</strong> {output.exitCode === 0 ? '✓ 0 (Success)' : `✗ ${output.exitCode} (Error)`}
          </div>
          <div className="sandbox-info">
            ✓ Code executed in your local sandbox environment
          </div>
        </div>
      )}

      {error && (
        <div className="sandbox-error">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  )
}
