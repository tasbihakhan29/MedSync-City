/**
 * Firebase Authentication Hook
 * Manages user login/registration/logout with Firebase Auth
 * Works alongside Spring Boot JWT for hybrid auth
 * 
 * Usage:
 * const { user, loading, loginWithEmail, registerWithEmail, logout } = useFirebaseAuth();
 */

import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import toast from 'react-hot-toast';

export function useFirebaseAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    console.log('👂 Listening for Firebase auth changes...');

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified
        };
        
        setUser(userData);
        localStorage.setItem('firebaseUser', JSON.stringify(userData));
        console.log('✅ User authenticated:', firebaseUser.email);
      } else {
        // User is logged out
        setUser(null);
        localStorage.removeItem('firebaseUser');
        console.log('❌ User not authenticated');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Register new user with email/password
   */
  const registerWithEmail = async (email, password, displayName = '') => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔐 Registering user:', email);
      
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Set display name if provided
      if (displayName) {
        await updateProfile(firebaseUser, { displayName });
        console.log('✅ Display name set:', displayName);
      }
      
      toast.success('✅ Account created! Logging you in...');
      setLoading(false);
      return firebaseUser;
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      // User-friendly error messages
      let message = 'Registration failed';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Email already registered';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password too weak (min 6 characters)';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      }
      
      setError(message);
      toast.error(message);
      setLoading(false);
      return null;
    }
  };

  /**
   * Login with email/password
   */
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔓 Logging in user:', email);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      toast.success('✅ Logged in successfully!');
      setLoading(false);
      return firebaseUser;
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // User-friendly error messages
      let message = 'Login failed';
      if (error.code === 'auth/user-not-found') {
        message = 'User not found';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Wrong password';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email';
      } else if (error.code === 'auth/user-disabled') {
        message = 'Account disabled';
      }
      
      setError(message);
      toast.error(message);
      setLoading(false);
      return null;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🚪 Logging out user');
      
      await signOut(auth);
      
      // Clear local storage
      localStorage.removeItem('firebaseUser');
      localStorage.removeItem('token'); // Clear Spring Boot JWT too
      
      toast.success('Logged out');
      setLoading(false);
    } catch (error) {
      console.error('❌ Logout error:', error);
      setError('Logout failed');
      toast.error('Logout failed');
      setLoading(false);
    }
  };

  /**
   * Get Firebase ID token (for backend verification)
   */
  const getIdToken = async () => {
    if (!auth.currentUser) return null;
    
    try {
      return await auth.currentUser.getIdToken(true);
    } catch (error) {
      console.error('❌ Error getting ID token:', error);
      return null;
    }
  };

  return {
    user,
    loading,
    error,
    loginWithEmail,
    registerWithEmail,
    logout,
    getIdToken,
    isAuthenticated: !!user
  };
}

export default useFirebaseAuth;
