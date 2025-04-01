
import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { AdminAccessGuard } from '@/components/admin/AdminAccessGuard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import useTaskStore from '@/stores/useTaskStore';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const Admin = () => {
  const userId = useTaskStore((state) => state.userId);
  const navigate = useNavigate();
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  // Perform direct admin check on page load for debugging
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!userId) {
        console.log('Admin page - No userId available');
        toast({
          title: 'Admin Access Error',
          description: 'User ID not available. Please log in and try again.',
          variant: 'destructive',
        });
        setIsCheckingAdmin(false);
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
          setIsAdmin(false);
          setIsCheckingAdmin(false);
          return;
        }
        
        console.log('Admin page - Direct admin check result:', data);
        setIsAdmin(!!data);
        
        toast({
          title: 'Admin Status Check',
          description: data ? 'You have admin privileges' : 'You do not have admin privileges',
          variant: data ? 'default' : 'destructive',
        });
      } catch (error) {
        console.error('Admin page - Exception in admin check:', error);
        setIsAdmin(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    };
    
    checkAdminStatus();
    
    toast({
      title: 'Admin Page Loading',
      description: 'User ID: ' + (userId || 'Not logged in'),
    });
  }, [userId]);

  if (isCheckingAdmin) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-lg mb-4">Checking admin privileges...</p>
        </div>
      </PageContainer>
    );
  }
  
  if (isAdmin === false) {
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
