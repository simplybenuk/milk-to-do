
import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
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
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Simple, direct admin check
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!userId) {
        console.log('Admin page - No userId available');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Admin page - Checking admin status for userId:', userId);
        const { data, error } = await supabase.rpc('is_admin', { user_id: userId });
        
        if (error) {
          console.error('Admin page - Error checking admin status:', error);
          toast({
            title: 'Error checking admin access',
            description: error.message,
            variant: 'destructive',
          });
          setIsAdmin(false);
        } else {
          const hasAccess = !!data;
          setIsAdmin(hasAccess);
          
          if (hasAccess) {
            toast({
              title: 'Admin Access',
              description: 'Welcome to the admin dashboard',
            });
          }
        }
      } catch (error) {
        console.error('Admin page - Exception in admin check:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [userId]);

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
