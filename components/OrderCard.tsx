import React from 'react';
import Link from 'next/link';
import { Order } from '../types/Order';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to format status label
  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg hover:shadow-md transition-shadow duration-200">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Order #{order.orderNumber || order._id?.substring(0, 8)}
          </h3>
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
            {formatStatus(order.status)}
          </span>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Placed on {formatDate(order.createdAt)}
        </p>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Customer</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {order.customerName}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Contact</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {order.customerEmail}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Items</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Total</dt>
            <dd className="mt-1 text-sm text-gray-900">
              ${order.totalAmount?.toFixed(2) || 'N/A'}
            </dd>
          </div>
        </dl>
        <div className="mt-4 flex justify-end">
          <Link 
            href={`/orders/${order._id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCard; 