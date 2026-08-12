import React, { useState } from 'react';
import { Input } from '../components/ui/Input/Input';
import { Button } from '../components/ui/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { FileText, ArrowLeft } from 'lucide-react';
import styles from './AuthStyles.module.css';

const SignUp = () => {
  const { signup } = useAuth();
  const { theme, device } = useUI(); // Extracted device variable here
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) { setError('Name is required'); return; }
    if (!email) { setError('Email is required'); return; }
    if (password.length < 6) { setError('Please enter a password greater than 5 characters'); return; }
    if (confirmPassword !== password) { setError('Confirm password must match with password'); return; }
    setError('');

    try {
      setLoading(true);
      await signup(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentTheme = theme || 'dark';
  const currentDevice = device || 'desktop';

  return (
    <div className={styles.pageWrapper} data-theme={currentTheme} data-device={currentDevice}>
      
      <button 
        onClick={() => navigate('/')} 
        className={styles.backButton}
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      <div className={styles.authCard}>
        <div className={styles.brandHeader}>
          <div className={styles.logoIcon}>
            <FileText size={20} color="#1A5CFF" />
          </div>
          <span className={styles.brandName}>CoNotate</span>
        </div>

        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Get started with a cloud-synced markdown workspace.</p>
        
        {error && (
          <div className={styles.errorAlert}>
            <strong className={styles.errorLabel}>Error:</strong> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.formStack}>
          <div className={styles.inputWrapper}>
            <Input 
              label="Name" 
              placeholder="Enter your name" 
              onChange={e => setName(e.target.value)} 
              value={name} 
              disabled={loading} 
            />
          </div>
          <div className={styles.inputWrapper}>
            <Input 
              label="Email" 
              placeholder="Enter your email" 
              onChange={e => setEmail(e.target.value)} 
              value={email} 
              disabled={loading} 
            />
          </div>
          <div className={styles.inputWrapper}>
            <Input 
              label="Password" 
              type="password" 
              placeholder="Enter password" 
              onChange={e => setPassword(e.target.value)} 
              value={password} 
              disabled={loading} 
            />
          </div>
          <div className={styles.inputWrapper}>
            <Input 
              label="Confirm Password" 
              type="password" 
              placeholder="Enter confirm password" 
              onChange={e => setConfirmPassword(e.target.value)} 
              value={confirmPassword} 
              disabled={loading} 
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            size="lg" 
            className={styles.submitBtn}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <div className={styles.footerLinkContainer}>
          <span className={styles.footerText}>Already have an account? </span>
          <button onClick={() => navigate('/login')} className={styles.inlineLinkBtn}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
