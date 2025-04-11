
// Additional types for Supabase RPC functions
declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    rpc<T = any>(
      fn: 'get_user_emails',
      params?: {}
    ): Promise<{ data: T; error: Error | null }>;
    
    rpc<T = any>(
      fn: 'is_admin',
      params: { 
        user_id: string 
      }
    ): Promise<{ data: T; error: Error | null }>;
    
    rpc<T = any>(
      fn: 'add_user_role',
      params: { 
        target_user_id: string,
        role_name: string
      }
    ): Promise<{ data: T; error: Error | null }>;
    
    rpc<T = any>(
      fn: 'append_tag_to_task',
      params: { 
        p_task_id: string,
        p_tag_id: string
      }
    ): Promise<{ data: T; error: Error | null }>;
    
    rpc<T = any>(
      fn: 'remove_tag_from_task',
      params: { 
        p_task_id: string,
        p_tag_id: string
      }
    ): Promise<{ data: T; error: Error | null }>;
  }
}
