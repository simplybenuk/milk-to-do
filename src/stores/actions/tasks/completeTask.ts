
import { supabase } from '@/integrations/supabase/client';
import { ClosedStatusReason } from '@/types/task';

export const completeTaskInDB = async (id: string, reason: ClosedStatusReason = 'complete'): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({
      status: 'closed',
      closed_status: reason,
      completed_at: reason === 'complete' ? new Date().toISOString() : null,
      expired_at: reason === 'expired' ? new Date().toISOString() : null,
    })
    .eq('id', id);

  if (error) throw error;
};
