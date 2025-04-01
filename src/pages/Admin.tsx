
import React, { useEffect, useState } from 'react';
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
  const [manualCheckInProgress, setManualCheckInProgress] = useState(false);
  
  // Reset pointer events on mount/unmount
  useEffect(() => {
    console.log('Admin page - Component mounted');
    document.body.style.pointerEvents = "";
    
    return () => {
      console.log('Admin page - Component unmounted, resetting pointer events');
      document.body.style.pointerEvents = "";
    };
  }, []);
  
  useEffect(() => {
    console.log('Admin page - Status update:', { 
      userId, 
      isAdmin, 
      isLoading, 
      error 
    });
    
    // If we don't have a userId but we're not loading, try to get it directly
    if (!userId && !isLoading) {
      console.log('Admin page - No userId but not loading, checking Supabase directly');
      
      // Direct Supabase check as a fallback
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          console.log('Admin page - Found user via direct check:', data.user.id);
          
          // Direct admin check
          supabase.rpc('is_admin', { user_id: data.user.id })
            .then(response => {
              console.log('Admin page - Direct admin check result:', response);
              if (response.data === true) {
                toast({
                  title: "Admin status confirmed",
                  description: "Please refresh the page to access admin features",
                });
                setTimeout(() => window.location.reload(), 1500);
              }
            })
            .then(
              undefined,
              (error) => console.error('Admin page - Error checking admin status:', error)
            );
        } else {
          console.log('Admin page - No user found in direct check');
          toast({
            title: "Authentication Required",
            description: "Please sign in to continue",
            variant: "destructive"
          });
          navigate('/auth');
        }
      }).then(
        undefined,
        (error) => console.error('Admin page - Error getting user:', error)
      );
    }
  }, [userId, navigate, isAdmin, isLoading, error]);
  
  // If still loading, show loading state
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
  
  // If there's an error, show error state
  if (error) {
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
  
  // If not admin, show access denied
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
              disabled={manualCheckInProgress}
              onClick={() => {
                setManualCheckInProgress(true);
                console.log('Performing manual admin check...');
                
                if (userId) {
                  supabase.rpc('is_admin', { user_id: userId })
                    .then(response => {
                      console.log('Manual admin check result:', response);
                      setManualCheckInProgress(false);
                      
                      if (response.data === true) {
                        toast({
                          title: "Admin status confirmed",
                          description: "Please refresh to access the admin area",
                        });
                        // Force reload to refresh admin status
                        setTimeout(() => window.location.reload(), 1500);
                      } else {
                        toast({
                          title: "Not an admin",
                          description: "Your account does not have admin privileges",
                          variant: "destructive"
                        });
                      }
                    })
                    .then(
                      undefined, 
                      (err) => {
                        console.error('Error in manual admin check:', err);
                        setManualCheckInProgress(false);
                        toast({
                          title: "Error checking admin status",
                          description: err.message || "Please try again",
                          variant: "destructive"
                        });
                      }
                    );
                }
              }}
            >
              {manualCheckInProgress ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : 'Check Admin Status'}
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  // If admin, show admin dashboard
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
