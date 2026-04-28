/**
 * Firebase Configuration
 * Simplified setup for MedSync - Analytics & Hosting only
 * 
 * Authentication: Spring Boot JWT + Supabase
 * Database: Supabase PostgreSQL
 * Firebase: Analytics & Hosting
 */

import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';

// Firebase config from .env
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

console.log('🔥 Initializing Firebase (Analytics & Hosting)...');

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional)
let analytics = null;
try {
  analytics = getAnalytics(app);
  console.log('✅ Firebase Analytics enabled');
} catch (error) {
  console.warn('⚠️ Firebase Analytics disabled (consent required)');
}

console.log('✅ Firebase initialized for project:', firebaseConfig.projectId);

/**
 * Track custom event in Firebase Analytics
 * @param {string} eventName - Name of event to track
 * @param {object} eventParams - Event parameters
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, eventParams);
      console.log(`📊 Event tracked: ${eventName}`, eventParams);
    } catch (error) {
      console.warn('⚠️ Failed to track event:', error);
    }
  } else {
    console.warn('⚠️ Analytics not initialized');
  }
};

/**
 * Track user action
 */
export const trackUserAction = (action, details = {}) => {
  trackEvent('user_action', {
    action,
    timestamp: new Date().toISOString(),
    ...details
  });
};

/**
 * Track page view
 */
export const trackPageView = (pageName, pageTitle = '') => {
  trackEvent('page_view', {
    page_name: pageName,
    page_title: pageTitle,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track feature usage
 */
export const trackFeatureUsage = (featureName, metadata = {}) => {
  trackEvent('feature_usage', {
    feature: featureName,
    timestamp: new Date().toISOString(),
    ...metadata
  });
};

/**
 * Track AI feature usage
 * @param {string} featureName - Name of AI feature (e.g., "expiry_analysis", "nl_form_filling")
 * @param {any} input - Input provided to AI feature
 * @param {any} output - Output/result from AI feature
 */
export const trackAIFeature = (featureName, input, output) => {
  trackEvent('ai_feature_usage', {
    feature: featureName,
    input_type: typeof input,
    output_type: typeof output,
    timestamp: new Date().toISOString(),
    success: !!output
  });
  console.log(`🤖 AI Feature tracked: ${featureName}`, { input, output });
};

export { analytics };
export default app;
