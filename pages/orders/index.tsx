import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import OrderCard from '../../components/OrderCard';
import { useClientAuth, getAuthHeader } from '../../lib/authClient';

export default function OrdersList() {
  const { isLoggedIn } = useClientAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn]);

  // Filter orders by search term and status
  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.itemType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.notes && order.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout title="Orders | Jewelry Order Manager">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <Link href="/orders/new">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                + New Order
              </button>
            </Link>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Filters */}
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Search */}
                  <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                      Search
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        id="search"
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md px-4 py-2"
                        placeholder="Search by customer name, item type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Status Filter */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="mt-8">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white h-64 rounded-lg shadow"></div>
                  ))}
                </div>
              ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                  {orders.length === 0 ? (
                    <>
                      <p className="text-gray-500 mb-4">No orders found</p>
                      <Link href="/orders/new">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none">
                          Create your first order
                        </button>
                      </Link>
                    </>
                  ) : (
                    <p className="text-gray-500">
                      No orders match your filters. Try adjusting your search criteria.
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrders.map((order: any) => (
                    <OrderCard key={order._id} order={order} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}