
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Users } from 'lucide-react';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { UsersTable } from './UsersTable';

export function AdminUsers() {
  const { users, loading, userRoles } = useAdminUsers();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card className="min-w-[300px]">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <CardTitle>Users</CardTitle>
        </div>
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by email or username..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-4">Loading users...</div>
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
