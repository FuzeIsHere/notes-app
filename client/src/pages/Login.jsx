import React, { useEffect, useState } from 'react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const {login} = useAuth();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('email required'); return };
    if (password.length < 6) { setError('please enter a password greater than 5 characters'); return };
    setError('')

    if (error) return;

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
    <>
      <h1>Log In</h1>
      {error && <p style={{ color: 'red' }}>Error : {error}</p>}
      <form onSubmit={handleSubmit}>
        <Input label="Email" placeholder="Enter your email" onChange={e => setEmail(e.target.value)} value={email} disabled={loading} />
        <Input label="Password" type="password" placeholder="Enter password" onChange={e => setPassword(e.target.value)} value={password} disabled={loading} />
        <Button type="submit" disabled={loading}>{loading ? 'Logging In...' : 'Log In'}</Button>
      </form>

    </>
  )
}

export default Login