export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      board_days: {
        Row: {
          board_id: number
          color_not_done: string | null
          data: Json | null
          done_today: boolean
          id: number
          inserted_at: string
          notes: string | null
          updated_at: string
          year_month_day: string
        }
        Insert: {
          board_id: number
          color_not_done?: string | null
          data?: Json | null
          done_today: boolean
          id?: number
          inserted_at?: string
          notes?: string | null
          updated_at?: string
          year_month_day: string
        }
        Update: {
          board_id?: number
          color_not_done?: string | null
          data?: Json | null
          done_today?: boolean
          id?: number
          inserted_at?: string
          notes?: string | null
          updated_at?: string
          year_month_day?: string
        }
        Relationships: [
          {
            foreignKeyName: "board_days_board_id_fkey"
            columns: ["board_id"]
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_board_day_board_id"
            columns: ["board_id"]
            referencedRelation: "boards"
            referencedColumns: ["id"]
          }
        ]
      }
      boards: {
        Row: {
          board_color: string
          board_description: string | null
          board_name: string
          data: Json | null
          id: number
          inserted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          board_color: string
          board_description?: string | null
          board_name: string
          data?: Json | null
          id?: number
          inserted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          board_color?: string
          board_description?: string | null
          board_name?: string
          data?: Json | null
          id?: number
          inserted_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "boards_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_boards_user_id"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          data: Json | null
          display_bio: string | null
          display_name: string
          id: string
          profile_photo_link: string | null
        }
        Insert: {
          data?: Json | null
          display_bio?: string | null
          display_name: string
          id: string
          profile_photo_link?: string | null
        }
        Update: {
          data?: Json | null
          display_bio?: string | null
          display_name?: string
          id?: string
          profile_photo_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
