import React, { useState } from 'react';
import { Input } from '../components/ui/Input/Input';
import { Button } from '../components/ui/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { FileText, ArrowLeft } from 'lucide-react';

const SignUp = () => {
  const { signup } = useAuth();
  const { theme } = useUI();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

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

  // Safe theme extraction safeguard for styling
  const currentTheme = theme || 'dark';

  return (
    <div style={styles.pageWrapper(currentTheme)}>
      
      {/* Decorative Back Navigation Control */}
      <button 
        onClick={() => navigate('/')} 
        style={styles.backButton}
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      <div style={styles.authCard(currentTheme)}>
        {/* Unified Brand Presentation */}
        <div style={styles.brandHeader}>
          <div style={styles.logoIcon}>
            <FileText size={20} color="#1A5CFF" />
          </div>
          <span style={styles.brandName}>CoNotate</span>
        </div>

        <h1 style={styles.title}>Create your account</h1>
        <p style={styles.subtitle}>Get started with a cloud-synced markdown workspace.</p>
        
        {error && (
          <div style={styles.errorAlert}>
            <strong style={{ fontWeight: '600' }}>Error:</strong> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.formStack}>
          <div style={styles.inputWrapper}>
            <Input 
              label="Name" 
              placeholder="Enter your name" 
              onChange={e => setName(e.target.value)} 
              value={name} 
              disabled={loading} 
            />
          </div>
          <div style={styles.inputWrapper}>
            <Input 
              label="Email" 
              placeholder="Enter your email" 
              onChange={e => setEmail(e.target.value)} 
              value={email} 
              disabled={loading} 
            />
          </div>
          <div style={styles.inputWrapper}>
            <Input 
              label="Password" 
              type="password" 
              placeholder="Enter password" 
              onChange={e => setPassword(e.target.value)} 
              value={password} 
              disabled={loading} 
            />
          </div>
          <div style={styles.inputWrapper}>
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
            style={styles.submitBtn(isBtnHovered, loading)}
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <div style={styles.footerLinkContainer}>
          <span style={styles.footerText}>Already have an account? </span>
          <button onClick={() => navigate('/login')} style={styles.inlineLinkBtn}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

// --- Clean Object Style CSS Definitions Positioning ---
const styles = {
  pageWrapper: (theme) => ({
    backgroundColor: theme === 'light' ? '#F5F5F5' : '#121212',
    color: theme === 'light' ? '#1A1A1A' : '#E0E0E0',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    boxSizing: 'border-box',
    position: 'relative',
    transition: 'background-color 0.2s ease',
  }),
  backButton: {
    position: 'absolute',
    top: '24px',
    left: '24px',
    background: 'none',
    border: 'none',
    color: '#9E9E9E',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  authCard: (theme) => ({
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#1A1A1A',
    border: theme === 'light' ? '1px solid #E0E0E0' : '1px solid #2C2C2C',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    boxSizing: 'border-box',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.2s ease',
  }),
  brandHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '24px',
  },
  logoIcon: {
    backgroundColor: '#242424',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: '0.5px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#9E9E9E',
    textAlign: 'center',
    margin: '0 0 32px 0',
    lineHeight: '1.4',
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#EF4444',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '24px',
    lineHeight: '1.4',
  },
  formStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  submitBtn: (isHovered, loading) => ({
    backgroundColor: loading ? '#2C2C2C' : '#1A5CFF',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: '600',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    width: '100%',
    marginTop: '8px',
    cursor: loading ? 'not-allowed' : 'pointer',
    boxShadow: isHovered && !loading ? '0 4px 16px rgba(26, 92, 255, 0.3)' : 'none',
    transform: isHovered && !loading ? 'translateY(-1px)' : 'translateY(0)',
    transition: 'all 0.15s ease',
  }),
  footerLinkContainer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
  },
  footerText: {
    color: '#757575',
  },
  inlineLinkBtn: {
    background: 'none',
    border: 'none',
    color: '#1A5CFF',
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0,
    fontSize: '14px',
  },
};
