import React, { useState } from 'react';
import { Input } from '../components/ui/Input/Input';
import { Button } from '../components/ui/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { FileText, ArrowLeft } from 'lucide-react';
import styles from './AuthStyles.module.css';

const Login = () => {
  const { login } = useAuth();
  const { theme, device } = useUI(); // Extracted device variable here
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (password.length < 6) { setError('Please enter a password greater than 5 characters'); return; }
    setError('');

    try {
      setLoading(true);
      await login(email, password);
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

        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to resume tracking your markdown thoughts.</p>
        
        {error && (
          <div className={styles.errorAlert}>
            <strong className={styles.errorLabel}>Error:</strong> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.formStack}>
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

          <Button 
            type="submit" 
            disabled={loading} 
            size="lg" 
            className={styles.submitBtn}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </Button>
        </form>

        <div className={styles.footerLinkContainer}>
          <span className={styles.footerText}>New to CoNotate? </span>
          <button onClick={() => navigate('/signup')} className={styles.inlineLinkBtn}>
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
