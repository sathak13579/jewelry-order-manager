import React, { forwardRef } from 'react';
import { format } from 'date-fns';
import { IOrder } from '../models/Order';

interface OrderReceiptProps {
  order: IOrder;
}

const OrderReceipt = forwardRef<HTMLDivElement, OrderReceiptProps>(({ order }, ref) => {
  if (!order) return null;

  return (
    <div ref={ref} className="w-full max-w-2xl mx-auto p-8 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Dad's Jewelry</h1>
        <p className="text-gray-600">Fine Jewelry & Repairs</p>
        <p className="text-gray-600">123 Jewelry Lane, Sparkle City</p>
        <p className="text-gray-600">Tel: (555) 123-4567</p>
      </div>

      <div className="border-t border-b border-gray-300 py-4 my-6">
        <h2 className="text-xl font-bold text-center">
          {order.orderType === 'new' ? 'Order Receipt' : 'Repair Receipt'}
        </h2>
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Receipt No:</span>
          <span>{order._id.substring(order._id.length - 6)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Date:</span>
          <span>{format(new Date(order.orderDate), 'MMM dd, yyyy')}</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">Customer Information</h3>
        <p className="mb-1">
          <span className="font-semibold">Name:</span> {order.customerName}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">Order Details</h3>
        <div className="border border-gray-300">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-300">
                <td className="py-2 px-4">Item Type</td>
                <td className="py-2 px-4 text-right">{order.itemType}</td>
              </tr>
              {order.goldWeightGrams && (
                <tr className="border-t border-gray-300">
                  <td className="py-2 px-4">Gold Weight</td>
                  <td className="py-2 px-4 text-right">{order.goldWeightGrams} grams</td>
                </tr>
              )}
              <tr className="border-t border-gray-300">
                <td className="py-2 px-4">Order Type</td>
                <td className="py-2 px-4 text-right">{order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}</td>
              </tr>
              <tr className="border-t border-gray-300">
                <td className="py-2 px-4 font-bold">Total</td>
                <td className="py-2 px-4 text-right font-bold">${order.quotedPrice.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">Expected Delivery</h3>
        <p>{format(new Date(order.deliveryDate), 'MMMM dd, yyyy')}</p>
      </div>

      {order.notes && (
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Notes</h3>
          <p className="text-gray-700">{order.notes}</p>
        </div>
      )}

      <div className="border-t border-gray-300 pt-6 mt-8 text-center text-gray-500 text-sm">
        <p>Thank you for your business!</p>
        <p>This receipt is proof of purchase and must be presented when collecting your order.</p>
      </div>
    </div>
  );
});

OrderReceipt.displayName = 'OrderReceipt';

export default OrderReceipt; 