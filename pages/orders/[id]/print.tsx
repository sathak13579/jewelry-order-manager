import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useReactToPrint } from 'react-to-print';
import OrderReceipt from '../../../components/OrderReceipt';
import { IOrder } from '../../../models/Order';
import React from 'react';


export default function PrintReceipt() {
  const router = useRouter();
  const { id } = router.query;
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
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

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `${order?.customerName || 'Customer'}_Receipt`,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading receipt...</p>
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
        <title>Print Receipt | Dad's Jewelry</title>
      </Head>

      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="no-print flex justify-between items-center mb-6">
          <button 
            onClick={() => router.back()} 
            className="btn bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            &larr; Back
          </button>
          <button 
            onClick={handlePrint} 
            className="btn btn-primary"
          >
            Print Receipt
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <OrderReceipt ref={receiptRef} order={order} />
        </div>
      </div>
    </div>
  );
} 