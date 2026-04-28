/**
 * AI Prototype Service - Core AI Features
 * Implements 2 main AI-powered features for MedSync
 * 
 * Feature 1: Expiry Risk Assessment
 * Feature 2: Natural Language Form Filling
 */

import { callGemini } from './geminiService';

/**
 * FEATURE 1: AI Expiry Risk Assessment
 * 
 * Analyzes medicine expiry and recommends action (TRANSFER/DISCOUNT/DISPOSE)
 * Input: Medicine details
 * Output: Risk analysis + Recommendation
 */
export async function analyzeExpiryRisk(medicine) {
  const {
    name,
    expiryDate,
    quantity,
    manufactureDate,
    batchNumber,
  } = medicine;

  // Calculate days until expiry
  const expiry = new Date(expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  const prompt = `You are a hospital medicine inventory AI assistant. Analyze this medicine expiry situation and provide a clear recommendation.

MEDICINE DETAILS:
- Name: ${name}
- Batch: ${batchNumber || 'N/A'}
- Quantity: ${quantity} units
- Expiry Date: ${expiryDate}
- Days Until Expiry: ${daysUntilExpiry} days
- Manufacture Date: ${manufactureDate || 'N/A'}

ANALYSIS RULES:
- CRITICAL: < 7 days to expiry = URGENT ACTION NEEDED
- NEAR_EXPIRY: 7-30 days = TRANSFER recommended
- GOOD: > 30 days = No immediate action
- High quantities with near expiry = MORE URGENT

PROVIDE:
1. Risk Level (CRITICAL/NEAR_EXPIRY/GOOD)
2. Recommended Action (TRANSFER/DISCOUNT/DISPOSE/NONE)
3. Brief Reasoning (1-2 sentences, actionable)
4. Alternative if primary fails (1 sentence)

FORMAT YOUR RESPONSE EXACTLY AS:
RISK_LEVEL: [CRITICAL/NEAR_EXPIRY/GOOD]
RECOMMENDATION: [TRANSFER/DISCOUNT/DISPOSE/NONE]
REASONING: [Your reasoning here]
ALTERNATIVE: [Your alternative here]

Keep it concise and clinical.`;

  try {
    const response = await callGemini(prompt);
    
    if (!response) {
      console.warn('⚠️ Gemini API not available - using fallback analysis');
      return generateFallbackAnalysis(daysUntilExpiry, quantity);
    }

    // Parse AI response
    const analysis = parseExpiryAnalysis(response, daysUntilExpiry);
    return analysis;
  } catch (error) {
    console.error('❌ Error analyzing expiry:', error);
    return generateFallbackAnalysis(daysUntilExpiry, quantity);
  }
}

/**
 * FEATURE 2: Natural Language Medicine Request Form Filling
 * 
 * Converts plain English request to structured form fields
 * Input: Natural language text
 * Output: Pre-filled form object
 */
export async function parseNaturalLanguageRequest(userInput) {
  const today = new Date();

  const prompt = `You are a medical form assistant. Extract medicine request details from natural language.

USER REQUEST: "${userInput}"

EXTRACT AND INFER:
1. medicineName - exact medicine name
2. quantity - number of units needed
3. requestedDate - when medicine is needed (infer if not explicit)
4. urgency - LOW/MEDIUM/HIGH based on context
5. notes - any special requirements

INFERENCE RULES:
- "asap", "urgent", "emergency" = urgency: HIGH
- "next week", "in 7 days" = requestedDate: Today + 7 days
- No urgency mention = urgency: MEDIUM
- If no date: requestedDate = Today + 3 days (default)

RESPOND WITH JSON ONLY (no markdown, no extra text):
{
  "medicineName": "extracted medicine name",
  "quantity": extracted_number,
  "requestedDate": "YYYY-MM-DD",
  "urgency": "LOW|MEDIUM|HIGH",
  "notes": "any special notes or empty string"
}

Today's date: ${today.toISOString().split('T')[0]}

Respond with ONLY the JSON object, no other text.`;

  try {
    const response = await callGemini(prompt);

    if (!response) {
      console.warn('⚠️ Could not parse request - using manual form');
      return null;
    }

    // Extract JSON from response
    const formData = extractJSON(response);
    
    if (!formData) {
      console.warn('⚠️ Could not extract JSON from response');
      return null;
    }

    // Validate extracted data
    if (formData.medicineName && formData.quantity && formData.requestedDate) {
      return formData;
    }

    return null;
  } catch (error) {
    console.error('❌ Error parsing request:', error);
    return null;
  }
}

/**
 * HELPER: Parse expiry analysis response
 */
function parseExpiryAnalysis(response, daysUntilExpiry) {
  let riskLevel = 'GOOD';
  let recommendation = 'NONE';
  let reasoning = 'No immediate action needed.';
  let alternative = 'Monitor closely as expiry approaches.';

  // Extract values from response
  const riskMatch = response.match(/RISK_LEVEL:\s*(\w+)/i);
  const recMatch = response.match(/RECOMMENDATION:\s*(\w+)/i);
  const reasonMatch = response.match(/REASONING:\s*([^\n]+)/);
  const altMatch = response.match(/ALTERNATIVE:\s*([^\n]+)/);

  if (riskMatch) riskLevel = riskMatch[1];
  if (recMatch) recommendation = recMatch[1];
  if (reasonMatch) reasoning = reasonMatch[1].trim();
  if (altMatch) alternative = altMatch[1].trim();

  return {
    riskLevel,
    recommendation,
    reasoning,
    alternative,
    daysUntilExpiry,
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * HELPER: Generate fallback analysis when AI unavailable
 */
function generateFallbackAnalysis(daysUntilExpiry, quantity) {
  let riskLevel = 'GOOD';
  let recommendation = 'NONE';
  let reasoning = 'No immediate action needed.';
  let alternative = 'Monitor as expiry approaches.';

  if (daysUntilExpiry < 7) {
    riskLevel = 'CRITICAL';
    recommendation = 'TRANSFER';
    reasoning = `Only ${daysUntilExpiry} days until expiry. Urgent transfer recommended to prevent loss.`;
    alternative = 'If transfer fails: Apply discount or dispose.';
  } else if (daysUntilExpiry < 30) {
    riskLevel = 'NEAR_EXPIRY';
    recommendation = 'TRANSFER';
    reasoning = `${daysUntilExpiry} days until expiry. Plan transfer to another institution.`;
    alternative = 'If no partner available: Consider discount.';
  }

  return {
    riskLevel,
    recommendation,
    reasoning,
    alternative,
    daysUntilExpiry,
    analyzedAt: new Date().toISOString(),
    usingFallback: true,
  };
}

/**
 * HELPER: Extract JSON from text response
 */
function extractJSON(text) {
  try {
    // Try to find JSON in response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('❌ JSON parsing error:', error);
    return null;
  }
}

/**
 * HELPER: Calculate days until expiry
 */
export function calculateDaysToExpiry(expiryDate) {
  const expiry = new Date(expiryDate);
  const today = new Date();
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
}

/**
 * HELPER: Get risk badge color
 */
export function getRiskBadgeClass(riskLevel) {
  const map = {
    CRITICAL: 'badge-danger',
    NEAR_EXPIRY: 'badge-warning',
    GOOD: 'badge-good',
  };
  return map[riskLevel] || 'badge-neutral';
}

export default {
  analyzeExpiryRisk,
  parseNaturalLanguageRequest,
  calculateDaysToExpiry,
  getRiskBadgeClass,
};
