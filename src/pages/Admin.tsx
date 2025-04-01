
import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import useTaskStore from '@/stores/useTaskStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAdminCheck } from '@/hooks/useAdminCheck';

const Admin = () => {
  const userId = useTaskStore((state) => state.userId);
  const navigate = useNavigate();
  const { isAdmin, isLoading, error } = useAdminCheck(userId);
  
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-lg mb-4">Loading admin dashboard...</p>
        </div>
      </PageContainer>
    );
  }
  
  if (error) {
    console.error('Admin access check error:', error);
  }
  
  if (!isAdmin) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
          <p className="mb-6">You don't have permission to access the admin area.</p>
          <Button onClick={() => navigate('/app')}>Return to Application</Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <AdminDashboard userId={userId} />
      </div>
    </PageContainer>
  );
};

export default Admin;
