import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[LOGIN_PAGE] Form submission started');
    console.log('[LOGIN_PAGE] Form data:', { username: form.username, password: '***' });
    
    if (!form.username || !form.password) {
      console.warn('[LOGIN_PAGE] Validation failed - missing fields');
      toast.error('Please fill in all fields');
      return;
    }
    
    console.log('[LOGIN_PAGE] Validation passed, sending API request');
    setLoading(true);
    try {
      console.log('[LOGIN_PAGE] Calling authAPI.login() for:', form.username);
      const res = await authAPI.login(form);
      console.log('[LOGIN_PAGE] API response received:', res.status);
      console.log('[LOGIN_PAGE] Response data:', { username: res.data.username, role: res.data.role, status: res.data.status });
      
      const data = res.data;
      console.log('[LOGIN_PAGE] Calling login context with token and user data');
      login(data, data.token);
      
      console.log('[LOGIN_PAGE] Login successful, navigating to dashboard');
      toast.success(`Welcome back, ${data.username || 'User'}!`);
      
      if (data.role === 'CITY_ADMIN') {
        console.log('[LOGIN_PAGE] Redirecting to admin dashboard');
        navigate('/admin/dashboard');
      } else {
        console.log('[LOGIN_PAGE] Redirecting to hospital dashboard');
        navigate('/hospital/dashboard');
      }
    } catch (err) {
      console.error('[LOGIN_PAGE] Login error:', err);
      console.error('[LOGIN_PAGE] Error response status:', err.response?.status);
      console.error('[LOGIN_PAGE] Error response data:', err.response?.data);
      console.error('[LOGIN_PAGE] Error message:', err.message);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      console.error('[LOGIN_PAGE] Showing toast error:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel slide-up">
        <div className="login-brand">
          <div className="login-icon">💊</div>
          <div className="login-title">MedSync City</div>
          <div className="login-sub">Medicine Coordination Platform</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              placeholder="Enter your username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="divider" />

        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
          New hospital or pharmacy?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            Register here
          </Link>
        </div>

        <div style={{ marginTop: 20, padding: 14, background: 'var(--bg-secondary)', borderRadius: 8, fontSize: 12 }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>Demo Credentials</div>
          <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            Admin: admin / Admin@123
          </div>
        </div>
      </div>
    </div>
  );
}
