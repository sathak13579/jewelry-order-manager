import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { IOrder } from '../models/Order';

interface OrderCardProps {
  order: IOrder;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-800">{order.customerName}</h3>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          order.orderType === 'new' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Item Type:</span>
          <span className="text-sm font-medium">{order.itemType}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Price:</span>
          <span className="text-sm font-medium">${order.quotedPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Delivery Date:</span>
          <span className="text-sm font-medium">
            {format(new Date(order.deliveryDate), 'MMM dd, yyyy')}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <Link href={`/orders/${order._id}`}>
          <button className="btn btn-primary text-sm">View Details</button>
        </Link>
        <Link href={`/orders/${order._id}/print`}>
          <button className="btn btn-secondary text-sm">Print Receipt</button>
        </Link>
      </div>
    </div>
  );
};

export default OrderCard; 