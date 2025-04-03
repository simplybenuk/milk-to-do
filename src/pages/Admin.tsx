
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PageContainer } from '@/components/layout/PageContainer';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminRoles } from '@/components/admin/AdminRoles';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          throw new Error('Not authenticated');
        }
        
        // Check if user has admin role using the is_admin function
        const { data, error } = await supabase.rpc('is_admin', {
          user_id: user.id
        });
        
        if (error) {
          console.error('Error checking admin status:', error);
          throw new Error('Error checking admin status');
        }
        
        // If user is not an admin, redirect them immediately
        if (!data) {
          toast.error('Access denied. You do not have administrator privileges.');
          navigate('/', { replace: true });
          setIsAdmin(false);
          return;
        }
        
        // User is an admin, set state
        setIsAdmin(true);
      } catch (error) {
        console.error('Admin check error:', error);
        toast.error('Authentication error. Please try again.');
        setIsAdmin(false);
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminRole();
  }, [navigate]);

  if (loading) {
    return (
      <PageContainer inFocusMode={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-lg">Loading admin dashboard...</p>
        </div>
      </PageContainer>
    );
  }

  // If not admin and not loading, show access denied
  // This is a fallback in case the redirect didn't happen
  if (isAdmin === false) {
    return (
      <PageContainer inFocusMode={false}>
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold text-center">Access Denied</h1>
            <p className="text-center mt-4">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer inFocusMode={false}>
      <div className="space-y-8 py-4">
        <AdminHeader />
        <AdminUsers />
        <AdminRoles />
      </div>
    </PageContainer>
  );
};

export default Admin;
