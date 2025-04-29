import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { isLoggedIn, getUserType } from '../lib/authClient';

export default function Home() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Check if user is already logged in, redirect them to the appropriate dashboard
  const checkAndRedirect = () => {
    if (isLoggedIn()) {
      setIsRedirecting(true);
      const userType = getUserType();
      
      if (userType === 'admin') {
        router.push('/admin/dashboard');
      } else if (userType === 'client') {
        router.push('/client/dashboard');
      } else {
        // If userType is not recognized, clear localStorage
        localStorage.clear();
        setIsRedirecting(false);
      }
    }
  };

  // Check on initial load
  if (typeof window !== 'undefined' && !isRedirecting) {
    checkAndRedirect();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>Jewelry Order Manager - SaaS Platform</title>
        <meta name="description" content="Manage jewelry orders and repairs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Jewelry Order Manager</h1>
          <p className="text-lg text-gray-600 mb-12">A comprehensive platform for jewelry businesses to manage orders and customer relationships</p>
          
          {isRedirecting ? (
            <div className="flex justify-center">
              <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <p className="text-gray-700 mb-4">Redirecting to your dashboard...</p>
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Admin Login Card */}
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Admin Portal</h2>
                <p className="text-gray-600 mb-6">Manage your clients, create new businesses, and oversee the entire platform.</p>
                <Link href="/admin/login">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Admin Login
                  </button>
                </Link>
              </div>
              
              {/* Client Login Card */}
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Business Portal</h2>
                <p className="text-gray-600 mb-6">Manage orders, track repairs, and maintain customer relationships for your jewelry business.</p>
                <Link href="/client/login">
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                    Business Login
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Jewelry Order Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 