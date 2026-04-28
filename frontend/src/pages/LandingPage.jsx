import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';
import api from '../services/api';

const CountUpNumber = ({ end, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;
      
      if (progress < 1) {
        setCount(Math.floor(end * progress));
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const StatCard = ({ icon, label, value, loading }) => {
  return (
    <div className="stat-card">
      {loading ? (
        <>
          <div className="stat-skeleton" />
          <div className="stat-skeleton" style={{ width: '60%', margin: '16px auto' }} />
          <div className="stat-skeleton" style={{ width: '80%', margin: '16px auto' }} />
        </>
      ) : (
        <>
          <div className="stat-icon">{icon}</div>
          <div className="stat-value">
            <CountUpNumber end={value} />
          </div>
          <div className="stat-label">{label}</div>
        </>
      )}
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
};

export default function LandingPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/public/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="landing-page">
      {/* SECTION 1: HERO */}
      <section className="hero">
        <div className="hero-background">
          <div className="floating-circle circle-1" />
          <div className="floating-circle circle-2" />
          <div className="floating-circle circle-3" />
        </div>

        <div className="hero-content">
          <div className="badge">
            <span className="badge-dot" />
            Powered by Gemini AI
          </div>

          <h1 className="hero-heading">
            <span className="heading-gradient">MedSync</span> City
          </h1>

          <h2 className="hero-subheading">
            AI-Powered Medicine Coordination Across Your City
          </h2>

          <p className="hero-description">
            Connecting hospitals and pharmacies to eliminate medicine shortages and reduce expiry waste — anonymously and intelligently.
          </p>

          <div className="hero-buttons">
            {user ? (
              <>
                <button 
                  onClick={() => navigate(user.role === 'CITY_ADMIN' ? '/admin/dashboard' : '/hospital/dashboard')}
                  className="btn btn-primary"
                >
                  Go to Dashboard
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="btn btn-secondary"
                >
                  Switch Account
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="btn btn-primary">
                  Login
                </a>
                <a href="/register" className="btn btn-secondary">
                  Register Institution
                </a>
              </>
            )}
          </div>

          <div className="scroll-indicator">↓</div>
        </div>
      </section>

      {/* SECTION 2: LIVE STATS */}
      <section className="live-stats">
        <div className="stats-content">
          <h2 className="stats-heading">Live City Network</h2>
          <p className="stats-subtext">
            Real-time data from the city medicine network
          </p>

          <div className="stats-grid">
            <StatCard
              icon="🏥"
              label="Active Institutions"
              value={stats?.totalInstitutions || 0}
              loading={loading}
            />
            <StatCard
              icon="🧪"
              label="Medicines Tracked"
              value={stats?.totalMedicines || 0}
              loading={loading}
            />
            <StatCard
              icon="📦"
              label="Active Batches"
              value={stats?.activeBatches || 0}
              loading={loading}
            />
            <StatCard
              icon="🔄"
              label="Pending Transfers"
              value={stats?.pendingTransfers || 0}
              loading={loading}
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES */}
      <section className="features">
        <div className="features-content">
          <h2 className="features-heading">Why MedSync City?</h2>

          <div className="features-grid">
            <FeatureCard
              icon="🛡️"
              title="Anonymous Supply Chain"
              description="Hospitals request medicine without revealing identity until transfer is accepted — removing bias from the city supply network."
            />
            <FeatureCard
              icon="✨"
              title="Gemini AI Risk Analysis"
              description="AI analyzes expiry dates across all institutions and recommends actions — transfer, discount or dispose — before medicine is wasted."
            />
            <FeatureCard
              icon="📊"
              title="FIFO Smart Inventory"
              description="Automatic first-in-first-out stock deduction with real-time expiry classification. The oldest stock always moves first."
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: CTA BANNER */}
      <section className="cta-banner">
        <h2 className="cta-heading">Ready to join the network?</h2>
        <p className="cta-subtext">Register your hospital or pharmacy today.</p>
        {user ? (
          <button 
            onClick={() => navigate(user.role === 'CITY_ADMIN' ? '/admin/dashboard' : '/hospital/dashboard')}
            className="btn btn-cta"
          >
            Go to Dashboard
          </button>
        ) : (
          <a href="/register" className="btn btn-cta">
            Get Started
          </a>
        )}
      </section>

      {/* SECTION 5: FOOTER */}
      <footer className="landing-footer">
        <p>MedSync City © 2024 · AI-Powered Healthcare Supply Network</p>
      </footer>
    </div>
  );
}
