import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import OrderCard from '../../components/OrderCard';
import { useClientAuth, getClientUserData, getAuthHeader } from '../../lib/authClient';

export default function ClientDashboard() {
  const { isLoggedIn, userData } = useClientAuth();
  const clientData = getClientUserData();
  
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoggedIn) return;
      
      try {
        setIsLoading(true);
        const authHeader = getAuthHeader();
        const res = await fetch('/api/orders', {
          headers: {
            ...authHeader,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch orders');
        }

        const { data } = await res.json();
        setOrders(data);
        
        // Calculate stats
        const total = data.length;
        const pending = data.filter((order: any) => 
          ['pending', 'in_progress'].includes(order.status)
        ).length;
        const completed = data.filter((order: any) => 
          ['completed', 'delivered'].includes(order.status)
        ).length;

        setStats({
          totalOrders: total,
          pendingOrders: pending,
          completedOrders: completed,
        });
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn]);

  // Get the 5 most recent orders
  const recentOrders = orders.slice(0, 5);

  return (
    <Layout title={`${clientData?.businessName || 'Business'} Dashboard | Jewelry Order Manager`}>
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {clientData?.businessName || 'Business'} Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Stats Section */}
            <div className="mt-8">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Order Statistics
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
                            Total Orders
                          </dt>
                          <dd className="mt-1 text-3xl font-semibold text-blue-900">
                            {stats.totalOrders}
                          </dd>
                        </div>

                        <div className="bg-yellow-100 rounded-lg p-6">
                          <dt className="text-sm font-medium text-yellow-500 truncate">
                            Pending Orders
                          </dt>
                          <dd className="mt-1 text-3xl font-semibold text-yellow-900">
                            {stats.pendingOrders}
                          </dd>
                        </div>

                        <div className="bg-green-100 rounded-lg p-6">
                          <dt className="text-sm font-medium text-green-500 truncate">
                            Completed Orders
                          </dt>
                          <dd className="mt-1 text-3xl font-semibold text-green-900">
                            {stats.completedOrders}
                          </dd>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="mt-8">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Recent Orders
                  </h3>
                  <Link href="/orders">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      View All
                    </button>
                  </Link>
                </div>
                <div className="border-t border-gray-200">
                  {isLoading ? (
                    <div className="px-4 py-5 sm:p-6 animate-pulse">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="mb-4 bg-gray-200 h-24 rounded-lg"></div>
                      ))}
                    </div>
                  ) : error ? (
                    <div className="px-4 py-5 sm:p-6">
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                      </div>
                    </div>
                  ) : recentOrders.length === 0 ? (
                    <div className="px-4 py-5 sm:p-6 text-center">
                      <p className="text-gray-500 mb-4">No orders found</p>
                      <Link href="/orders/new">
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          Create your first order
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="px-4 py-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recentOrders.map((order: any) => (
                        <OrderCard key={order._id} order={order} />
                      ))}
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
                    <Link href="/orders/new">
                      <div className="bg-blue-50 hover:bg-blue-100 rounded-lg p-6 cursor-pointer transition duration-150">
                        <h4 className="text-blue-800 font-medium">Create New Order</h4>
                        <p className="mt-2 text-sm text-blue-600">
                          Add a new jewelry order or repair request
                        </p>
                      </div>
                    </Link>
                    
                    <Link href="/orders">
                      <div className="bg-green-50 hover:bg-green-100 rounded-lg p-6 cursor-pointer transition duration-150">
                        <h4 className="text-green-800 font-medium">View All Orders</h4>
                        <p className="mt-2 text-sm text-green-600">
                          See and manage all your jewelry orders
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