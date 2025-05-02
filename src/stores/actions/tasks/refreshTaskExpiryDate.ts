
import { supabase } from '@/integrations/supabase/client';
import { addDays } from 'date-fns';

export const refreshTaskExpiryInDB = async (id: string): Promise<void> => {
  const newExpiryDate = addDays(new Date(), 30);
  
  const { error } = await supabase
    .from('tasks')
    .update({ 
      expiry_date: newExpiryDate.toISOString(),
      // Reset priority score will be recalculated by the trigger
      status: 'open',  // Ensure the task is open
      skip_count: 0    // Reset skip count on refresh
    })
    .eq('id', id);

  if (error) throw error;
};
