import React, { useState } from 'react'
import { Input } from '../components/ui/Input/Input'
import { Button } from '../components/ui/Button/Button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useUI } from '../hooks/useUI'
import styles from './Login.module.css'

const SignUp = () => {
  const { signup } = useAuth();
  const { theme } = useUI();
  const navigate = useNavigate();

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) { setError('name required'); return };
    if (!email) { setError('email required'); return };
    if (password.length < 6) { setError('please enter a password greater than 5 characters'); return };
    if (confirmPassword !== password) { setError('confirm password must match with password'); return };
    setError('')

    try {
      setLoading(true);
      await signup(email, password, name);
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
        <h1 className={styles.title}>Sign Up</h1>
        
        {error && (
          <div className={styles.errorAlert}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.formStack}>
          <Input 
            label="Name" 
            placeholder="Enter your name" 
            onChange={e => setName(e.target.value)} 
            value={name} 
            disabled={loading} 
          />
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
          <Input 
            label="Confirm Password" 
            type="password" 
            placeholder="Enter confirm password" 
            onChange={e => setConfirmPassword(e.target.value)} 
            value={confirmPassword} 
            disabled={loading} 
          />
          <Button type="submit" disabled={loading} size="lg" className={styles.submitBtn}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default SignUp
