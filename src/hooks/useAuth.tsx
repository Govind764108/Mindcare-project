import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  updatePassword,
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  createdAt?: any;
}

import React, { createContext, useContext } from 'react';

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            setProfile({ uid: currentUser.uid, email: currentUser.email, displayName: currentUser.displayName });
          }
        } catch (err) {
          console.error("Failed to fetch user profile", err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

    const register = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase Auth profile
      await updateProfile(userCredential.user, { displayName: name });
      
      try {
        // Create user document in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email,
          displayName: name,
          createdAt: new Date()
        });
      } catch (dbErr) {
        console.warn("Could not save to Firestore (check rules), but auth succeeded.", dbErr);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateUserProfile = async (name: string) => {
    if (!user) throw new Error("No user logged in");
    try {
      await updateProfile(user, { displayName: name });
      
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { displayName: name });
      } catch (dbErr) {
        console.warn("Could not update Firestore (check rules), but auth update succeeded.", dbErr);
      }
      
      setProfile(prev => prev ? { ...prev, displayName: name } : null);
    } catch (err: any) {
      throw err;
    }
  };

  const changeUserPassword = async (newPassword: string) => {
    if (!user) throw new Error("No user logged in");
    try {
      await updatePassword(user, newPassword);
    } catch (err: any) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      setUser(null); // Force clear if auth fails
    }
  };

  const bypassLogin = () => {
    setUser({ uid: 'guest-123', email: 'guest@example.com', displayName: 'Guest User' } as any);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, login, register, logout, bypassLogin, updateUserProfile, changeUserPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
