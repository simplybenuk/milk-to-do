
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserProfile, UserRoles } from '@/hooks/useAdminUsers';

interface UsersTableProps {
  users: UserProfile[];
  userRoles: UserRoles;
  filteredUsers: UserProfile[];
}

export function UsersTable({ filteredUsers, userRoles }: UsersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Plan Start Date</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Roles</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
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
                  {user.last_sign_in_at 
                    ? format(new Date(user.last_sign_in_at), 'MMM d, yyyy HH:mm')
                    : 'Never'}
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
  );
}
