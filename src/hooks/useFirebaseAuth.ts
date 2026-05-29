import { useState, useEffect } from 'react';

export interface FirebaseUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export function useFirebaseAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase is loaded asynchronously in index.html
    // We listen for the auth state via a custom event
    const handleAuthChange = (e: CustomEvent) => {
      setUser(e.detail);
      setLoading(false);
    };
    window.addEventListener('authStateChanged' as any, handleAuthChange);

    // Also check if already set
    const w = window as any;
    if (w.currentUser !== undefined) {
      setUser(w.currentUser);
      setLoading(false);
    } else {
      // Give Firebase a moment to initialize
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('authStateChanged' as any, handleAuthChange);
      };
    }

    return () => {
      window.removeEventListener('authStateChanged' as any, handleAuthChange);
    };
  }, []);

  const signIn = async () => {
    const w = window as any;
    if (w.signInWithGoogle) await w.signInWithGoogle();
  };

  const signOut = async () => {
    const w = window as any;
    if (w.doSignOut) await w.doSignOut();
    setUser(null);
  };

  return { user, loading, signIn, signOut };
}
