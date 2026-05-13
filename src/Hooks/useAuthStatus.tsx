import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface AuthStatus {
  loggedIn: boolean;
  checkingStatus: boolean;
}

export function useAuthStatus(): AuthStatus {
  let loggedIn = false;
  let checkingStatus = true;

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      loggedIn = true;
    }
    checkingStatus = false;
  });

  return { loggedIn, checkingStatus };
}