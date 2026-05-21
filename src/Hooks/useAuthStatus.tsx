import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

interface AuthStatus {
  loggedIn: boolean;
  checkingStatus: boolean;
}

export function useAuthStatus(): AuthStatus {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
      setCheckingStatus(false);
    });

    return () => unsubscribe();
  }, []);

  return { loggedIn, checkingStatus };
}