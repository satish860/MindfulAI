'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramProps {
  chart: string
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'base',
        themeVariables: {
          fontSize: '14px',
        },
      })

      const renderDiagram = async () => {
        try {
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
          const { svg } = await mermaid.render(id, chart)
          if (containerRef.current) {
            containerRef.current.innerHTML = svg
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error)
          if (containerRef.current) {
            containerRef.current.innerHTML = `<pre>${chart}</pre>`
          }
        }
      }

      renderDiagram()
    }
  }, [chart])

  return <div ref={containerRef} className="mermaid" />
}
