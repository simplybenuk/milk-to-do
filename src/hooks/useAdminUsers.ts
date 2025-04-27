import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  plan_name: string | null;
  plan_started_at: string | null;
  avatar_url: string | null;
  last_sign_in_at: string | null;
}

export interface UserRoles {
  [key: string]: string[];
}

export function useAdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<UserRoles>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        console.log('Fetching all users...');
        
        // Fetch all profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            username,
            avatar_url,
            plan_started_at,
            plans:plan_id (name)
          `)
          .order('username');

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          toast.error('Could not load user profiles');
          return;
        }
        
        // Get emails and last sign in time for all users using the admin RPC function
        const { data: userData, error: userError } = await supabase.rpc('get_user_emails_and_activity');
        
        if (userError) {
          console.error('Error fetching user emails:', userError);
          toast.error('Could not load user emails');
          return;
        }

        console.log(`Fetched ${profilesData?.length || 0} profiles and ${userData?.length || 0} user emails`);
        
        // Get user roles
        await fetchUserRoles();
        
        // Combine profile data with email data
        const emailMap: Record<string, { email: string, last_sign_in_at: string | null }> = (userData || []).reduce((acc, user) => {
          acc[user.id] = {
            email: user.email,
            last_sign_in_at: user.last_sign_in_at
          };
          return acc;
        }, {});
        
        const formattedUsers = (profilesData || []).map((profile: any) => ({
          id: profile.id,
          email: emailMap[profile.id]?.email || 'Unknown',
          last_sign_in_at: emailMap[profile.id]?.last_sign_in_at || null,
          username: profile.username,
          plan_name: profile.plans?.name || 'No Plan',
          plan_started_at: profile.plan_started_at,
          avatar_url: profile.avatar_url
        }));
        
        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error in fetchUsers:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  const fetchUserRoles = async () => {
    try {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          roles:role_id (name)
        `);
      
      if (roleError) {
        console.error('Error fetching user roles:', roleError);
        toast.error('Could not load user roles');
        return;
      }
      
      // Group roles by user_id
      const roles: Record<string, string[]> = {};
      roleData?.forEach((role: any) => {
        if (!roles[role.user_id]) {
          roles[role.user_id] = [];
        }
        if (role.roles?.name) {
          roles[role.user_id].push(role.roles.name);
        }
      });
      
      setUserRoles(roles);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      toast.error('Failed to load user roles');
    }
  };

  return {
    users,
    loading, 
    userRoles,
    fetchUserRoles
  };
}
