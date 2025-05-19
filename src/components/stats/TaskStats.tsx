
import React, { useEffect, useState } from 'react';
import { Task } from '@/types/task';
import useTaskStore from '@/stores/useTaskStore';
import { DailyActivityChart } from './DailyActivityChart';
import { MonthlySummaryChart } from './MonthlySummaryChart';
import { StatsTagFilter } from './StatsTagFilter';
import { StatsCards } from './StatsCards';

export function TaskStats() {
  const { 
    fetchTasks, 
    tasks, 
    isLoading 
  } = useTaskStore();
  
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  
  // Fetch tasks on initial load
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  
  // Filter tasks based on selected tags
  useEffect(() => {
    if (tasks.length === 0) {
      setFilteredTasks([]);
      return;
    }
    
    if (selectedTagIds.length === 0) {
      // If no tags selected, show all tasks
      setFilteredTasks(tasks);
    } else {
      // Filter tasks by selected tags
      const filtered = tasks.filter(task => {
        // If task has no tags but we have selected tags, exclude it
        if (!task.tags || task.tags.length === 0) return false;
        
        // Include task if it has at least one of the selected tags
        return task.tags.some(tagId => selectedTagIds.includes(tagId));
      });
      
      setFilteredTasks(filtered);
    }
  }, [tasks, selectedTagIds]);
  
  const handleTagSelectionChange = (selectedTags: string[]) => {
    setSelectedTagIds(selectedTags);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Task Statistics</h2>
      
      <div className="mb-6">
        <StatsTagFilter
          onSelectionChange={handleTagSelectionChange}
          selectedTagIds={selectedTagIds}
        />
      </div>
      
      {/* Daily Activity Chart */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Daily Activity</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <DailyActivityChart tasks={filteredTasks} />
        </div>
      </div>
      
      {/* Monthly Summary */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Monthly Summary</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <MonthlySummaryChart tasks={filteredTasks} />
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Task Overview</h3>
        <StatsCards tasks={filteredTasks} />
      </div>
    </div>
  );
}
