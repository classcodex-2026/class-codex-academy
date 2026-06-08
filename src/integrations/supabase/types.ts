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
      batches: {
        Row: {
          capacity: number | null
          course_id: string
          created_at: string
          end_date: string | null
          id: string
          name: string
          notes: string | null
          schedule: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["batch_status"]
          trainer_email: string | null
          trainer_name: string | null
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          course_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          name: string
          notes?: string | null
          schedule?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["batch_status"]
          trainer_email?: string | null
          trainer_name?: string | null
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          course_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          schedule?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["batch_status"]
          trainer_email?: string | null
          trainer_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "batches_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
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
      course_lessons: {
        Row: {
          content_text: string | null
          content_url: string | null
          created_at: string
          description: string | null
          file_path: string | null
          id: string
          lesson_type: Database["public"]["Enums"]["lesson_type"]
          module_id: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          content_text?: string | null
          content_url?: string | null
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          lesson_type?: Database["public"]["Enums"]["lesson_type"]
          module_id: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          content_text?: string | null
          content_url?: string | null
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          lesson_type?: Database["public"]["Enums"]["lesson_type"]
          module_id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
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
          capacity: number | null
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
          capacity?: number | null
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
          capacity?: number | null
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
      enrollments: {
        Row: {
          approval_status: Database["public"]["Enums"]["enrollment_approval"]
          batch_id: string | null
          course_id: string
          created_at: string
          discount_amount: number
          enrolled_at: string
          id: string
          payment_id: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          previous_batch_id: string | null
          scholarship_note: string | null
          student_id: string
          total_fee: number
          updated_at: string
        }
        Insert: {
          approval_status?: Database["public"]["Enums"]["enrollment_approval"]
          batch_id?: string | null
          course_id: string
          created_at?: string
          discount_amount?: number
          enrolled_at?: string
          id?: string
          payment_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          previous_batch_id?: string | null
          scholarship_note?: string | null
          student_id: string
          total_fee?: number
          updated_at?: string
        }
        Update: {
          approval_status?: Database["public"]["Enums"]["enrollment_approval"]
          batch_id?: string | null
          course_id?: string
          created_at?: string
          discount_amount?: number
          enrolled_at?: string
          id?: string
          payment_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          previous_batch_id?: string | null
          scholarship_note?: string | null
          student_id?: string
          total_fee?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          course_id: string
          created_at: string
          currency: string
          id: string
          razorpay_order_id: string
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          status: Database["public"]["Enums"]["payment_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          course_id: string
          created_at?: string
          currency?: string
          id?: string
          razorpay_order_id: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          course_id?: string
          created_at?: string
          currency?: string
          id?: string
          razorpay_order_id?: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          status: Database["public"]["Enums"]["student_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string
          id: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["student_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["student_status"]
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
      is_enrolled: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
      attendance_status: "present" | "absent" | "late" | "excused"
      batch_status: "upcoming" | "running" | "completed" | "cancelled"
      course_category:
        | "python_programming"
        | "data_engineering"
        | "data_analytics"
        | "data_science"
      course_status: "open" | "coming_soon" | "closed"
      enrollment_approval: "pending" | "approved" | "rejected"
      installment_status: "pending" | "paid" | "overdue" | "waived"
      lesson_type: "video" | "pdf" | "notes" | "link" | "assignment"
      payment_status:
        | "pending"
        | "completed"
        | "failed"
        | "refunded"
        | "partial"
        | "due"
      student_status: "active" | "inactive" | "graduated" | "dropped"
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
      attendance_status: ["present", "absent", "late", "excused"],
      batch_status: ["upcoming", "running", "completed", "cancelled"],
      course_category: [
        "python_programming",
        "data_engineering",
        "data_analytics",
        "data_science",
      ],
      course_status: ["open", "coming_soon", "closed"],
      enrollment_approval: ["pending", "approved", "rejected"],
      installment_status: ["pending", "paid", "overdue", "waived"],
      lesson_type: ["video", "pdf", "notes", "link", "assignment"],
      payment_status: [
        "pending",
        "completed",
        "failed",
        "refunded",
        "partial",
        "due",
      ],
      student_status: ["active", "inactive", "graduated", "dropped"],
      video_source: ["youtube", "vimeo", "upload"],
      webinar_status: ["upcoming", "completed"],
    },
  },
} as const
