
import { Task } from '@/types/task';

export interface TaskStoreState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  sessionId: string;
}

