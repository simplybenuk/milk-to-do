
import { useEffect, useState } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DailyActivityChart } from './DailyActivityChart';
import { MonthlySummaryChart } from './MonthlySummaryChart';
import { StatsCards } from './StatsCards';
import { StatsTagFilter } from './StatsTagFilter';
import { Task } from '@/types/task';

export function TaskStats() {
  const { tasks, fetchTasks } = useTaskStore();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[] | undefined>(undefined);
  
  // Only fetch tasks once on mount, no dependency on fetchTasks
  useEffect(() => {
    fetchTasks();
  }, []); 

  // Filter tasks based on selected tags
  useEffect(() => {
    if (!tasks.length) {
      setFilteredTasks([]);
      return;
    }

    if (selectedTagIds === undefined) {
      // When undefined or null, show all tasks (no filtering)
      setFilteredTasks(tasks);
      return;
    }

    if (selectedTagIds.length === 0) {
      // If empty array is explicitly selected, show no tasks
      setFilteredTasks([]);
      return;
    }

    // Filter tasks by selected tags
    const filtered = tasks.filter(task => {
      if (!task.tags || task.tags.length === 0) {
        return false;
      }
      return task.tags.some(tagId => selectedTagIds.includes(tagId));
    });

    setFilteredTasks(filtered);
  }, [tasks, selectedTagIds]);

  const handleTagsChange = (tagIds: string[] | undefined) => {
    setSelectedTagIds(tagIds);
  };

  // Calculate statistics
  const calculateStats = (taskList: Task[]) => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Debug logging to understand the data
    console.log('Task breakdown:', {
      totalTasks: taskList.length,
      statusBreakdown: taskList.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      closedStatusBreakdown: taskList.reduce((acc, task) => {
        const status = task.closed_status || 'none';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      expiredTasksWithDate: taskList.filter(task => task.expired_at).length,
      expiredTasksByStatus: taskList.filter(task => task.closed_status === 'expired').length,
    });

    return {
      // Monthly stats
      new: taskList.filter(task => task.created_at >= oneMonthAgo).length,
      completed: taskList.filter(task => 
        task.completed_at && 
        task.completed_at >= oneMonthAgo
      ).length,
      expired: taskList.filter(task => 
        task.expired_at && 
        task.expired_at >= oneMonthAgo
      ).length,
      activeTasks: taskList.filter(task => task.status === 'open').length,
      
      // All time stats
      totalCreated: taskList.length,
      totalCompleted: taskList.filter(task => 
        task.closed_status === 'complete'
      ).length,
      totalExpired: taskList.filter(task => 
        task.closed_status === 'expired'
      ).length,
    };
  };

  if (!tasks.length) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Overview</CardTitle>
            <CardDescription>No tasks available yet</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500">Start adding tasks to see your statistics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = calculateStats(filteredTasks);

  return (
    <div className="space-y-8">
      <StatsTagFilter onTagsChange={handleTagsChange} />
      
      {filteredTasks.length > 0 ? (
        <>
          <StatsCards stats={stats} />
          <DailyActivityChart tasks={filteredTasks} />
          <MonthlySummaryChart tasks={filteredTasks} />
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Matching Tasks</CardTitle>
            <CardDescription>No tasks match your current filter selection</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500">Try selecting different tags or "All Tags" to see your statistics</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
