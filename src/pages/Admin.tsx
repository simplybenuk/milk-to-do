
import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { AdminAccessGuard } from '@/components/admin/AdminAccessGuard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import useTaskStore from '@/stores/useTaskStore';

const Admin = () => {
  const userId = useTaskStore((state) => state.userId);

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
