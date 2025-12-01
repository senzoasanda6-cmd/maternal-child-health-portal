import { useState, useEffect } from 'react';

// Minimal useAuth hook used as a fallback when a more
// complete auth solution isn't available in the frontend.
// It attempts to read a user object from `window.__MCH_USER__`
// or from `localStorage` keys `mch_user` / `user`.
export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadUser = () => {
      try {
        if (typeof window === 'undefined') return null;

        if (window.__MCH_USER__) return window.__MCH_USER__;

        const raw = localStorage.getItem('mch_user') || localStorage.getItem('user');
        if (raw) return JSON.parse(raw);
      } catch (e) {
        // ignore parse errors
      }
      return null;
    };

    const u = loadUser();
    if (mounted) {
      setUser(u);
      setLoading(false);
    }

    return () => { mounted = false; };
  }, []);

  return { user, loading };
}
