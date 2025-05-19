
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

export function TaskStats() {
  const { tasks, fetchTasks } = useTaskStore();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[] | undefined>(undefined);
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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

  const handleTagsChange = useCallback((tagIds: string[] | undefined) => {
    setSelectedTagIds(tagIds);
  }, []);

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
