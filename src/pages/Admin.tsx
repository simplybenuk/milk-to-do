
import React, { useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { AdminAccessGuard } from '@/components/admin/AdminAccessGuard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import useTaskStore from '@/stores/useTaskStore';
import { toast } from '@/hooks/use-toast';

const Admin = () => {
  const userId = useTaskStore((state) => state.userId);
  
  useEffect(() => {
    console.log('Admin page mounted, userId:', userId);
    // Add a toast to confirm the page has loaded
    toast({
      title: 'Admin Page',
      description: 'Admin dashboard is loading',
    });
  }, []);

  return (
    <AdminAccessGuard>
      <PageContainer>
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          <AdminDashboard userId={userId} />
        </div>
      </PageContainer>
    </AdminAccessGuard>
  );
};

export default Admin;
