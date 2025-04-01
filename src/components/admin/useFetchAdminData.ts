
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type UserWithDetails = {
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

export const useFetchAdminData = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('useFetchAdminData - Starting to fetch admin data');
      
      try {
        // Get all users
        console.log('useFetchAdminData - Fetching users...');
        const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
        
        if (usersError) {
          console.error('useFetchAdminData - Error fetching users:', usersError);
          throw new Error(usersError.message);
        }
        
        console.log('useFetchAdminData - Users fetched:', users?.users?.length || 0);

        // Get all profiles with subscription status
        console.log('useFetchAdminData - Fetching profiles...');
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, subscription_status, subscription_updated_at');
          
        if (profilesError) {
          console.error('useFetchAdminData - Error fetching profiles:', profilesError);
          throw new Error(profilesError.message);
        }
        
        console.log('useFetchAdminData - Profiles fetched:', profiles?.length || 0);

        // Get task counts for all users
        console.log('useFetchAdminData - Fetching tasks...');
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('owner_id');
          
        if (tasksError) {
          console.error('useFetchAdminData - Error fetching tasks:', tasksError);
          throw new Error(tasksError.message);
        }
        
        console.log('useFetchAdminData - Tasks fetched:', tasks?.length || 0);

        // Count tasks by owner_id manually
        const taskCountMap = new Map();
        tasks?.forEach(task => {
          const count = taskCountMap.get(task.owner_id) || 0;
          taskCountMap.set(task.owner_id, count + 1);
        });

        // Get all admin users
        console.log('useFetchAdminData - Fetching admin roles...');
        const { data: admins, error: adminsError } = await supabase
          .from('admin_roles')
          .select('user_id');
          
        if (adminsError) {
          console.error('useFetchAdminData - Error fetching admin roles:', adminsError);
          throw new Error(adminsError.message);
        }
        
        console.log('useFetchAdminData - Admin roles fetched:', admins?.length || 0);

        // Map admin user IDs for easy lookup
        const adminMap = new Map();
        admins?.forEach(admin => adminMap.set(admin.user_id, true));

        // Map profiles by user ID for easy lookup
        const profileMap = new Map();
        profiles?.forEach(profile => profileMap.set(profile.id, profile));

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
        
        console.log('useFetchAdminData - Combined data:', usersWithDetails.length);

        return usersWithDetails as UserWithDetails[];
      } catch (error) {
        console.error('useFetchAdminData - Unexpected error:', error);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
