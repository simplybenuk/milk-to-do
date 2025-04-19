
// This edge function can be scheduled to run daily at midnight
// to decay all users' task skip counts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey)

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting skip count decay process...')
    
    // Get all tasks with skip_count > 0
    const { data: tasks, error: fetchError } = await supabase
      .from('tasks')
      .select('id, skip_count')
      .gt('skip_count', 0)
    
    if (fetchError) {
      throw fetchError
    }
    
    console.log(`Found ${tasks.length} tasks with skip_count > 0`)
    
    // Process each task
    let successCount = 0
    let errorCount = 0
    
    for (const task of tasks) {
      const newSkipCount = Math.floor(task.skip_count / 2)
      
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ skip_count: newSkipCount })
        .eq('id', task.id)
        
      if (updateError) {
        console.error(`Error updating task ${task.id}:`, updateError)
        errorCount++
      } else {
        successCount++
      }
    }
    
    const summary = {
      message: 'Skip count decay process completed',
      tasksProcessed: tasks.length,
      successCount,
      errorCount,
      timestamp: new Date().toISOString()
    }
    
    console.log(summary)
    
    return new Response(
      JSON.stringify(summary),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in decay-skip-counts function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500 
      }
    )
  }
})
