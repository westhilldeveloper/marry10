// This is a server component - no Firebase operations here
import AdminPanelClient from '@/components/Admin/AdminPanelClient';
import { Suspense } from 'react';

// Metadata for the page
export const metadata = {
  title: 'Admin Panel',
  description: 'Admin dashboard for managing content',
};

// Loading component
function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading admin panel...</p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminPanelClient />
    </Suspense>
  );
}