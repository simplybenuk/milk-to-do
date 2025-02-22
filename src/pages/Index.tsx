
import { useEffect } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { TaskItem } from '@/components/TaskItem';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { Priority } from '@/types/task';

const Index = () => {
  const { tasks, addTask, completeTask, deleteTask, getTasksByPriority } = useTaskStore();
  const sortedTasks = getTasksByPriority();

  return (
    <div className="min-h-screen bg-milk-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-milk-100 px-3 py-1 text-sm text-milk-800 mb-4">
            Welcome to Milk
          </div>
          <h1 className="text-4xl font-bold text-milk-900 mb-2">
            Your Tasks
          </h1>
          <p className="text-milk-600">
            Focus on what matters, one task at a time
          </p>
        </header>

        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={completeTask}
              onDelete={deleteTask}
            />
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-milk-500">No tasks yet. Add your first task!</p>
            </div>
          )}
        </div>
      </div>
      
      <AddTaskDialog onAddTask={addTask} />
    </div>
  );
};

export default Index;
