import React, { useEffect, useState } from 'react';
import { hospitalAPI } from '../../services/api';
import { callGemini, isGeminiConfigured } from '../../services/geminiService';
import toast from 'react-hot-toast';

const expiryBadge = s => ({ GOOD: 'badge-good', NEAR_EXPIRY: 'badge-warning', CRITICAL: 'badge-danger', EXPIRED: 'badge-critical' }[s] || 'badge-neutral');
const expiryLabel = s => ({ GOOD: 'Good', NEAR_EXPIRY: 'Near Expiry', CRITICAL: 'Critical', EXPIRED: 'Expired' }[s] || s);

export default function HospitalExpiry() {
  const [nearExpiry, setNearExpiry] = useState([]);
  const [sharedAlerts, setSharedAlerts] = useState([]);
  const [shareEnabled, setShareEnabled] = useState(false);
  const [tab, setTab] = useState('mine');
  const [loading, setLoading] = useState(true);
  const [riskReport, setRiskReport] = useState(null);
  const [riskReportLoading, setRiskReportLoading] = useState(false);
  const [riskReportError, setRiskReportError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([hospitalAPI.getNearExpiry(), hospitalAPI.getSharedAlerts()])
      .then(([exp, shared]) => { setNearExpiry(exp.data); setSharedAlerts(shared.data); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const toggleShare = async () => {
    try {
      const next = !shareEnabled;
      await hospitalAPI.toggleExpirySharing(next);
      setShareEnabled(next);
      toast.success(next ? 'Expiry sharing enabled' : 'Expiry sharing disabled');
    } catch { toast.error('Failed to update setting'); }
  };

  const generateRiskReport = async () => {
    setRiskReportLoading(true);
    setRiskReportError(null);
    try {
      const batchesList = nearExpiry
        .filter(b => b.expiryStatus === 'NEAR_EXPIRY' || b.expiryStatus === 'CRITICAL' || b.expiryStatus === 'EXPIRED')
        .map(b => `${b.medicineName}, batch ${b.batchNumber}, ${Math.max(0, b.daysUntilExpiry)} days remaining, ${b.quantity} units`)
        .join('; ');
      
      const prompt = `You are a pharmacy risk analyst. These medicine batches are approaching expiry: ${batchesList}. For each batch, recommend exactly one action from: TRANSFER, DISCOUNT, or DISPOSE. Format your response as a numbered list. Each line must follow this exact format: [number]. [Medicine Name] — [Batch No] — [X days] — ✅ TRANSFER or ⚠️ DISCOUNT or 🗑️ DISPOSE — [reason in 5 words max]. Order by most urgent first. No extra text before or after the list.`;
      
      const result = await callGemini(prompt);
      if (result) {
        setRiskReport(result);
      } else {
        setRiskReportError('❌ AI service unavailable. Please check your Gemini API key in .env');
      }
    } catch (e) {
      setRiskReportError('❌ AI service error. Please configure a valid Gemini API key.');
    } finally {
      setRiskReportLoading(false);
    }
  };

  const critical = nearExpiry.filter(b => b.expiryStatus === 'CRITICAL' || b.expiryStatus === 'EXPIRED');
  const warning = nearExpiry.filter(b => b.expiryStatus === 'NEAR_EXPIRY');

  const displayList = tab === 'mine' ? nearExpiry : sharedAlerts;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title">Expiry Management</div>
            <div className="page-sub">Track and manage medicine expiry across your institution</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Share my expiry alerts</span>
            <label className="toggle">
              <input type="checkbox" checked={shareEnabled} onChange={toggleShare} />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Critical / Expired</div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{critical.length}</div>
          <div className="stat-sub">Immediate action needed</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Near Expiry (≤30 days)</div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{warning.length}</div>
          <div className="stat-sub">Plan redistribution</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">City-Wide Alerts</div>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{sharedAlerts.length}</div>
          <div className="stat-sub">Shared by other institutions</div>
        </div>
      </div>

      {/* Critical alert banner */}
      {critical.length > 0 && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          🚨 <strong>{critical.length} batches</strong> are critically near expiry or expired. Immediate action required!
        </div>
      )}

      {/* AI Risk Report Section */}
      {tab === 'mine' && (nearExpiry.length > 0 || riskReport) && (
        <div style={{ marginBottom: 20 }}>
          <button
            className="btn btn-primary"
            onClick={generateRiskReport}
            disabled={riskReportLoading || !isGeminiConfigured()}
            title={!isGeminiConfigured() ? 'Gemini API not configured. Add REACT_APP_GEMINI_KEY to .env' : ''}
            style={{
              background: isGeminiConfigured() ? 'rgba(0, 229, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
              color: isGeminiConfigured() ? 'var(--text-primary)' : 'var(--text-muted)',
              border: isGeminiConfigured() ? '1px solid rgba(0, 229, 255, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: 10,
              padding: '10px 24px',
              fontWeight: 500,
              opacity: isGeminiConfigured() ? 1 : 0.6,
              cursor: isGeminiConfigured() ? 'pointer' : 'not-allowed'
            }}
          >
            ✨ Generate AI Risk Report
          </button>
          {!isGeminiConfigured() && (
            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--warning)', background: 'rgba(245, 124, 0, 0.1)', padding: 12, borderRadius: 8 }}>
              ⚠️ AI feature disabled. Add <code style={{background: 'rgba(0,0,0,0.1)', padding: '2px 6px', borderRadius: 3}}>REACT_APP_GEMINI_KEY</code> to <code style={{background: 'rgba(0,0,0,0.1)', padding: '2px 6px', borderRadius: 3}}>.env</code> file.
            </div>
          )}
          {riskReportLoading && (
            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)' }}>
              Analyzing your batches...
            </div>
          )}
          {riskReportError && (
            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--danger)' }}>
              {riskReportError}
            </div>
          )}
          {riskReport && (
            <div style={{
              marginTop: 16,
              background: 'var(--warning-light)',
              border: '1px solid var(--warning)',
              borderRadius: 12,
              padding: 20,
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'pre-wrap',
              fontSize: 13,
              color: 'var(--text-primary)',
              lineHeight: 1.6
            }}>
              {riskReport}
              <button
                className="btn btn-sm btn-secondary"
                onClick={generateRiskReport}
                disabled={riskReportLoading}
                style={{ marginTop: 16 }}
              >
                Regenerate ↺
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[{ key: 'mine', label: `My Expiry (${nearExpiry.length})` }, { key: 'city', label: `City Alerts (${sharedAlerts.length})` }].map(t => (
          <button key={t.key} className={`btn btn-sm ${tab === t.key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
        <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }} onClick={fetchData}>↻ Refresh</button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading" style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>Loading expiry data...</div>
        ) : displayList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <div className="empty-state-text">{tab === 'mine' ? 'No near-expiry medicines in your inventory' : 'No city-wide expiry alerts shared'}</div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Medicine</th>
                  {tab === 'city' && <th>Institution</th>}
                  <th>Batch</th>
                  <th>Quantity</th>
                  <th>Expiry Date</th>
                  <th>Days Left</th>
                  <th>Status</th>
                  {tab === 'mine' && <th>Shared</th>}
                </tr>
              </thead>
              <tbody>
                {displayList.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{b.medicineName}</td>
                    {tab === 'city' && <td style={{ fontSize: 13 }}>{b.hospitalName}</td>}
                    <td><span className="tracking-code">{b.batchNumber}</span></td>
                    <td style={{ fontWeight: 600 }}>{b.quantity}</td>
                    <td style={{ fontSize: 13 }}>{b.expiryDate}</td>
                    <td style={{
                      fontWeight: 700,
                      color: b.daysUntilExpiry < 0 ? 'var(--critical)' : b.daysUntilExpiry < 7 ? 'var(--danger)' : b.daysUntilExpiry < 30 ? 'var(--warning)' : 'var(--success)',
                    }}>
                      {b.daysUntilExpiry < 0 ? `Expired ${Math.abs(b.daysUntilExpiry)}d ago` : `${b.daysUntilExpiry}d`}
                    </td>
                    <td><span className={`badge ${expiryBadge(b.expiryStatus)}`}>{expiryLabel(b.expiryStatus)}</span></td>
                    {tab === 'mine' && (
                      <td>{b.shareAlert ? <span className="badge badge-info">Shared</span> : <span className="badge badge-neutral">Private</span>}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
