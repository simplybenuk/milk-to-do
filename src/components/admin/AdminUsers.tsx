
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  plan_name: string | null;
  plan_started_at: string | null;
  avatar_url: string | null;
}

export function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRoles, setUserRoles] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Fetch users with their plans using a join
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            id,
            username,
            avatar_url,
            plan_started_at,
            plans:plan_id (name)
          `)
          .order('username');

        if (error) {
          console.error('Error fetching users:', error);
          return;
        }
        
        // Get emails from auth.users (requires admin access via RPC)
        const { data: userData, error: userError } = await supabase.rpc('get_user_emails');
        
        if (userError) {
          console.error('Error fetching user emails:', userError);
        }
        
        // Get user roles
        await fetchUserRoles();
        
        // Combine profile data with email data
        const emailMap = userData ? userData.reduce((acc: Record<string, string>, user: any) => {
          acc[user.id] = user.email;
          return acc;
        }, {}) : {};
        
        const formattedUsers = data?.map((profile: any) => ({
          id: profile.id,
          email: emailMap[profile.id] || 'Unknown',
          username: profile.username,
          plan_name: profile.plans?.name || 'No Plan',
          plan_started_at: profile.plan_started_at,
          avatar_url: profile.avatar_url
        })) || [];
        
        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error in fetchUsers:', error);
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
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <CardTitle>Users</CardTitle>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by email or username..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading users...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Plan Start Date</TableHead>
                  <TableHead>Roles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username || 'Unnamed'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.plan_name}</TableCell>
                      <TableCell>
                        {user.plan_started_at 
                          ? format(new Date(user.plan_started_at), 'MMM d, yyyy')
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {userRoles[user.id]?.map((role, i) => (
                            <Badge key={i} variant={role === 'admin' ? 'default' : 'secondary'}>
                              {role}
                            </Badge>
                          )) || 'No roles'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
