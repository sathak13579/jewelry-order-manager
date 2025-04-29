import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getUserType, logout, getClientUserData } from '../lib/authClient';

type HeaderProps = {
  isLoggedIn: boolean;
};

const Header: React.FC<HeaderProps> = ({ isLoggedIn }) => {
  const router = useRouter();
  const userType = getUserType();
  const clientData = userType === 'client' ? getClientUserData() : null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={isLoggedIn ? (userType === 'admin' ? '/admin/dashboard' : '/client/dashboard') : '/'}>
                <span className="font-bold text-xl text-blue-600 cursor-pointer">Jewelry Order Manager</span>
              </Link>
            </div>
            
            {isLoggedIn && (
              <nav className="ml-6 flex space-x-8">
                {userType === 'admin' ? (
                  <>
                    <Link href="/admin/dashboard">
                      <span className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                        router.pathname === '/admin/dashboard' 
                          ? 'border-blue-500 text-gray-900' 
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } text-sm font-medium cursor-pointer`}>
                        Dashboard
                      </span>
                    </Link>
                    <Link href="/admin/clients">
                      <span className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                        router.pathname.startsWith('/admin/clients') 
                          ? 'border-blue-500 text-gray-900' 
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } text-sm font-medium cursor-pointer`}>
                        Clients
                      </span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/client/dashboard">
                      <span className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                        router.pathname === '/client/dashboard' 
                          ? 'border-blue-500 text-gray-900' 
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } text-sm font-medium cursor-pointer`}>
                        Dashboard
                      </span>
                    </Link>
                    <Link href="/orders/new">
                      <span className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                        router.pathname === '/orders/new' 
                          ? 'border-blue-500 text-gray-900' 
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } text-sm font-medium cursor-pointer`}>
                        New Order
                      </span>
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>
          
          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-4">
                  {userType === 'admin' ? 'Admin' : clientData?.businessName}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link href="/admin/login">
                  <button className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none">
                    Admin Login
                  </button>
                </Link>
                <Link href="/client/login">
                  <button className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200 focus:outline-none">
                    Business Login
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 