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
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      business_profiles: {
        Row: {
          abn: string | null
          business_address: string | null
          business_email: string | null
          business_name: string
          business_phone: string | null
          business_type: string | null
          city: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          logo_url: string | null
          postal_code: string | null
          state: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          abn?: string | null
          business_address?: string | null
          business_email?: string | null
          business_name: string
          business_phone?: string | null
          business_type?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          abn?: string | null
          business_address?: string | null
          business_email?: string | null
          business_name?: string
          business_phone?: string | null
          business_type?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      communications: {
        Row: {
          created_at: string
          id: string
          message: string
          project_id: string
          sent_at: string
          sent_by: string
          subject: string
          team_member_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          project_id: string
          sent_at?: string
          sent_by: string
          subject: string
          team_member_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          project_id?: string
          sent_at?: string
          sent_by?: string
          subject?: string
          team_member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      council_projects: {
        Row: {
          certifier_choice: string | null
          created_at: string
          has_builder: boolean | null
          has_da_approval: boolean | null
          has_plans: boolean | null
          id: string
          project_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          certifier_choice?: string | null
          created_at?: string
          has_builder?: boolean | null
          has_da_approval?: boolean | null
          has_plans?: boolean | null
          id?: string
          project_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          certifier_choice?: string | null
          created_at?: string
          has_builder?: boolean | null
          has_da_approval?: boolean | null
          has_plans?: boolean | null
          id?: string
          project_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crm_activities: {
        Row: {
          activity_type: string
          completed_at: string | null
          contact_id: string | null
          created_at: string
          created_by: string
          deal_id: string | null
          description: string | null
          due_date: string | null
          duration_minutes: number | null
          email_opened: boolean | null
          email_sent_at: string | null
          id: string
          location: string | null
          meeting_date: string | null
          status: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          activity_type: string
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          created_by: string
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          duration_minutes?: number | null
          email_opened?: boolean | null
          email_sent_at?: string | null
          id?: string
          location?: string | null
          meeting_date?: string | null
          status?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          activity_type?: string
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          duration_minutes?: number | null
          email_opened?: boolean | null
          email_sent_at?: string | null
          id?: string
          location?: string | null
          meeting_date?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          address: string | null
          assigned_to: string | null
          business_id: string | null
          city: string | null
          company: string | null
          contact_type: string
          country: string | null
          created_at: string
          created_by: string
          custom_fields: Json | null
          email: string
          full_name: string
          id: string
          job_title: string | null
          last_contact_date: string | null
          lead_score: number | null
          lifetime_value: number | null
          next_follow_up_date: string | null
          notes: string | null
          phone: string | null
          postal_code: string | null
          source: string | null
          state: string | null
          status: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          assigned_to?: string | null
          business_id?: string | null
          city?: string | null
          company?: string | null
          contact_type: string
          country?: string | null
          created_at?: string
          created_by: string
          custom_fields?: Json | null
          email: string
          full_name: string
          id?: string
          job_title?: string | null
          last_contact_date?: string | null
          lead_score?: number | null
          lifetime_value?: number | null
          next_follow_up_date?: string | null
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          source?: string | null
          state?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          assigned_to?: string | null
          business_id?: string | null
          city?: string | null
          company?: string | null
          contact_type?: string
          country?: string | null
          created_at?: string
          created_by?: string
          custom_fields?: Json | null
          email?: string
          full_name?: string
          id?: string
          job_title?: string | null
          last_contact_date?: string | null
          lead_score?: number | null
          lifetime_value?: number | null
          next_follow_up_date?: string | null
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          source?: string | null
          state?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_contacts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_deals: {
        Row: {
          actual_close_date: string | null
          assigned_to: string | null
          contact_id: string
          created_at: string
          created_by: string
          currency: string | null
          deal_name: string
          deal_value: number | null
          description: string | null
          expected_close_date: string | null
          id: string
          lost_reason: string | null
          notes: string | null
          probability: number | null
          stage: string
          updated_at: string
        }
        Insert: {
          actual_close_date?: string | null
          assigned_to?: string | null
          contact_id: string
          created_at?: string
          created_by: string
          currency?: string | null
          deal_name: string
          deal_value?: number | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          lost_reason?: string | null
          notes?: string | null
          probability?: number | null
          stage?: string
          updated_at?: string
        }
        Update: {
          actual_close_date?: string | null
          assigned_to?: string | null
          contact_id?: string
          created_at?: string
          created_by?: string
          currency?: string | null
          deal_name?: string
          deal_value?: number | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          lost_reason?: string | null
          notes?: string | null
          probability?: number | null
          stage?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_interactions: {
        Row: {
          contact_id: string
          created_at: string
          description: string | null
          id: string
          interaction_type: string
          metadata: Json | null
        }
        Insert: {
          contact_id: string
          created_at?: string
          description?: string | null
          id?: string
          interaction_type: string
          metadata?: Json | null
        }
        Update: {
          contact_id?: string
          created_at?: string
          description?: string | null
          id?: string
          interaction_type?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          name: string
          project_id: string
          updated_at: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          name: string
          project_id: string
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          name?: string
          project_id?: string
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      information_sharing: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          project_id: string
          shared_with_external: boolean
          specific_roles: Database["public"]["Enums"]["external_role"][] | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          project_id: string
          shared_with_external?: boolean
          specific_roles?: Database["public"]["Enums"]["external_role"][] | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          project_id?: string
          shared_with_external?: boolean
          specific_roles?: Database["public"]["Enums"]["external_role"][] | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          postal_code: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      public_chat_requests: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string
          messages_count: number | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address: string
          messages_count?: number | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string
          messages_count?: number | null
          user_agent?: string | null
        }
        Relationships: []
      }
      refinement_questions: {
        Row: {
          answer: string | null
          assigned_to: string | null
          category: string
          created_at: string
          id: string
          is_completed: boolean | null
          project_id: string
          question_key: string
          question_label: string
          status: string | null
          updated_at: string
        }
        Insert: {
          answer?: string | null
          assigned_to?: string | null
          category: string
          created_at?: string
          id?: string
          is_completed?: boolean | null
          project_id: string
          question_key: string
          question_label: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          answer?: string | null
          assigned_to?: string | null
          category?: string
          created_at?: string
          id?: string
          is_completed?: boolean | null
          project_id?: string
          question_key?: string
          question_label?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "refinement_questions_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          added_by: string | null
          company: string | null
          created_at: string
          email: string
          external_role: Database["public"]["Enums"]["external_role"] | null
          full_name: string
          id: string
          member_type: Database["public"]["Enums"]["member_type"]
          permission_level: Database["public"]["Enums"]["permission_level"]
          phone: string | null
          project_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          added_by?: string | null
          company?: string | null
          created_at?: string
          email: string
          external_role?: Database["public"]["Enums"]["external_role"] | null
          full_name: string
          id?: string
          member_type?: Database["public"]["Enums"]["member_type"]
          permission_level?: Database["public"]["Enums"]["permission_level"]
          phone?: string | null
          project_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          added_by?: string | null
          company?: string | null
          created_at?: string
          email?: string
          external_role?: Database["public"]["Enums"]["external_role"] | null
          full_name?: string
          id?: string
          member_type?: Database["public"]["Enums"]["member_type"]
          permission_level?: Database["public"]["Enums"]["permission_level"]
          phone?: string | null
          project_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transcription_requests: {
        Row: {
          audio_size: number
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          audio_size: number
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          audio_size?: number
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_business_roles: {
        Row: {
          business_id: string | null
          created_at: string | null
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_business_roles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_context: {
        Row: {
          business_id: string | null
          context_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_id?: string | null
          context_type?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_id?: string | null
          context_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_context_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_public_chat_rate_limit: {
        Args: {
          _ip_address: string
          _max_requests?: number
          _time_window_hours?: number
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "member" | "viewer"
      external_role: "client" | "builder" | "certifier" | "consultant" | "other"
      member_type: "internal" | "external"
      permission_level: "viewer" | "editor" | "admin"
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
      app_role: ["admin", "member", "viewer"],
      external_role: ["client", "builder", "certifier", "consultant", "other"],
      member_type: ["internal", "external"],
      permission_level: ["viewer", "editor", "admin"],
    },
  },
} as const
