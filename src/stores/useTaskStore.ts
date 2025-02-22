
import { create } from 'zustand';
import { Task, Priority } from '@/types/task';

interface TaskStore {
  tasks: Task[];
  addTask: (title: string, priority: Priority, expiryDate: Date, parentId?: string) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTaskPriority: (id: string, priority: Priority) => void;
  getTasksByPriority: () => Task[];
}

const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  addTask: (title, priority, expiryDate, parentId) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      priority,
      expiryDate,
      completed: false,
      createdAt: new Date(),
      parentId,
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },
  completeTask: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      ),
    }));
  },
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },
  updateTaskPriority: (id, priority) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, priority } : task
      ),
    }));
  },
  getTasksByPriority: () => {
    const { tasks } = get();
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityWeight[a.priority];
      const bPriority = priorityWeight[b.priority];
      
      if (aPriority !== bPriority) return bPriority - aPriority;
      
      const aTimeLeft = a.expiryDate.getTime() - Date.now();
      const bTimeLeft = b.expiryDate.getTime() - Date.now();
      return aTimeLeft - bTimeLeft;
    });
  },
}));

export default useTaskStore;
