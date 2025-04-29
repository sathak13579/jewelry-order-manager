import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import ClientCard from '../../../components/ClientCard';
import ResetPasswordModal from '../../../components/ResetPasswordModal';
import { useAdminAuth, getAuthHeader } from '../../../lib/authClient';

export default function AdminClientsList() {
  const { isLoggedIn } = useAdminAuth();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Password Reset Modal state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  // Filtered clients based on search
  const filteredClients = clients.filter((client: any) => {
    const term = searchTerm.toLowerCase();
    return (
      client.businessName.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    const fetchClients = async () => {
      if (!isLoggedIn) return;
      
      try {
        setIsLoading(true);
        const authHeader = getAuthHeader();
        const res = await fetch('/api/admin/clients', {
          headers: {
            ...authHeader,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch clients');
        }

        const { data } = await res.json();
        setClients(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [isLoggedIn]);

  const handleResetPassword = (clientId: string) => {
    const client = clients.find((c: any) => c._id === clientId);
    setSelectedClient(client);
    setIsResetModalOpen(true);
  };

  const handleResetSuccess = () => {
    // Refresh client list after password reset
    const fetchClients = async () => {
      try {
        const authHeader = getAuthHeader();
        const res = await fetch('/api/admin/clients', {
          headers: {
            ...authHeader,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch clients');
        }

        const { data } = await res.json();
        setClients(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      }
    };

    fetchClients();
  };

  return (
    <Layout title="Manage Clients | Jewelry Order Manager">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Manage Clients</h1>
            <Link href="/admin/clients/new">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                + New Client
              </button>
            </Link>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Search Bar */}
            <div className="mt-4">
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  className="form-input block w-full sm:text-sm sm:leading-5 px-4 py-2 pr-10 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search clients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Clients List */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                // Loading Skeleton
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-lg shadow h-48"></div>
                ))
              ) : error ? (
                <div className="col-span-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              ) : filteredClients.length === 0 ? (
                <div className="col-span-full bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                  {searchTerm ? (
                    <p className="text-gray-500">No clients found matching "{searchTerm}"</p>
                  ) : (
                    <>
                      <p className="text-gray-500 mb-4">No clients found</p>
                      <Link href="/admin/clients/new">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none">
                          Create your first client
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              ) : (
                filteredClients.map((client: any) => (
                  <ClientCard
                    key={client._id}
                    client={client}
                    onResetPassword={handleResetPassword}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Reset Password Modal */}
      {selectedClient && (
        <ResetPasswordModal
          isOpen={isResetModalOpen}
          clientId={selectedClient._id}
          clientName={selectedClient.businessName}
          onClose={() => {
            setIsResetModalOpen(false);
            setSelectedClient(null);
          }}
          onSuccess={handleResetSuccess}
        />
      )}
    </Layout>
  );
} 