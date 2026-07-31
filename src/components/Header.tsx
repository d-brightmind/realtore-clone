import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [pageState, setPageState] = React.useState<string>("Sign In");
  const location = useLocation();
  const auth = getAuth();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setPageState(user ? "Profile" : "Sign In");
    });
    return () => unsubscribe();
  }, [auth]);

  function pathMatchRoute(route: string): boolean {
    return route === location.pathname;
  }

  return (
    <div className="bg-white border-b-gray-300 shadow-sm sticky top-0 z-50">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
        <div>
          <Link to="/">
            <img
              src="https://static.rdc.moveaws.com/rdc-ui/logos/logo-brand.svg"
              alt="Site home"
              className="h-5 cursor-pointer"
            />
          </Link>
        </div>
        <div className="flex">
          <ul className="flex space-x-10">
            <li>
              <Link
                to="/"
                className={`inline-block cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute("/") && "text-black! border-b-red-500!"}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/offers"
                className={`inline-block cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute("/offers") && "text-black! border-b-red-500!"}`}
              >
                Offers
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`inline-block cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) && "text-black! border-b-red-500!"}`}
              >
                {pageState}
              </Link>
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}