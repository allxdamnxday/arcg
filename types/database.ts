export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      change_order_items: {
        Row: {
          change_order_id: string
          created_at: string | null
          description: string
          id: string
          quantity: number | null
          sort_order: number | null
          total_price: number | null
          unit: string | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          change_order_id: string
          created_at?: string | null
          description: string
          id?: string
          quantity?: number | null
          sort_order?: number | null
          total_price?: number | null
          unit?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          change_order_id?: string
          created_at?: string | null
          description?: string
          id?: string
          quantity?: number | null
          sort_order?: number | null
          total_price?: number | null
          unit?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "change_order_items_change_order_id_fkey"
            columns: ["change_order_id"]
            isOneToOne: false
            referencedRelation: "change_order_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_order_items_change_order_id_fkey"
            columns: ["change_order_id"]
            isOneToOne: false
            referencedRelation: "change_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      change_orders: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          area: string | null
          co_number: string
          cost_impact: number | null
          created_at: string | null
          created_by: string | null
          description: string
          drawing_ref: string | null
          due_date: string | null
          floor: string | null
          id: string
          ocr_text: string | null
          original_image_url: string | null
          project_id: string
          requested_by: string | null
          rfi_number: string | null
          status: Database["public"]["Enums"]["co_status"] | null
          submittal_number: string | null
          time_impact_days: number | null
          title: string
          updated_at: string | null
          vendor: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          area?: string | null
          co_number: string
          cost_impact?: number | null
          created_at?: string | null
          created_by?: string | null
          description: string
          drawing_ref?: string | null
          due_date?: string | null
          floor?: string | null
          id?: string
          ocr_text?: string | null
          original_image_url?: string | null
          project_id: string
          requested_by?: string | null
          rfi_number?: string | null
          status?: Database["public"]["Enums"]["co_status"] | null
          submittal_number?: string | null
          time_impact_days?: number | null
          title: string
          updated_at?: string | null
          vendor?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          area?: string | null
          co_number?: string
          cost_impact?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          drawing_ref?: string | null
          due_date?: string | null
          floor?: string | null
          id?: string
          ocr_text?: string | null
          original_image_url?: string | null
          project_id?: string
          requested_by?: string | null
          rfi_number?: string | null
          status?: Database["public"]["Enums"]["co_status"] | null
          submittal_number?: string | null
          time_impact_days?: number | null
          title?: string
          updated_at?: string | null
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "change_orders_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          change_order_id: string | null
          created_at: string | null
          file_name: string | null
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          project_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          change_order_id?: string | null
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          project_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          change_order_id?: string | null
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          project_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_change_order_id_fkey"
            columns: ["change_order_id"]
            isOneToOne: false
            referencedRelation: "change_order_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_change_order_id_fkey"
            columns: ["change_order_id"]
            isOneToOne: false
            referencedRelation: "change_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          address: string | null
          client_name: string | null
          created_at: string | null
          created_by: string | null
          end_date: string | null
          general_contractor: string | null
          id: string
          name: string
          project_manager: string | null
          project_number: string
          start_date: string | null
          superintendent: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          client_name?: string | null
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          general_contractor?: string | null
          id?: string
          name: string
          project_manager?: string | null
          project_number: string
          start_date?: string | null
          superintendent?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          client_name?: string | null
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          general_contractor?: string | null
          id?: string
          name?: string
          project_manager?: string | null
          project_number?: string
          start_date?: string | null
          superintendent?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      delay_notices: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string
          emailed_at: string | null
          id: string
          incident_date: string
          project_id: string
          recipients: string[] | null
          reported_date: string | null
          status: Database["public"]["Enums"]["delay_notice_status"] | null
          time_impact_days_estimate: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description: string
          emailed_at?: string | null
          id?: string
          incident_date: string
          project_id: string
          recipients?: string[] | null
          reported_date?: string | null
          status?: Database["public"]["Enums"]["delay_notice_status"] | null
          time_impact_days_estimate?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string
          emailed_at?: string | null
          id?: string
          incident_date?: string
          project_id?: string
          recipients?: string[] | null
          reported_date?: string | null
          status?: Database["public"]["Enums"]["delay_notice_status"] | null
          time_impact_days_estimate?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delay_notices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delay_notices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      change_order_summary: {
        Row: {
          client_name: string | null
          co_number: string | null
          cost_impact: number | null
          created_at: string | null
          created_by_name: string | null
          document_count: number | null
          id: string | null
          item_count: number | null
          project_name: string | null
          project_number: string | null
          status: Database["public"]["Enums"]["co_status"] | null
          time_impact_days: number | null
          title: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      co_status: "draft" | "pending" | "approved"
      delay_notice_status: "draft" | "sent" | "acknowledged"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      co_status: ["draft", "pending", "approved"],
      user_role: ["admin", "user"],
    },
  },
} as const
