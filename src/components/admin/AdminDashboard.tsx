
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserTable } from './UserTable';
import { UserSubscriptionModal } from './UserSubscriptionModal';
import { UserMakeAdminModal } from './UserMakeAdminModal';
import { useFetchAdminData, UserWithDetails } from './useFetchAdminData';

interface AdminDashboardProps {
  userId: string | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ userId }) => {
  const { data: users, isLoading, error, refetch } = useFetchAdminData();
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const handleSelectUser = (user: UserWithDetails, action: 'subscription' | 'admin') => {
    setSelectedUser(user);
    if (action === 'subscription') {
      setSubscriptionModalOpen(true);
    } else {
      setAdminModalOpen(true);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-md">
        <p>Error loading user data. Please try again.</p>
        <p className="text-sm opacity-75">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md shadow mb-4">
      <h2 className="text-lg font-semibold mb-4">User Management</h2>
      
      <UserTable 
        users={users || null} 
        userId={userId}
        onSelectUser={handleSelectUser}
      />
      
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
    </div>
  );
};
