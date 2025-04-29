import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAdminAuth, getAuthHeader } from '../../lib/authClient';
import Link from 'next/link';

export default function AdminDashboard() {
  const { isLoggedIn } = useAdminAuth();
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    inactiveClients: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      if (!isLoggedIn) return;
      
      try {
        setIsLoading(true);
        const authHeader = getAuthHeader();
        const res = await fetch('/api/admin/clients', {
          headers: {
            ...authHeader,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch clients');
        }

        const { data } = await res.json();
        
        // Calculate stats
        const total = data.length;
        const active = data.filter((client: any) => client.active).length;
        const inactive = total - active;

        setStats({
          totalClients: total,
          activeClients: active,
          inactiveClients: inactive,
        });

      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [isLoggedIn]);

  return (
    <Layout title="Admin Dashboard | Jewelry Order Manager">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Stats Section */}
            <div className="mt-8">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Platform Statistics
                  </h3>
                  
                  {isLoading ? (
                    <div className="mt-5 animate-pulse">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
                        ))}
                      </div>
                    </div>
                  ) : error ? (
                    <div className="mt-5">
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-blue-100 rounded-lg p-6">
                          <dt className="text-sm font-medium text-blue-500 truncate">
                            Total Clients
                          </dt>
                          <dd className="mt-1 text-3xl font-semibold text-blue-900">
                            {stats.totalClients}
                          </dd>
                        </div>

                        <div className="bg-green-100 rounded-lg p-6">
                          <dt className="text-sm font-medium text-green-500 truncate">
                            Active Clients
                          </dt>
                          <dd className="mt-1 text-3xl font-semibold text-green-900">
                            {stats.activeClients}
                          </dd>
                        </div>

                        <div className="bg-red-100 rounded-lg p-6">
                          <dt className="text-sm font-medium text-red-500 truncate">
                            Inactive Clients
                          </dt>
                          <dd className="mt-1 text-3xl font-semibold text-red-900">
                            {stats.inactiveClients}
                          </dd>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Quick Actions
                  </h3>
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Link href="/admin/clients/new">
                      <div className="bg-blue-50 hover:bg-blue-100 rounded-lg p-6 cursor-pointer transition duration-150">
                        <h4 className="text-blue-800 font-medium">Create New Client</h4>
                        <p className="mt-2 text-sm text-blue-600">
                          Add a new jewelry business to the platform
                        </p>
                      </div>
                    </Link>
                    
                    <Link href="/admin/clients">
                      <div className="bg-green-50 hover:bg-green-100 rounded-lg p-6 cursor-pointer transition duration-150">
                        <h4 className="text-green-800 font-medium">Manage Clients</h4>
                        <p className="mt-2 text-sm text-green-600">
                          View and manage all clients on the platform
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
} 