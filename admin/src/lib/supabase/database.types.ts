export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      event_tables: {
        Row: {
          capacity: number
          created_at: string
          id: string
          label: string
          org_id: string | null
        }
        Insert: {
          capacity?: number
          created_at?: string
          id?: string
          label: string
          org_id?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string
          id?: string
          label?: string
          org_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_tables_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          checked_in_at: string | null
          checked_in_gate: string | null
          created_at: string
          email: string | null
          id: string
          is_walkin: boolean
          name: string | null
          org_id: string
          status: Database["public"]["Enums"]["guest_status"]
          table_id: string | null
          ticket_sent_at: string | null
          token: string
        }
        Insert: {
          checked_in_at?: string | null
          checked_in_gate?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_walkin?: boolean
          name?: string | null
          org_id: string
          status?: Database["public"]["Enums"]["guest_status"]
          table_id?: string | null
          ticket_sent_at?: string | null
          token?: string
        }
        Update: {
          checked_in_at?: string | null
          checked_in_gate?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_walkin?: boolean
          name?: string | null
          org_id?: string
          status?: Database["public"]["Enums"]["guest_status"]
          table_id?: string | null
          ticket_sent_at?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guests_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "event_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          allocated_seats: number
          coordinator_email: string | null
          coordinator_name: string | null
          coordinator_phone: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          allocated_seats?: number
          coordinator_email?: string | null
          coordinator_name?: string | null
          coordinator_phone?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          allocated_seats?: number
          coordinator_email?: string | null
          coordinator_name?: string | null
          coordinator_phone?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      scan_events: {
        Row: {
          created_at: string
          gate: string | null
          guest_id: string | null
          id: string
          result: Database["public"]["Enums"]["scan_result"]
          staff_id: string | null
        }
        Insert: {
          created_at?: string
          gate?: string | null
          guest_id?: string | null
          id?: string
          result: Database["public"]["Enums"]["scan_result"]
          staff_id?: string | null
        }
        Update: {
          created_at?: string
          gate?: string | null
          guest_id?: string | null
          id?: string
          result?: Database["public"]["Enums"]["scan_result"]
          staff_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_events_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_events_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          created_at: string
          id: string
          name: string
          role: Database["public"]["Enums"]["staff_role"]
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["staff_role"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["staff_role"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_staff_by_email: {
        Args: { p_email: string; p_name: string; p_role: Database["public"]["Enums"]["staff_role"] }
        Returns: Json
      }
      is_admin_or_supervisor: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      redeem_ticket: {
        Args: { p_gate?: string; p_token: string }
        Returns: Json
      }
    }
    Enums: {
      guest_status: "pending" | "checked_in" | "revoked"
      scan_result: "success" | "duplicate" | "revoked" | "flagged" | "not_found"
      staff_role: "scanner" | "supervisor" | "admin"
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

export const Constants = {
  public: {
    Enums: {
      guest_status: ["pending", "checked_in", "revoked"],
      scan_result: ["success", "duplicate", "revoked", "flagged", "not_found"],
      staff_role: ["scanner", "supervisor", "admin"],
    },
  },
} as const
