import { useState } from 'react';
import Layout from '../../components/Layout';
// Remove direct imports of bcrypt-related code
// import { hashPassword } from '../../lib/auth';
// import dbConnect from '../../lib/mongodb';
// import User from '../../models/User';

// This page is for initial setup only - should be removed or secured in production
export default function SeedAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const createAdminUser = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      // Call the API endpoint instead of directly using bcrypt
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      setResult({ 
        success: data.success, 
        message: data.message
      });
    } catch (error: any) {
      setResult({ 
        success: false, 
        message: `Error: ${error.message}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Setup Admin Account | Jewelry Order Manager">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Initial Setup</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Create Admin Account
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>
                    This will create an initial admin account with default credentials.
                    Please change the password after first login.
                  </p>
                </div>

                {result && (
                  <div className={`mt-4 p-4 rounded-md ${
                    result.success 
                      ? 'bg-green-100 border border-green-400 text-green-700' 
                      : 'bg-red-100 border border-red-400 text-red-700'
                  }`}>
                    <p>{result.message}</p>
                  </div>
                )}

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={createAdminUser}
                    disabled={isLoading}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      isLoading 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                  >
                    {isLoading ? 'Creating...' : 'Create Admin Account'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Important:</strong> This page should be removed or secured after initial setup. It is intended for first-time setup only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
} 