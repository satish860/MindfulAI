import React from 'react'

interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <div className={`logo-container ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Enso circle (Zen circle) - incomplete circle symbolizing imperfection and enlightenment */}
        <path
          d="M 85 50 A 35 35 0 1 1 50 15"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />

        {/* AI neural node connections - minimalist dots */}
        <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.9" />
        <circle cx="35" cy="40" r="2" fill="currentColor" opacity="0.6" />
        <circle cx="65" cy="40" r="2" fill="currentColor" opacity="0.6" />
        <circle cx="42" cy="60" r="2" fill="currentColor" opacity="0.6" />
        <circle cx="58" cy="60" r="2" fill="currentColor" opacity="0.6" />

        {/* Subtle connection lines */}
        <line x1="50" y1="50" x2="35" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <line x1="50" y1="50" x2="65" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <line x1="50" y1="50" x2="42" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <line x1="50" y1="50" x2="58" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>
    </div>
  )
}

export function LogoWithText({ size = 40, showText = true }: LogoProps & { showText?: boolean }) {
  return (
    <div className="logo-with-text">
      <Logo size={size} />
      {showText && (
        <span className="logo-text">The Mindful AI</span>
      )}
    </div>
  )
}
