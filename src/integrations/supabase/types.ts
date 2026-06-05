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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      consultation_requests: {
        Row: {
          contacted: boolean
          created_at: string
          email: string
          id: string
          interested_course: string | null
          name: string
          requirement: string | null
          submitted_at: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          contacted?: boolean
          created_at?: string
          email: string
          id?: string
          interested_course?: string | null
          name: string
          requirement?: string | null
          submitted_at?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          contacted?: boolean
          created_at?: string
          email?: string
          id?: string
          interested_course?: string | null
          name?: string
          requirement?: string | null
          submitted_at?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      course_modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          sort_order: number
          title: string
          topics: Json | null
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          title: string
          topics?: Json | null
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          title?: string
          topics?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_videos: {
        Row: {
          created_at: string
          description: string | null
          id: string
          module_id: string
          sort_order: number
          source_type: Database["public"]["Enums"]["video_source"]
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          module_id: string
          sort_order?: number
          source_type?: Database["public"]["Enums"]["video_source"]
          title: string
          updated_at?: string
          video_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          module_id?: string
          sort_order?: number
          source_type?: Database["public"]["Enums"]["video_source"]
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_videos_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          banner_url: string | null
          category: Database["public"]["Enums"]["course_category"]
          certification: string | null
          created_at: string
          description: string | null
          duration: string | null
          faqs: Json | null
          fee: number | null
          icon_name: string | null
          id: string
          instructor_name: string | null
          original_fee: number | null
          outcomes: Json | null
          overview: string | null
          prerequisites: Json | null
          projects: Json | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["course_status"]
          tagline: string | null
          timing: string | null
          title: string
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          category: Database["public"]["Enums"]["course_category"]
          certification?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          faqs?: Json | null
          fee?: number | null
          icon_name?: string | null
          id?: string
          instructor_name?: string | null
          original_fee?: number | null
          outcomes?: Json | null
          overview?: string | null
          prerequisites?: Json | null
          projects?: Json | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["course_status"]
          tagline?: string | null
          timing?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          category?: Database["public"]["Enums"]["course_category"]
          certification?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          faqs?: Json | null
          fee?: number | null
          icon_name?: string | null
          id?: string
          instructor_name?: string | null
          original_fee?: number | null
          outcomes?: Json | null
          overview?: string | null
          prerequisites?: Json | null
          projects?: Json | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["course_status"]
          tagline?: string | null
          timing?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          about_us: string | null
          contact_email: string | null
          footer_content: string | null
          id: number
          logo_url: string | null
          social_links: Json | null
          tagline: string | null
          updated_at: string
          website_name: string | null
          whatsapp_number: string | null
        }
        Insert: {
          about_us?: string | null
          contact_email?: string | null
          footer_content?: string | null
          id?: number
          logo_url?: string | null
          social_links?: Json | null
          tagline?: string | null
          updated_at?: string
          website_name?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          about_us?: string | null
          contact_email?: string | null
          footer_content?: string | null
          id?: number
          logo_url?: string | null
          social_links?: Json | null
          tagline?: string | null
          updated_at?: string
          website_name?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webinars: {
        Row: {
          banner_url: string | null
          content: string | null
          created_at: string
          description: string | null
          id: string
          recording_url: string | null
          scheduled_date: string | null
          scheduled_time: string | null
          sort_order: number
          status: Database["public"]["Enums"]["webinar_status"]
          title: string
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          recording_url?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["webinar_status"]
          title: string
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          recording_url?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["webinar_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
      course_category:
        | "python_programming"
        | "data_engineering"
        | "data_analytics"
        | "data_science"
      course_status: "open" | "coming_soon" | "closed"
      video_source: "youtube" | "vimeo" | "upload"
      webinar_status: "upcoming" | "completed"
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
      app_role: ["admin"],
      course_category: [
        "python_programming",
        "data_engineering",
        "data_analytics",
        "data_science",
      ],
      course_status: ["open", "coming_soon", "closed"],
      video_source: ["youtube", "vimeo", "upload"],
      webinar_status: ["upcoming", "completed"],
    },
  },
} as const
