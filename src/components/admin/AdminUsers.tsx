
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Users } from 'lucide-react';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { UsersTable } from './UsersTable';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export function AdminUsers() {
  const { users, loading, userRoles } = useAdminUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <CardTitle>Users</CardTitle>
        </div>
        <div className="relative w-full max-w-sm">
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
        ) : isMobile ? (
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No users found
              </div>
            ) : (
              filteredUsers.map((user) => (
                <Card key={user.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{user.username || 'Unnamed'}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge>{user.plan_name || 'No plan'}</Badge>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-muted-foreground">Plan started: </span>
                      {user.plan_started_at 
                        ? format(new Date(user.plan_started_at), 'MMM d, yyyy')
                        : 'N/A'}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {userRoles[user.id]?.map((role, i) => (
                        <Badge key={i} variant={role === 'admin' ? 'default' : 'secondary'}>
                          {role}
                        </Badge>
                      )) || 'No roles'}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        ) : (
          <UsersTable 
            users={users}
            userRoles={userRoles}
            filteredUsers={filteredUsers}
          />
        )}
      </CardContent>
    </Card>
  );
}
