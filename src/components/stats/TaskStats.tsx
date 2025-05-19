
import { useEffect, useState, useCallback } from 'react';
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
import { FetchTasksOptions } from '@/stores/actions/tasks/fetchTasks';

export function TaskStats() {
  const { tasks, fetchTasks, isLoading } = useTaskStore();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[] | undefined>(undefined);
  const [dataFetched, setDataFetched] = useState(false);
  
  // Fetch tasks with optimization - only fetch once and use filtering
  const loadTasksForStats = useCallback(async () => {
    console.log('Loading tasks for stats view');
    
    // Create options object for fetch
    const options: FetchTasksOptions = {
      // For stats, we need both open and closed tasks
      // Use a reasonable limit to prevent loading too much data
      limit: 1000,
      // If tags are selected, filter by them
      tags: selectedTagIds?.length ? selectedTagIds : undefined
    };
    
    try {
      await fetchTasks(options);
      setDataFetched(true);
    } catch (error) {
      console.error('Error fetching tasks for stats:', error);
    }
  }, [fetchTasks, selectedTagIds]);

  // Initial data load
  useEffect(() => {
    loadTasksForStats();
  }, [loadTasksForStats]);

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
    
    // If the selection has changed significantly, refetch with new filter
    if ((tagIds === undefined && selectedTagIds !== undefined) || 
        (tagIds !== undefined && selectedTagIds === undefined) ||
        (tagIds?.length === 0 && selectedTagIds?.length !== 0)) {
      // Reset data fetched flag to trigger a re-fetch with the new filter
      setDataFetched(false);
    }
  };

  if (isLoading && !dataFetched) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Overview</CardTitle>
            <CardDescription>Loading stats data...</CardDescription>
          </CardHeader>
          <CardContent className="h-40 flex items-center justify-center">
            <div className="animate-pulse text-center">
              <div className="h-4 bg-slate-200 rounded w-32 mb-4 mx-auto"></div>
              <div className="h-4 bg-slate-200 rounded w-24 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  return (
    <div className="space-y-8">
      <StatsTagFilter onTagsChange={handleTagsChange} />
      
      {filteredTasks.length > 0 ? (
        <>
          <StatsCards tasks={filteredTasks} />
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
