import { Navigate, Outlet } from 'react-router';
import {useAuthStatus} from '../Hooks/useAuthStatus';

export default function PrivateRoute() {
    const {loggedIn, checkingStatus} = useAuthStatus(); 
    if (checkingStatus) {
        return <h3>Checking authentication status...</h3>
    }
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
}
