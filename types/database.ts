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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          certificate_number: string
          course_id: string
          id: string
          issued_at: string
          pdf_url: string | null
          user_id: string
        }
        Insert: {
          certificate_number: string
          course_id: string
          id?: string
          issued_at?: string
          pdf_url?: string | null
          user_id: string
        }
        Update: {
          certificate_number?: string
          course_id?: string
          id?: string
          issued_at?: string
          pdf_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      class_sessions: {
        Row: {
          created_at: string
          duration_label: string
          id: string
          recorded_at: string
          series: string
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          teacher: string
          title: string
          updated_at: string
          video_url: string | null
          waveform: number[]
        }
        Insert: {
          created_at?: string
          duration_label: string
          id?: string
          recorded_at: string
          series: string
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          teacher: string
          title: string
          updated_at?: string
          video_url?: string | null
          waveform?: number[]
        }
        Update: {
          created_at?: string
          duration_label?: string
          id?: string
          recorded_at?: string
          series?: string
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          teacher?: string
          title?: string
          updated_at?: string
          video_url?: string | null
          waveform?: number[]
        }
        Relationships: []
      }
      community_applications: {
        Row: {
          area: Database["public"]["Enums"]["application_area"]
          created_at: string
          email: string
          gender: string | null
          hours_per_week: string | null
          id: string
          location: string | null
          message: string | null
          name: string
          phone: string | null
          role_detail: string | null
          status: Database["public"]["Enums"]["application_status"]
        }
        Insert: {
          area: Database["public"]["Enums"]["application_area"]
          created_at?: string
          email: string
          gender?: string | null
          hours_per_week?: string | null
          id?: string
          location?: string | null
          message?: string | null
          name: string
          phone?: string | null
          role_detail?: string | null
          status?: Database["public"]["Enums"]["application_status"]
        }
        Update: {
          area?: Database["public"]["Enums"]["application_area"]
          created_at?: string
          email?: string
          gender?: string | null
          hours_per_week?: string | null
          id?: string
          location?: string | null
          message?: string | null
          name?: string
          phone?: string | null
          role_detail?: string | null
          status?: Database["public"]["Enums"]["application_status"]
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: Database["public"]["Enums"]["message_status"]
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: Database["public"]["Enums"]["message_status"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: Database["public"]["Enums"]["message_status"]
        }
        Relationships: []
      }
      course_modules: {
        Row: {
          course_id: string
          id: string
          meta_label: string
          module_number: number
          sort_order: number
          title: string
        }
        Insert: {
          course_id: string
          id?: string
          meta_label?: string
          module_number: number
          sort_order: number
          title: string
        }
        Update: {
          course_id?: string
          id?: string
          meta_label?: string
          module_number?: number
          sort_order?: number
          title?: string
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
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          slug?: string
          title?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          course_id: string
          id: string
          started_at: string
          user_id: string
        }
        Insert: {
          course_id: string
          id?: string
          started_at?: string
          user_id: string
        }
        Update: {
          course_id?: string
          id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          flyer_url: string | null
          id: string
          location: string
          register_url: string | null
          slug: string
          starts_at: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          flyer_url?: string | null
          id?: string
          location: string
          register_url?: string | null
          slug: string
          starts_at: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          flyer_url?: string | null
          id?: string
          location?: string
          register_url?: string | null
          slug?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          id: string
          lesson_id: string
          status: Database["public"]["Enums"]["lesson_progress_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          lesson_id: string
          status?: Database["public"]["Enums"]["lesson_progress_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          lesson_id?: string
          status?: Database["public"]["Enums"]["lesson_progress_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          body: Json
          id: string
          lesson_number: number
          module_id: string
          sort_order: number
          title: string
          video_url: string | null
        }
        Insert: {
          body?: Json
          id?: string
          lesson_number: number
          module_id: string
          sort_order: number
          title: string
          video_url?: string | null
        }
        Update: {
          body?: Json
          id?: string
          lesson_number?: number
          module_id?: string
          sort_order?: number
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          source: string
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          source?: string
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          source?: string
          subscribed_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_initials: string
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["staff_role"]
          updated_at: string
        }
        Insert: {
          avatar_initials?: string
          created_at?: string
          email: string
          full_name: string
          id: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["staff_role"]
          updated_at?: string
        }
        Update: {
          avatar_initials?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["staff_role"]
          updated_at?: string
        }
        Relationships: []
      }
      reading_plan_days: {
        Row: {
          content: string | null
          day_number: number
          id: string
          passage_ref: string
          plan_id: string
          title: string
        }
        Insert: {
          content?: string | null
          day_number: number
          id?: string
          passage_ref: string
          plan_id: string
          title: string
        }
        Update: {
          content?: string | null
          day_number?: number
          id?: string
          passage_ref?: string
          plan_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_plan_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_plans: {
        Row: {
          category: string
          created_at: string
          duration_days: number
          excerpt: string
          featured: boolean
          id: string
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          duration_days: number
          excerpt: string
          featured?: boolean
          id?: string
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          duration_days?: number
          excerpt?: string
          featured?: boolean
          id?: string
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          author_id: string | null
          body_html: string | null
          category: Database["public"]["Enums"]["resource_category"]
          created_at: string
          cta_label: string
          excerpt: string
          feature: boolean
          href: string | null
          id: string
          meta_label: string
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          tag: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body_html?: string | null
          category: Database["public"]["Enums"]["resource_category"]
          created_at?: string
          cta_label?: string
          excerpt: string
          feature?: boolean
          href?: string | null
          id?: string
          meta_label?: string
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          tag: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body_html?: string | null
          category?: Database["public"]["Enums"]["resource_category"]
          created_at?: string
          cta_label?: string
          excerpt?: string
          feature?: boolean
          href?: string | null
          id?: string
          meta_label?: string
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          tag?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_staff_role: {
        Args: never
        Returns: Database["public"]["Enums"]["staff_role"]
      }
      is_staff: { Args: never; Returns: boolean }
    }
    Enums: {
      application_area:
        | "volunteer"
        | "bible_study_partner"
        | "internship"
        | "community_group"
        | "team"
      application_status: "new" | "reviewed" | "accepted" | "declined"
      content_status: "draft" | "in_review" | "published"
      lesson_progress_status: "not_started" | "in_progress" | "done"
      message_status: "new" | "read" | "archived"
      resource_category:
        | "Articles"
        | "Bible Studies"
        | "Manuals"
        | "Devotionals"
        | "Downloads"
      staff_role:
        | "admin"
        | "editor"
        | "scholar"
        | "technical_team"
        | "voice_over_artist"
        | "bible_study_intern"
        | "technical_staff_intern"
        | "content_editorial_intern"
        | "media_podcast_intern"
        | "ministry_operations_intern"
        | "scholar_team_intern"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      application_area: [
        "volunteer",
        "bible_study_partner",
        "internship",
        "community_group",
        "team",
      ],
      application_status: ["new", "reviewed", "accepted", "declined"],
      content_status: ["draft", "in_review", "published"],
      lesson_progress_status: ["not_started", "in_progress", "done"],
      message_status: ["new", "read", "archived"],
      resource_category: [
        "Articles",
        "Bible Studies",
        "Manuals",
        "Devotionals",
        "Downloads",
      ],
      staff_role: [
        "admin",
        "editor",
        "scholar",
        "technical_team",
        "voice_over_artist",
        "bible_study_intern",
        "technical_staff_intern",
        "content_editorial_intern",
        "media_podcast_intern",
        "ministry_operations_intern",
        "scholar_team_intern",
      ],
    },
  },
} as const
