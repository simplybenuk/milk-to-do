
import { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TaskStatsCardProps {
  title: string;
  description?: string;
  headerAction?: ReactNode;
  children: ReactNode;
}

export function TaskStatsCard({ 
  title, 
  description, 
  headerAction, 
  children 
}: TaskStatsCardProps) {
  return (
    <Card>
      <CardHeader className={headerAction ? "flex flex-row items-center justify-between pb-2" : ""}>
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {headerAction}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
