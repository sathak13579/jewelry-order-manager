import React, { useState } from 'react';
import { useRouter } from 'next/router';

type ClientFormProps = {
  initialData?: {
    _id?: string;
    businessName?: string;
    email?: string;
    active?: boolean;
  };
  onSuccess?: (data: any) => void;
};

const ClientForm = ({ initialData, onSuccess }: ClientFormProps) => {
  const router = useRouter();
  const isEditing = !!initialData?._id;
  
  const [businessName, setBusinessName] = useState(initialData?.businessName || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [password, setPassword] = useState('');
  const [active, setActive] = useState(initialData?.active !== false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      // Prepare request body
      const body: any = {
        businessName,
        email,
      };
      
      // Only include password for new clients or if it's being reset
      if (!isEditing || password) {
        body.password = password;
      }
      
      // Only include active status when editing
      if (isEditing) {
        body.active = active;
      }

      // API endpoint and method depend on whether we're creating or editing
      const endpoint = isEditing
        ? `/api/admin/clients/${initialData._id}`
        : '/api/admin/clients';
      
      const method = isEditing ? 'PUT' : 'POST';

      // Send request
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Operation failed');
      }

      // Handle success
      if (onSuccess) {
        onSuccess(data.data);
      } else {
        router.push('/admin/clients');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Client' : 'Create New Client'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="businessName" className="block text-gray-700 font-medium mb-2">
            Business Name
          </label>
          <input
            type="text"
            id="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            {isEditing ? 'New Password (leave blank to keep current)' : 'Password'}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={!isEditing}
          />
        </div>
        
        {isEditing && (
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">Active</span>
            </label>
          </div>
        )}
        
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin/clients')}
            className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-600 text-white py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isLoading
              ? isEditing
                ? 'Saving...'
                : 'Creating...'
              : isEditing
                ? 'Save Changes'
                : 'Create Client'
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm; 