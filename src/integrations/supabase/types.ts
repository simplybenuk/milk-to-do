export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      plans: {
        Row: {
          billing_interval: string | null
          can_edit_tasks: boolean | null
          can_use_expiry: boolean | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          price_pence: number | null
          priority_limit: number | null
          task_limit: number | null
          updated_at: string | null
        }
        Insert: {
          billing_interval?: string | null
          can_edit_tasks?: boolean | null
          can_use_expiry?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price_pence?: number | null
          priority_limit?: number | null
          task_limit?: number | null
          updated_at?: string | null
        }
        Update: {
          billing_interval?: string | null
          can_edit_tasks?: boolean | null
          can_use_expiry?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price_pence?: number | null
          priority_limit?: number | null
          task_limit?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accepts_analytics: boolean | null
          accepts_marketing: boolean | null
          avatar_url: string | null
          full_name: string | null
          id: string
          plan_id: string | null
          plan_started_at: string | null
          role: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          accepts_analytics?: boolean | null
          accepts_marketing?: boolean | null
          avatar_url?: string | null
          full_name?: string | null
          id: string
          plan_id?: string | null
          plan_started_at?: string | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          accepts_analytics?: boolean | null
          accepts_marketing?: boolean | null
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          plan_id?: string | null
          plan_started_at?: string | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      task_tags: {
        Row: {
          tag_id: string
          task_id: string
        }
        Insert: {
          tag_id: string
          task_id: string
        }
        Update: {
          tag_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_tags_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          child_task_ids: string[] | null
          closed_status:
            | Database["public"]["Enums"]["closed_status_reason"]
            | null
          completed_at: string | null
          created_at: string
          expired_at: string | null
          expiry_date: string
          id: string
          owner_id: string
          parent_id: string | null
          priority: Database["public"]["Enums"]["task_priority"]
          priority_score: number | null
          skip_count: number
          status: Database["public"]["Enums"]["task_status"]
          tags: string[] | null
          title: string
        }
        Insert: {
          child_task_ids?: string[] | null
          closed_status?:
            | Database["public"]["Enums"]["closed_status_reason"]
            | null
          completed_at?: string | null
          created_at?: string
          expired_at?: string | null
          expiry_date?: string
          id?: string
          owner_id: string
          parent_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          priority_score?: number | null
          skip_count?: number
          status?: Database["public"]["Enums"]["task_status"]
          tags?: string[] | null
          title: string
        }
        Update: {
          child_task_ids?: string[] | null
          closed_status?:
            | Database["public"]["Enums"]["closed_status_reason"]
            | null
          completed_at?: string | null
          created_at?: string
          expired_at?: string | null
          expiry_date?: string
          id?: string
          owner_id?: string
          parent_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          priority_score?: number | null
          skip_count?: number
          status?: Database["public"]["Enums"]["task_status"]
          tags?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_role: {
        Args: { target_user_id: string; role_name: string }
        Returns: undefined
      }
      get_user_emails: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
        }[]
      }
      increment: {
        Args: { row_id: string }
        Returns: number
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      closed_status_reason: "expired" | "complete" | "parent"
      task_priority: "low" | "medium" | "high"
      task_status: "open" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      closed_status_reason: ["expired", "complete", "parent"],
      task_priority: ["low", "medium", "high"],
      task_status: ["open", "closed"],
    },
  },
} as const
