import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import OrderCard from '../components/OrderCard';
import { IOrder } from '../models/Order';
import React from 'react';


export default function Home() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        
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
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dad's Jewelry - Order Manager</title>
        <meta name="description" content="Manage jewelry orders and repairs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Jewelry Orders</h1>
          <Link href="/orders/new">
            <button className="btn btn-primary">
              + New Order
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 mb-4">No orders found</p>
            <Link href="/orders/new">
              <button className="btn btn-primary">
                Create your first order
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Dad's Jewelry. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 