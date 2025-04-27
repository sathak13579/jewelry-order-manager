import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { format } from 'date-fns';
import { IOrder } from '../../../models/Order';

export default function OrderDetails() {
  const router = useRouter();
  const { id } = router.query;
  
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch order details');
        }
        
        const { data } = await res.json();
        setOrder(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete order');
      }

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button 
          onClick={() => router.back()} 
          className="mt-4 btn bg-gray-300 hover:bg-gray-400 text-gray-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Order not found
        </div>
        <Link href="/">
          <button className="mt-4 btn btn-primary">Go to Home</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{order.customerName}'s Order | Dad's Jewelry</title>
      </Head>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <button 
            onClick={() => router.back()} 
            className="btn bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            &larr; Back
          </button>
          <div className="space-x-3">
            <Link href={`/orders/${id}/edit`}>
              <button className="btn bg-blue-500 hover:bg-blue-600 text-white">
                Edit Order
              </button>
            </Link>
            <Link href={`/orders/${id}/print`}>
              <button className="btn btn-primary">
                Print Receipt
              </button>
            </Link>
            <button 
              onClick={handleDelete} 
              className="btn bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              order.orderType === 'new' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
              <p className="mb-2">
                <span className="font-medium">Name:</span> {order.customerName}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Order Information</h3>
              <p className="mb-2">
                <span className="font-medium">Item Type:</span> {order.itemType}
              </p>
              <p className="mb-2">
                <span className="font-medium">Quoted Price:</span> ${order.quotedPrice.toFixed(2)}
              </p>
              {order.goldWeightGrams && (
                <p className="mb-2">
                  <span className="font-medium">Gold Weight:</span> {order.goldWeightGrams} grams
                </p>
              )}
              <p className="mb-2">
                <span className="font-medium">Order Date:</span> {format(new Date(order.orderDate), 'MMMM dd, yyyy')}
              </p>
              <p className="mb-2">
                <span className="font-medium">Expected Delivery:</span> {format(new Date(order.deliveryDate), 'MMMM dd, yyyy')}
              </p>
            </div>
          </div>

          {order.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 