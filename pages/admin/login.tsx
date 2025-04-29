import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LoginForm from '../../components/LoginForm';
import { isLoggedIn, getUserType } from '../../lib/authClient';

export default function AdminLogin() {
  const router = useRouter();

  // Redirect to dashboard if already logged in as admin
  useEffect(() => {
    if (isLoggedIn() && getUserType() === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>Admin Login | Jewelry Order Manager</title>
        <meta name="description" content="Log in to manage your jewelry order platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
            <p className="mt-2 text-gray-600">Sign in to manage your SaaS platform</p>
          </div>
          <LoginForm isAdmin={true} />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Jewelry Order Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 