import React, { useState, useEffect } from 'react';
import { parseNaturalLanguageRequest } from '../../services/aiPrototypeService';
import toast from 'react-hot-toast';

export default function NaturalLanguageForm({ medicines, onSubmit }) {
  const [nlText, setNlText] = useState('');
  const [formData, setFormData] = useState({
    medicineId: '',
    quantity: '',
    requestedDate: '',
    urgency: 'MEDIUM',
    notes: ''
  });
  const [parsing, setParsing] = useState(false);
  const [showFilledForm, setShowFilledForm] = useState(false);

  const handleParseNL = async () => {
    if (!nlText.trim()) {
      toast.error('Please enter a request');
      return;
    }

    setParsing(true);
    try {
      const parsed = await parseNaturalLanguageRequest(nlText);

      if (!parsed) {
        toast.error('Could not parse request. Please fill manually.');
        setParsing(false);
        return;
      }

      // Find matching medicine
      const medicine = medicines.find(m =>
        m.name.toLowerCase().includes(parsed.medicineName.toLowerCase())
      );

      // Fill form with parsed data
      setFormData(prev => ({
        ...prev,
        medicineId: medicine?.id || '',
        quantity: parsed.quantity || '',
        requestedDate: parsed.requestedDate || new Date().toISOString().split('T')[0],
        urgency: parsed.urgency || 'MEDIUM',
        notes: parsed.notes || ''
      }));

      setShowFilledForm(true);
      toast.success('✨ AI filled your form! Review and submit.');
    } catch (error) {
      console.error('Error parsing:', error);
      toast.error('Error: ' + error.message);
    } finally {
      setParsing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.medicineId || !formData.quantity || !formData.requestedDate) {
      toast.error('Please fill all required fields');
      return;
    }

    onSubmit(formData);
  };

  const handleManualChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="page-title">💬 Request Medicine (Natural Language)</div>
      <div className="page-sub">Type in plain English - AI will fill the form for you</div>

      {/* Natural Language Input */}
      <div style={{ marginTop: '20px' }}>
        <div className="form-group">
          <label className="form-label">What do you need? (Example: "I need 500 paracetamol by next week")</label>
          <textarea
            className="form-control"
            placeholder="e.g., 'I need 200 units of Aspirin urgently' or 'Send 500 insulin next Monday'"
            value={nlText}
            onChange={(e) => setNlText(e.target.value)}
            style={{
              minHeight: '80px',
              resize: 'vertical',
              fontFamily: 'var(--font-main)'
            }}
            disabled={showFilledForm}
          />
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleParseNL}
          disabled={parsing || showFilledForm}
          style={{ width: '100%' }}
        >
          {parsing ? '🔄 AI Analyzing...' : '🤖 Let AI Fill Form'}
        </button>

        {showFilledForm && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setShowFilledForm(false);
              setNlText('');
              setFormData({
                medicineId: '',
                quantity: '',
                requestedDate: '',
                urgency: 'MEDIUM',
                notes: ''
              });
            }}
            style={{ width: '100%', marginTop: '8px' }}
          >
            ← Start Over
          </button>
        )}
      </div>

      {/* Filled Form */}
      {showFilledForm && (
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
          <div style={{
            background: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid var(--cyan-glow)',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '13px',
            color: 'var(--text-primary)'
          }}>
            ✅ <strong>AI-Filled Form</strong> - Please review and adjust if needed
          </div>

          <form onSubmit={handleSubmit}>
            {/* Medicine */}
            <div className="form-group">
              <label className="form-label">Medicine *</label>
              <select
                className="form-control"
                value={formData.medicineId}
                onChange={(e) => handleManualChange('medicineId', e.target.value)}
                required
              >
                <option value="">
                  {formData.medicineId
                    ? medicines.find(m => m.id == formData.medicineId)?.name
                    : 'Select medicine...'}
                </option>
                {medicines.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Quantity & Requested Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Quantity (units) *</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.quantity}
                  onChange={(e) => handleManualChange('quantity', e.target.value)}
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Requested Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.requestedDate}
                  onChange={(e) => handleManualChange('requestedDate', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Urgency */}
            <div className="form-group">
              <label className="form-label">Urgency</label>
              <select
                className="form-control"
                value={formData.urgency}
                onChange={(e) => handleManualChange('urgency', e.target.value)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High - Urgent</option>
              </select>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Additional Notes</label>
              <textarea
                className="form-control"
                value={formData.notes}
                onChange={(e) => handleManualChange('notes', e.target.value)}
                placeholder="Any special requirements?"
                style={{ minHeight: '60px' }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-success"
              style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}
            >
              ✅ Submit Request
            </button>
          </form>
        </div>
      )}

      {/* Info Box */}
      <div style={{
        marginTop: '20px',
        background: 'var(--warning-light)',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '12px',
        color: 'var(--warning)',
        lineHeight: '1.5'
      }}>
        <strong>💡 Pro Tips:</strong><br />
        • Use clear quantities: "200 units", "5 bottles"<br />
        • Mention timing: "today", "next week", "urgent"<br />
        • AI will auto-fill most fields!
      </div>
    </div>
  );
}
