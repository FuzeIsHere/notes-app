import React, { useState } from 'react'
import { Input } from '../components/ui/Input/Input'
import { Button } from '../components/ui/Button/Button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useUI } from '../hooks/useUI'
import styles from './Login.module.css'

const Login = () => {
  const { login } = useAuth();
  const { theme } = useUI();
  const navigate = useNavigate();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('email required'); return };
    if (password.length < 6) { setError('please enter a password greater than 5 characters'); return };
    setError('')

    try {
      setLoading(true);
      await login(email, password);
      navigate('/dashboard')
    }
    catch (err) {
      setError(err.message);
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${styles.pageWrapper} ${styles[theme]}`}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Log In</h1>
        
        {error && (
          <div className={styles.errorAlert}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.formStack}>
          <Input 
            label="Email" 
            placeholder="Enter your email" 
            onChange={e => setEmail(e.target.value)} 
            value={email} 
            disabled={loading} 
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="Enter password" 
            onChange={e => setPassword(e.target.value)} 
            value={password} 
            disabled={loading} 
          />
          <Button type="submit" disabled={loading} size="lg" className={styles.submitBtn}>
            {loading ? 'Logging In...' : 'Log In'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login
