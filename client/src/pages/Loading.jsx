import React from 'react'
import { useUI } from '../hooks/useUI'

export default function Loading() {
  const { theme } = useUI() // 'light' or 'dark'
  const isDark = theme === 'dark'

  // Object Style CSS Definitions
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: isDark ? '#121212' : '#f8f9fa',
      transition: 'background-color 0.3s ease',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: `5px solid ${isDark ? '#333333' : '#e0e0e0'}`,
      borderTop: `5px solid ${isDark ? '#38bdf8' : '#0284c7'}`, // Blue accent
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    text: {
      marginTop: '16px',
      fontSize: '1.1rem',
      fontWeight: '500',
      color: isDark ? '#e2e8f0' : '#334155',
      letterSpacing: '0.05em',
    },
  }

  return (
    <div style={styles.container}>
      {/* Injecting keyframes for the spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={styles.spinner} />
      <span style={styles.text}>Loading...</span>
    </div>
  )
}
