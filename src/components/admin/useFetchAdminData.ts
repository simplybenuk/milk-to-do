
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
      // Get all users
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      if (usersError) throw new Error(usersError.message);

      // Get all profiles with subscription status
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, subscription_status, subscription_updated_at');
      if (profilesError) throw new Error(profilesError.message);

      // Get task counts for all users
      // Using the correct syntax for grouping in Supabase
      const { data: taskCounts, error: tasksError } = await supabase
        .from('tasks')
        .select('owner_id, count(*)')
        .group('owner_id');
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

      return usersWithDetails as UserWithDetails[];
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
