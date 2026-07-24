import React, { useEffect, useState } from 'react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const SignUp = () => {
  const {signup} = useAuth();

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) { setError('name required'); return };
    if (!email) { setError('email required'); return };
    if (password.length < 6) { setError('please enter a password greater than 5 characters'); return };
    if (confirmPassword !== password) { setError('confirm password must match with password'); return };
    setError('')

    if (error) return;

    try {
      setLoading(true);
      await signup(email, password);
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
      <h1>Sign up</h1>
      {error && <p style={{ color: 'red' }}>Error : {error}</p>}
      <form onSubmit={handleSubmit}>
        <Input label="Name" placeholder="Enter your name" onChange={e => setName(e.target.value)} value={name} disabled={loading} />
        <Input label="Email" placeholder="Enter your email" onChange={e => setEmail(e.target.value)} value={email} disabled={loading} />
        <Input label="Password" type="password" placeholder="Enter password" onChange={e => setPassword(e.target.value)} value={password} disabled={loading} />
        <Input label="Confirm password" type="password" placeholder="Enter confirm password" onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword} disabled={loading} />
        <Button type="submit" disabled={loading}>{loading ? 'Signing up' : 'Sign up'}</Button>
      </form>

    </>
  )
}

export default SignUp