import React, { useState } from 'react';
import { 
  FileText, Cloud, Brain, Trash2, 
  Sun, Moon, Pin, Search, ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const navigate = useNavigate()

  const { user, loading } = useAuth();

  return (
    <div style={styles.container}>
      
      {/* HEADER NAVBAR */}
      <header style={styles.header}>
        <div style={styles.logo}>CoNotate</div>
        <button 
          style={{...styles.ctaButton(isBtnHovered), padding: '10px 20px', fontSize: '14px'}}
          onMouseEnter={() => setIsBtnHovered(true)}
          onMouseLeave={() => setIsBtnHovered(false)}
          onClick={() => (
            loading ? navigate('/login') : user ? navigate('/dashboard') : navigate('/login')
          )}
        >
          {
            loading ? 'Log In' : user ? 'Go to Dashboard' : 'Log In'
          }
        </button>
      </header>

      {/* HERO SECTION */}
      <section style={styles.heroSection}>
        <div style={styles.heroBadge}>Cloud-Synced Markdown Workspace</div>
        <h1 style={styles.heroTitle}>Your thoughts, structured and searchable.</h1>
        <p style={styles.heroSubtitle}>
          CoNotate is a modern note-taking dashboard designed to capture your ideas instantly. 
          Format with full rich text controls, find anything with intelligent semantic search, 
          and keep your workspace organized across all of your devices.
        </p>
        <button 
          style={styles.ctaButton(isBtnHovered)}
          onMouseEnter={() => setIsBtnHovered(true)}
          onMouseLeave={() => setIsBtnHovered(false)}
          onClick={() => (
            loading ? navigate('/login') : user ? navigate('/dashboard') : navigate('/login')
          )}
        >
          Start Writing Now <ArrowRight size={18} />
        </button>
      </section>

      {/* CORE HIGHLIGHTS GRID */}
      <section style={styles.featuresGrid}>
        
        {/* Feature 1: Rich Text Editor */}
        <div 
          style={styles.featureCard(hoveredFeature, 1)}
          onMouseEnter={() => setHoveredFeature(1)}
          onMouseLeave={() => setHoveredFeature(null)}
        >
          <div style={styles.iconWrapper}>
            <FileText size={24} color="#1A5CFF" />
          </div>
          <h3 style={styles.featureTitle}>Rich Text Formatting</h3>
          <p style={styles.featureText}>
            Express ideas clearly with full text decoration styles. Apply headers, bold, italics, 
            underlines, list structures, and seamlessly insert hyperlinked resources or imagery directly into your workflow.
          </p>
        </div>

        {/* Feature 2: Cloud Sync */}
        <div 
          style={styles.featureCard(hoveredFeature, 2)}
          onMouseEnter={() => setHoveredFeature(2)}
          onMouseLeave={() => setHoveredFeature(null)}
        >
          <div style={styles.iconWrapper}>
            <Cloud size={24} color="#A885FF" />
          </div>
          <h3 style={styles.featureTitle}>Cloud Sync via Firestore</h3>
          <p style={styles.featureText}>
            Never worry about losing your data. Your database notes automatically sync to the cloud 
            via Firebase Firestore, allowing secure account log-ins and instantaneous access from any modern device.
          </p>
        </div>

        {/* Feature 3: Semantic Search */}
        <div 
          style={styles.featureCard(hoveredFeature, 3)}
          onMouseEnter={() => setHoveredFeature(3)}
          onMouseLeave={() => setHoveredFeature(null)}
        >
          <div style={styles.iconWrapper}>
            <Brain size={24} color="#00E676" />
          </div>
          <h3 style={styles.featureTitle}>Semantic Search Tool</h3>
          <p style={styles.featureText}>
            Go beyond strict keyword matching. The application's search engine understands the true underlying 
            context of your text queries, resurfacing relevant concepts even if exact phrases don't match.
          </p>
        </div>

      </section>

      {/* ADDITIONAL SPECIFICATIONS & CAPABILITIES FOOTER */}
      <section style={styles.specsSection}>
        <div style={styles.specsInner}>
          
          <div style={styles.specItem}>
            <Search size={28} color="#9E9E9E" />
            <div>
              <h4 style={styles.specTitle}>3 Smart Categories</h4>
              <p style={styles.specDesc}>Sort workspaces dynamically into dedicated Work, Personal, or Ideas feeds.</p>
            </div>
          </div>

          <div style={styles.specItem}>
            <Pin size={28} color="#9E9E9E" />
            <div>
              <h4 style={styles.specTitle}>Pinned Context</h4>
              <p style={styles.specDesc}>Keep your most critical check-lists pinned safely to the very top of your dashboard grid.</p>
            </div>
          </div>

          <div style={styles.specItem}>
            <Trash2 size={28} color="#9E9E9E" />
            <div>
              <h4 style={styles.specTitle}>Trash Recovery Box</h4>
              <p style={styles.specDesc}>Deleted items remain safe inside the trash interface until permanently purged.</p>
            </div>
          </div>

          <div style={styles.specItem}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <Sun size={18} color="#9E9E9E" />
              <Moon size={18} color="#9E9E9E" />
            </div>
            <div>
              <h4 style={styles.specTitle}>Light & Dark Themes</h4>
              <p style={styles.specDesc}>Toggle view environments instantly to comfortably match ambient room lighting.</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}


  const styles = {
    container: {
      scrollbarWidth: 'none',
      backgroundColor: '#121212',
      color: '#E0E0E0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      borderBottom: '1px solid #2C2C2C',
      backgroundColor: '#1A1A1A',
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#FFFFFF',
      letterSpacing: '0.5px',
    },
    heroSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '90px 20px',
      maxWidth: '850px',
      margin: '0 auto',
    },
    heroBadge: {
      backgroundColor: '#2B2240',
      color: '#A885FF',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
      marginBottom: '24px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    heroTitle: {
      fontSize: '52px',
      fontWeight: '800',
      color: '#FFFFFF',
      margin: '0 0 20px 0',
      lineHeight: '1.2',
    },
    heroSubtitle: {
      fontSize: '18px',
      color: '#9E9E9E',
      margin: '0 0 40px 0',
      lineHeight: '1.6',
    },
    ctaButton: (isBtnHovered) => ({
      backgroundColor: '#1A5CFF',
      color: '#FFFFFF',
      fontSize: '16px',
      fontWeight: '600',
      padding: '14px 32px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: isBtnHovered ? '0 4px 20px rgba(26, 92, 255, 0.4)' : 'none',
      transform: isBtnHovered ? 'translateY(-2px)' : 'translateY(0)',
      transition: 'all 0.2s ease',
    }),
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      padding: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
    },
    featureCard: (hoveredFeature, id) => ({
      backgroundColor: '#1A1A1A',
      border: hoveredFeature === id ? '1px solid #1A5CFF' : '1px solid #2C2C2C',
      borderRadius: '12px',
      padding: '32px',
      transition: 'all 0.2s ease',
      transform: hoveredFeature === id ? 'translateY(-4px)' : 'translateY(0)',
    }),
    iconWrapper: {
      backgroundColor: '#242424',
      width: '48px',
      height: '48px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    featureTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#FFFFFF',
      margin: '0 0 12px 0',
    },
    featureText: {
      fontSize: '14px',
      color: '#9E9E9E',
      lineHeight: '1.6',
      margin: 0,
    },
    specsSection: {
      backgroundColor: '#1A1A1A',
      padding: '50px 40px',
      marginTop: 'auto',
      borderTop: '1px solid #2C2C2C',
    },
    specsInner: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      gap: '40px',
    },
    specItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      minWidth: '220px',
    },
    specTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#FFFFFF',
      margin: '0 0 4px 0',
    },
    specDesc: {
      fontSize: '13px',
      color: '#757575',
      margin: 0,
    }
  };