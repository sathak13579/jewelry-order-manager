import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import ClientForm from '../../../components/ClientForm';
import { useAdminAuth, getAuthHeader } from '../../../lib/authClient';

export default function EditClient() {
  const { isLoggedIn } = useAdminAuth();
  const router = useRouter();
  const { id } = router.query;
  
  const [client, setClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClient = async () => {
      if (!id || !isLoggedIn) return;
      
      try {
        setIsLoading(true);
        const authHeader = getAuthHeader();
        const res = await fetch(`/api/admin/clients/${id}`, {
          headers: {
            ...authHeader,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch client');
        }

        const { data } = await res.json();
        setClient(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [id, isLoggedIn]);

  const handleSuccess = () => {
    router.push('/admin/clients');
  };

  return (
    <Layout title="Edit Client | Jewelry Order Manager">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Client {client?.businessName && `- ${client.businessName}`}
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex justify-center">
            <div className="mt-8 w-full max-w-2xl">
              {isLoading ? (
                <div className="animate-pulse bg-white rounded-lg shadow p-8 h-96"></div>
              ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              ) : client ? (
                <ClientForm initialData={client} onSuccess={handleSuccess} />
              ) : (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                  Client not found
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
} 