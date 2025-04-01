
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PageContainer } from '@/components/layout/PageContainer';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import useTaskStore from '@/stores/useTaskStore';
import { AdminAccessGuard } from '@/components/admin/AdminAccessGuard';
import { UserSubscriptionModal } from '@/components/admin/UserSubscriptionModal';
import { UserMakeAdminModal } from '@/components/admin/UserMakeAdminModal';
import { ActivityIndicator } from '@/components/admin/ActivityIndicator';

type UserWithDetails = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  profile: {
    subscription_status: string;
    subscription_updated_at: string;
  } | null;
  is_admin: boolean;
  task_count: number;
};

const Admin = () => {
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const userId = useTaskStore((state) => state.userId);

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Get all users
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      if (usersError) throw new Error(usersError.message);

      // Get all profiles with subscription status
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, subscription_status, subscription_updated_at');
      if (profilesError) throw new Error(profilesError.message);

      // Get task counts for all users
      const { data: taskCounts, error: tasksError } = await supabase
        .from('tasks')
        .select('owner_id, count')
        .groupBy('owner_id');
      if (tasksError) throw new Error(tasksError.message);

      // Get all admin users
      const { data: admins, error: adminsError } = await supabase
        .from('admin_roles')
        .select('user_id');
      if (adminsError) throw new Error(adminsError.message);

      // Map admin user IDs for easy lookup
      const adminMap = new Map();
      admins?.forEach(admin => adminMap.set(admin.user_id, true));

      // Map profiles by user ID for easy lookup
      const profileMap = new Map();
      profiles?.forEach(profile => profileMap.set(profile.id, profile));

      // Map task counts by owner ID for easy lookup
      const taskCountMap = new Map();
      taskCounts?.forEach(taskCount => taskCountMap.set(taskCount.owner_id, taskCount.count));

      // Combine data into a single array of users with details
      const usersWithDetails = users.users.map(user => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        profile: profileMap.get(user.id) || null,
        is_admin: adminMap.has(user.id),
        task_count: taskCountMap.get(user.id) || 0
      }));

      return usersWithDetails;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const handleUpdateSubscription = async (userId: string, status: 'free' | 'pro') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          subscription_status: status,
          subscription_updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: 'Subscription Updated',
        description: `User subscription status updated to ${status}`,
      });

      refetch();
      setSubscriptionModalOpen(false);
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to update subscription status',
        variant: 'destructive',
      });
    }
  };

  const handleToggleAdmin = async (userId: string, makeAdmin: boolean) => {
    try {
      if (makeAdmin) {
        // Add user to admin_roles table
        const { error } = await supabase
          .from('admin_roles')
          .insert({ user_id: userId });
        
        if (error) throw error;
        
        toast({
          title: 'Admin Role Added',
          description: 'User has been granted admin privileges',
        });
      } else {
        // Remove user from admin_roles table
        const { error } = await supabase
          .from('admin_roles')
          .delete()
          .eq('user_id', userId);
        
        if (error) throw error;
        
        toast({
          title: 'Admin Role Removed',
          description: 'User admin privileges have been revoked',
        });
      }

      refetch();
      setAdminModalOpen(false);
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update admin status',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminAccessGuard>
      <PageContainer>
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

          <div className="bg-white p-4 rounded-md shadow mb-4">
            <h2 className="text-lg font-semibold mb-4">User Management</h2>

            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-md">
                <p>Error loading user data. Please try again.</p>
                <p className="text-sm opacity-75">{(error as Error).message}</p>
              </div>
            )}

            {users && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Tasks</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className={user.id === userId ? "bg-blue-50" : ""}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
                        <TableCell>
                          {user.last_sign_in_at 
                            ? <ActivityIndicator date={user.last_sign_in_at} /> 
                            : 'Never'}
                        </TableCell>
                        <TableCell>{user.task_count}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.profile?.subscription_status === 'pro' ? 'default' : 'outline'}
                            className={user.profile?.subscription_status === 'pro' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                          >
                            {user.profile?.subscription_status || 'free'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.is_admin ? 
                            <CheckCircle className="h-5 w-5 text-emerald-500" /> : 
                            <XCircle className="h-5 w-5 text-gray-300" />
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setSelectedUser(user);
                                setSubscriptionModalOpen(true);
                              }}
                            >
                              Update Plan
                            </Button>
                            <Button 
                              variant={user.is_admin ? "destructive" : "outline"} 
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setAdminModalOpen(true);
                              }}
                            >
                              {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>

        {selectedUser && (
          <>
            <UserSubscriptionModal
              user={selectedUser}
              open={subscriptionModalOpen}
              onOpenChange={setSubscriptionModalOpen}
              onUpdateSubscription={handleUpdateSubscription}
            />

            <UserMakeAdminModal
              user={selectedUser}
              isAdmin={selectedUser.is_admin}
              open={adminModalOpen}
              onOpenChange={setAdminModalOpen}
              onToggleAdmin={handleToggleAdmin}
            />
          </>
        )}
      </PageContainer>
    </AdminAccessGuard>
  );
};

export default Admin;
