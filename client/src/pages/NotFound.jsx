import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUI } from '../hooks/useUI'

const NotFound = ({ msg, showFor, to = '/' }) => {
  const navigate = useNavigate()
  const { theme } = useUI() // 'light' or 'dark'

  useEffect(() => {
    const timeout = setTimeout(() => navigate(to), showFor ? showFor : 3000) // Increased to 3s so users can read it
    return () => clearTimeout(timeout)
  }, [navigate, showFor])

  // Object Style CSS Definitions
  const isDark = theme === 'dark'

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: isDark ? '#121212' : '#f8f9fa',
      color: isDark ? '#ffffff' : '#212529',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      transition: 'background-color 0.3s ease, color 0.3s ease',
      textAlign: 'center',
      padding: '20px',
      boxSizing: 'border-box',
    },
    errorCode: {
      fontSize: '6rem',
      fontWeight: 'bold',
      margin: '0',
      lineHeight: '1',
      color: isDark ? '#ff6b6b' : '#e63946',
    },
    message: {
      fontSize: '1.5rem',
      margin: '20px 0 10px 0',
      fontWeight: '500',
    },
    subtext: {
      fontSize: '1rem',
      color: isDark ? '#a0a0a0' : '#6c757d',
      margin: '0',
    },
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.errorCode}>404</h1>
      <p style={styles.message}>{msg ? msg : 'Page not found.'}</p>
      <p style={styles.subtext}>Redirecting you shortly...</p>
    </div>
  )
}

export default NotFound
