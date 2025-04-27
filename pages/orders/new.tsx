import Head from 'next/head';
import OrderForm from '../../components/OrderForm';
import React from 'react';


export default function NewOrder() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Create New Order | Dad's Jewelry</title>
        <meta name="description" content="Create a new jewelry order" />
      </Head>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Order</h1>
          <OrderForm />
        </div>
      </main>
    </div>
  );
} 