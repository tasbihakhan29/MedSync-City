import React, { useState } from 'react';
import { analyzeExpiryRisk, getRiskBadgeClass, calculateDaysToExpiry } from '../../services/aiPrototypeService';
import toast from 'react-hot-toast';

export default function AIRecommendation({ medicine, onRequestTransfer }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeExpiryRisk(medicine);
      setAnalysis(result);
      
      if (result.recommendation === 'TRANSFER') {
        toast.success('🤖 AI Recommendation: TRANSFER this medicine!');
      } else if (result.recommendation === 'DISCOUNT') {
        toast(result.reasoning, { icon: '💰' });
      }
    } catch (error) {
      toast.error('Failed to analyze: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const daysToExpiry = calculateDaysToExpiry(medicine.expiryDate);

  return (
    <div style={{
      border: '1px solid var(--cyan-glow)',
      borderRadius: '12px',
      padding: '16px',
      background: 'rgba(0, 229, 255, 0.03)',
      marginBottom: '16px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <span style={{ fontSize: '20px' }}>🤖</span>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
            AI Analysis
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {daysToExpiry} days until expiry
          </div>
        </div>
      </div>

      {/* Analysis Result */}
      {analysis ? (
        <div style={{ marginBottom: '12px' }}>
          {/* Risk Level & Recommendation */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span className={`badge ${getRiskBadgeClass(analysis.riskLevel)}`}>
              {analysis.riskLevel}
            </span>
            <span className={`badge ${analysis.recommendation === 'TRANSFER' ? 'badge-info' : 'badge-warning'}`}>
              {analysis.recommendation}
            </span>
          </div>

          {/* Reasoning */}
          <div style={{
            background: '#FFFFFF',
            padding: '10px 12px',
            borderRadius: '8px',
            borderLeft: '3px solid var(--cyan)',
            fontSize: '13px',
            color: 'var(--text-primary)',
            lineHeight: '1.5',
            marginBottom: '8px'
          }}>
            <strong>Why:</strong> {analysis.reasoning}
          </div>

          {/* Alternative */}
          <div style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontStyle: 'italic'
          }}>
            <strong>Backup Plan:</strong> {analysis.alternative}
          </div>

          {/* Fallback Notice */}
          {analysis.usingFallback && (
            <div style={{
              marginTop: '8px',
              fontSize: '11px',
              color: 'var(--text-muted)',
              background: '#FFF3E0',
              padding: '6px 8px',
              borderRadius: '4px'
            }}>
              ⚠️ Using rule-based analysis (Gemini unavailable)
            </div>
          )}

          {/* Actions */}
          {analysis.recommendation === 'TRANSFER' && onRequestTransfer && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onRequestTransfer(medicine)}
              style={{ marginTop: '10px', width: '100%' }}
            >
              📤 Request Transfer
            </button>
          )}
        </div>
      ) : (
        <button
          className="btn btn-sm btn-primary"
          onClick={handleAnalyze}
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? '🔄 Analyzing...' : '🔍 Get AI Analysis'}
        </button>
      )}
    </div>
  );
}
