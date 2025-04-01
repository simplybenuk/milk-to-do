
import React, { useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import useTaskStore from '@/stores/useTaskStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Shield } from 'lucide-react';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const userId = useTaskStore((state) => state.userId);
  const navigate = useNavigate();
  const { isAdmin, isLoading, error } = useAdminCheck(userId);
  
  useEffect(() => {
    console.log('Admin page - Current userId:', userId);
    console.log('Admin page - isAdmin:', isAdmin);
    console.log('Admin page - isLoading:', isLoading);
    console.log('Admin page - error:', error);
    
    // Ensure we have a userId
    if (!userId) {
      // Check if we can get the user from Supabase
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          console.log('Admin page - Retrieved user ID from Supabase:', data.user.id);
          
          // Check if this user is actually an admin
          // Using .then().catch() pattern for proper promise handling
          supabase.rpc('is_admin', { 
            user_id: data.user.id 
          }).then(response => {
            console.log('Admin page - Direct is_admin check:', response);
          }).then(undefined, (error) => { // Using .then(undefined, errorHandler) instead of .catch
            console.error('Admin page - Error in direct admin check:', error);
          });
        } else {
          console.log('Admin page - No user found in Supabase session');
          toast({
            title: "Authentication Error",
            description: "Please sign in again to access this page",
            variant: "destructive"
          });
          navigate('/auth');
        }
      }).then(undefined, (error) => { // Using .then(undefined, errorHandler) instead of .catch
        console.error('Admin page - Error getting user:', error);
      });
    }
  }, [userId, navigate, isAdmin, isLoading, error]);
  
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-lg mb-4">Loading admin dashboard...</p>
          <p className="text-sm text-muted-foreground">Checking permissions for user: {userId || 'Loading user ID...'}</p>
        </div>
      </PageContainer>
    );
  }
  
  if (error) {
    console.error('Admin access check error:', error);
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error Checking Admin Status</h1>
          <p className="mb-6 text-center max-w-md">{error}</p>
          <div className="space-y-2">
            <Button onClick={() => navigate('/app')}>Return to Application</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </PageContainer>
    );
  }
  
  if (!isAdmin) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Shield className="h-8 w-8 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
          <p className="mb-6">You don't have permission to access the admin area.</p>
          <div className="space-y-2">
            <Button onClick={() => navigate('/app')}>Return to Application</Button>
            <Button 
              variant="outline" 
              onClick={() => {
                console.log('Performing manual admin check...');
                
                if (userId) {
                  // Using .then().then(undefined, errorHandler) pattern for proper promise handling
                  supabase.rpc('is_admin', { user_id: userId })
                    .then(response => {
                      console.log('Manual admin check result:', response);
                      
                      if (response.data === true) {
                        toast({
                          title: "Admin status confirmed",
                          description: "Please refresh to access the admin area",
                        });
                      }
                    })
                    .then(undefined, (err) => { // Using .then(undefined, errorHandler) instead of .catch
                      console.error('Error in manual admin check:', err);
                    });
                }
              }}
            >
              Check Admin Status
            </Button>
          </div>
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
