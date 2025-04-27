import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IOrder } from '../models/Order';

interface OrderFormProps {
  order?: Partial<IOrder>;
  isEditing?: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({ order, isEditing = false }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  const [formData, setFormData] = useState({
    customerName: '',
    orderType: 'new',
    itemType: '',
    quotedPrice: '',
    goldWeightGrams: '',
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    notes: ''
  });

  useEffect(() => {
    if (order) {
      const orderData = {
        customerName: order.customerName || '',
        orderType: order.orderType || 'new',
        itemType: order.itemType || '',
        quotedPrice: order.quotedPrice?.toString() || '',
        goldWeightGrams: order.goldWeightGrams?.toString() || '',
        orderDate: order.orderDate ? new Date(order.orderDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        deliveryDate: order.deliveryDate ? new Date(order.deliveryDate).toISOString().split('T')[0] : '',
        notes: order.notes || ''
      };
      setFormData(orderData);
    }
  }, [order]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    // Validate form
    if (!formData.customerName || !formData.itemType || !formData.quotedPrice || !formData.deliveryDate) {
      setFormError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const orderData = {
        ...formData,
        quotedPrice: parseFloat(formData.quotedPrice),
        goldWeightGrams: formData.goldWeightGrams ? parseFloat(formData.goldWeightGrams) : undefined,
      };

      const url = isEditing 
        ? `/api/orders/${order?._id}` 
        : '/api/orders';
      
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        throw new Error('Failed to save order');
      }

      router.push('/');
    } catch (error: any) {
      setFormError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="customerName" className="label">
            Customer Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="orderType" className="label">
            Order Type <span className="text-red-500">*</span>
          </label>
          <select
            id="orderType"
            name="orderType"
            value={formData.orderType}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="new">New Order</option>
            <option value="repair">Repair</option>
          </select>
        </div>

        <div>
          <label htmlFor="itemType" className="label">
            Item Type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="itemType"
            name="itemType"
            value={formData.itemType}
            onChange={handleChange}
            className="input"
            placeholder="e.g., Necklace, Bracelet, Ring"
            required
          />
        </div>

        <div>
          <label htmlFor="quotedPrice" className="label">
            Quoted Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="quotedPrice"
            name="quotedPrice"
            value={formData.quotedPrice}
            onChange={handleChange}
            className="input"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="goldWeightGrams" className="label">
            Gold Weight (grams)
          </label>
          <input
            type="number"
            id="goldWeightGrams"
            name="goldWeightGrams"
            value={formData.goldWeightGrams}
            onChange={handleChange}
            className="input"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="orderDate" className="label">
            Order Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="orderDate"
            name="orderDate"
            value={formData.orderDate}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="deliveryDate" className="label">
            Delivery Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="deliveryDate"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="label">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="input h-24"
          placeholder="Any additional details about the order"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn bg-gray-300 hover:bg-gray-400 text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Order' : 'Create Order'}
        </button>
      </div>
    </form>
  );
};

export default OrderForm; 