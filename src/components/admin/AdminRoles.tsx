
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Shield, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIsMobile } from '@/hooks/use-mobile';

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  username: string | null;
}

const formSchema = z.object({
  userId: z.string({
    required_error: "User selection is required",
  }),
  roleId: z.string({
    required_error: "Role selection is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function AdminRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      roleId: "",
    },
  });

  useEffect(() => {
    const fetchRolesAndUsers = async () => {
      try {
        // Fetch roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select('*')
          .order('name');
        
        if (rolesError) {
          console.error('Error fetching roles:', rolesError);
          return;
        }
        
        setRoles(rolesData || []);
        
        // Fetch users with emails
        const { data: userData, error: userError } = await supabase.rpc('get_user_emails');
        
        if (userError) {
          console.error('Error fetching users:', userError);
          return;
        }
        
        // Get profiles to append usernames
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username');
          
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }
        
        // Create a map of profile data
        const profileMap: Record<string, string | null> = {};
        if (profiles) {
          profiles.forEach((profile: any) => {
            profileMap[profile.id] = profile.username;
          });
        }
        
        // Combine user data with profile data
        const formattedUsers = userData?.map((user: any) => ({
          id: user.id,
          email: user.email,
          username: profileMap[user.id] || null
        })) || [];
        
        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error fetching roles and users:', error);
      }
    };
    
    fetchRolesAndUsers();
  }, []);
  
  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      // Find the role name from the selected role ID
      const selectedRole = roles.find(role => role.id === values.roleId);
      if (!selectedRole) {
        toast.error('Selected role not found');
        return;
      }
      
      // Call the add_user_role RPC function
      const { error } = await supabase.rpc('add_user_role', {
        target_user_id: values.userId,
        role_name: selectedRole.name
      });
      
      if (error) {
        console.error('Error assigning role:', error);
        toast.error(`Failed to assign role: ${error.message}`);
        return;
      }
      
      toast.success(`Role ${selectedRole.name} assigned successfully`);
      form.reset();
    } catch (error) {
      console.error('Error in role assignment:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const getUserDisplayName = (user: User) => {
    return user.username ? `${user.username} (${user.email})` : user.email;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-2">
        <UserCheck className="h-5 w-5" />
        <CardTitle>Role Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className={`grid gap-4 ${isMobile ? '' : 'md:grid-cols-2'}`}>
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select User</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto z-50">
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {getUserDisplayName(user)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent className="z-50">
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={loading} className="flex gap-2 w-full sm:w-auto">
              <Shield className="h-4 w-4" />
              Assign Role
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
