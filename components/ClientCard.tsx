import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

type ClientCardProps = {
  client: {
    _id: string;
    businessName: string;
    email: string;
    active: boolean;
    createdAt: string;
    dbName: string;
  };
  onResetPassword: (clientId: string) => void;
};

const ClientCard: React.FC<ClientCardProps> = ({ client, onResetPassword }) => {
  const createdDate = new Date(client.createdAt);
  
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {client.businessName}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{client.email}</p>
          </div>
          <span
            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
              client.active
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {client.active ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Created: {format(createdDate, 'MMM d, yyyy')}</p>
          <p className="mt-1">DB: {client.dbName}</p>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between">
        <div className="space-x-3">
          <Link href={`/admin/clients/${client._id}`}>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none">
              Edit
            </button>
          </Link>
          
          <button
            onClick={() => onResetPassword(client._id)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none"
          >
            Reset Password
          </button>
        </div>
        
        <Link 
          href={`/admin/clients/${client._id}/login`} 
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none"
        >
          Login as Client
        </Link>
      </div>
    </div>
  );
};

export default ClientCard; 