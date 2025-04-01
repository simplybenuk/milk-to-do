
import React from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
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

interface UserTableProps {
  users: UserWithDetails[] | null;
  userId: string | null;
  onSelectUser: (user: UserWithDetails, action: 'subscription' | 'admin') => void;
}

export const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  userId,
  onSelectUser
}) => {
  if (!users) return null;

  return (
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
                    onClick={() => onSelectUser(user, 'subscription')}
                  >
                    Update Plan
                  </Button>
                  <Button 
                    variant={user.is_admin ? "destructive" : "outline"} 
                    size="sm"
                    onClick={() => onSelectUser(user, 'admin')}
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
  );
};
