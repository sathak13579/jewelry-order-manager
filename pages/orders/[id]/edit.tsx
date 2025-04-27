import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import OrderForm from '../../../components/OrderForm';
import { IOrder } from '../../../models/Order';
import React from 'react';


export default function EditOrder() {
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
        <button 
          onClick={() => router.back()} 
          className="mt-4 btn bg-gray-300 hover:bg-gray-400 text-gray-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Edit Order | Dad's Jewelry</title>
      </Head>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Order</h1>
          <OrderForm order={order} isEditing={true} />
        </div>
      </main>
    </div>
  );
} 