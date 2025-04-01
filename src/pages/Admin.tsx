
import React, { useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { AdminAccessGuard } from '@/components/admin/AdminAccessGuard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import useTaskStore from '@/stores/useTaskStore';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const userId = useTaskStore((state) => state.userId);
  
  // Perform direct admin check on page load for debugging
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!userId) {
        console.log('Admin page - No userId available');
        return;
      }
      
      try {
        console.log('Admin page - Checking admin status directly for userId:', userId);
        const { data, error } = await supabase.rpc('is_admin', { user_id: userId });
        
        if (error) {
          console.error('Admin page - Error checking admin status:', error);
          toast({
            title: 'Error in Admin Check',
            description: error.message,
            variant: 'destructive',
          });
          return;
        }
        
        console.log('Admin page - Direct admin check result:', data);
        toast({
          title: 'Admin Status Check',
          description: data ? 'You have admin privileges' : 'You do not have admin privileges',
          variant: data ? 'default' : 'destructive',
        });
      } catch (error) {
        console.error('Admin page - Exception in admin check:', error);
      }
    };
    
    checkAdminStatus();
    
    toast({
      title: 'Admin Page Loading',
      description: 'User ID: ' + (userId || 'Not logged in'),
    });
  }, [userId]);

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
