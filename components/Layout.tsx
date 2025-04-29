import React, { ReactNode } from 'react';
import Head from 'next/head';
import Header from './Header';
import { isLoggedIn } from '../lib/authClient';

type LayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Jewelry Order Manager',
  description = 'Manage jewelry orders and repairs'
}) => {
  // Check login status for header display
  const loggedIn = isLoggedIn();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={loggedIn} />

      <main className="flex-grow">
        {children}
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
};

export default Layout; 