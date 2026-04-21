import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
    const [pageState, setPageState] = React.useState("Sign In");
    const location = useLocation();
    const navigate = useNavigate();
    const auth = getAuth();
    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setPageState("Profile");
            } else {
                setPageState("Sign In");
            }
        })
    }, [auth.currentUser]);


    function pathMatchRoute(route: string) {
        if (route === location.pathname) {
        return true;
        }
    }
    return (
        <div className='bg-white border-b-gray-300 shadow-sm sticky top-0 z-50'>
        <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
            <div>
                <img src="https://static.rdc.moveaws.com/rdc-ui/logos/logo-brand.svg" alt='Site image'className='h-5 cursor-pointer' onClick={() => navigate('/')} />
            </div>
            <div className='flex'>
                <ul className='flex space-x-10'>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute("/") && "text-black! border-b-red-500!"} `} onClick={() => navigate('/')}>Home</li>

                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute("/offers") && "text-black! border-b-red-500!"}`} onClick={() => navigate('/offers')}>Offers</li>

                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) && "text-black! border-b-red-500!"}`} onClick={() => navigate('/profile')}>{pageState}</li>
                </ul>
            </div>
        </header>
        </div>
    )
}
