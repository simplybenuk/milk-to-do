
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/task';
import { convertDatabaseDatesToDateObjects } from '../../utils/taskUtils';

export interface FetchTasksOptions {
  page?: number;
  pageSize?: number;
  status?: 'open' | 'closed' | undefined;
  tags?: string[] | undefined;
  limit?: number;
}

export const fetchTasksFromDB = async (
  userId: string, 
  options: FetchTasksOptions = {}
): Promise<{ tasks: Task[], count: number }> => {
  const {
    page = 0,
    pageSize = 0, // 0 means no pagination
    status,
    tags,
    limit
  } = options;

  // Start building the query
  let query = supabase
    .from('tasks')
    .select('*', { count: 'exact' })
    .eq('owner_id', userId);

  // Add filters if provided
  if (status) {
    query = query.eq('status', status);
  }

  // Filter by tags if provided
  if (tags && tags.length > 0) {
    query = query.contains('tags', tags);
  }

  // Add pagination if requested
  if (pageSize > 0) {
    const offset = page * pageSize;
    query = query.range(offset, offset + pageSize - 1);
  } else if (limit) {
    // Just apply a limit if requested
    query = query.limit(limit);
  }

  // Add default ordering by priority score
  query = query.order('priority_score', { ascending: false });

  // Execute the query
  const { data, error, count } = await query;

  if (error) throw error;
  
  return { 
    tasks: data.map(convertDatabaseDatesToDateObjects),
    count: count || 0
  };
};
