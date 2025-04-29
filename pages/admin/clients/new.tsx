import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import ClientForm from '../../../components/ClientForm';
import { useAdminAuth } from '../../../lib/authClient';

export default function NewClient() {
  const { isLoggedIn } = useAdminAuth();
  const router = useRouter();
  
  const handleSuccess = () => {
    router.push('/admin/clients');
  };

  return (
    <Layout title="Add New Client | Jewelry Order Manager">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Client</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex justify-center">
            <div className="mt-8 w-full max-w-2xl">
              <ClientForm onSuccess={handleSuccess} />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
} 