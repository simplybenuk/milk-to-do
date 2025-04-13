
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PageContainer } from '@/components/layout/PageContainer';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const Admin = () => {
  const navigate = useNavigate();

  // Use React Query to fetch and cache user roles
  const { data: userRoles, isLoading, error } = useQuery({
    queryKey: ['userRoles'],
    queryFn: async () => {
      try {
        // First get the current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          throw new Error('Authentication required');
        }

        // Then query for the user's roles
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select(`
            role_id,
            roles:roles(name)
          `)
          .eq('user_id', user.id);
        
        if (roleError) {
          console.error('Error fetching user roles:', roleError);
          throw new Error('Failed to fetch user roles');
        }

        // Extract role names from the nested structure
        const roles = roleData?.map(item => item.roles?.name as string) || [];
        console.log('User roles:', roles);
        
        return {
          userId: user.id,
          roles: roles
        };
      } catch (err) {
        console.error('Error in role verification:', err);
        throw err;
      }
    },
    retry: 1,
    meta: {
      onError: (err: Error) => {
        console.error('Role query error:', err);
        toast.error('Failed to verify your access rights');
        navigate('/', { replace: true });
      }
    }
  });

  // Handle errors outside the query with useEffect
  useEffect(() => {
    if (error) {
      console.error('Role query error:', error);
      toast.error('Failed to verify your access rights');
      navigate('/', { replace: true });
    }
  }, [error, navigate]);

  // Determine if user has admin role
  const isAdmin = userRoles?.roles.includes('admin');

  // Redirect if roles are loaded and user is not an admin
  useEffect(() => {
    if (!isLoading && userRoles && !isAdmin) {
      toast.error('Access denied. You do not have administrator privileges.');
      navigate('/', { replace: true });
    }
  }, [isLoading, isAdmin, userRoles, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <PageContainer inFocusMode={false}>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-60" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      </PageContainer>
    );
  }

  // If there was an error or user is not admin, show access denied
  if (error || !isAdmin) {
    return (
      <PageContainer inFocusMode={false}>
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 py-8">
              <Shield className="h-16 w-16 text-red-500" />
              <h1 className="text-2xl font-bold text-center">Access Denied</h1>
              <p className="text-center">You don't have permission to access this page.</p>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  // Only render admin dashboard when user is confirmed as admin
  return (
    <PageContainer inFocusMode={false}>
      <div className="space-y-8 py-4">
        <AdminHeader />
        <AdminUsers />
      </div>
    </PageContainer>
  );
};

export default Admin;
