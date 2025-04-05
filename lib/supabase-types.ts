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
      influencers: {
        Row: {
          id: string
          created_at: string
          name: string
          bio: string | null
          voice_id: string | null
          photo_url: string | null
          prompt: string | null
          cost_per_min: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          bio?: string | null
          voice_id?: string | null
          photo_url?: string | null
          prompt?: string | null
          cost_per_min?: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          bio?: string | null
          voice_id?: string | null
          photo_url?: string | null
          prompt?: string | null
          cost_per_min?: number
        }
        Relationships: []
      }
      minute_packs: {
        Row: {
          id: string
          created_at: string
          name: string
          minutes: number
          price: number
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          minutes: number
          price: number
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          minutes?: number
          price?: number
          is_active?: boolean
        }
        Relationships: []
      }
      calls: {
        Row: {
          id: string
          created_at: string
          user_id: string
          influencer_id: string
          duration: number | null
          status: string
          call_sid: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          influencer_id: string
          duration?: number | null
          status?: string
          call_sid?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          influencer_id?: string
          duration?: number | null
          status?: string
          call_sid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_influencer_id_fkey"
            columns: ["influencer_id"]
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          phone_number: string | null
          phone_verified: boolean
          remaining_minutes: number
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          phone_number?: string | null
          phone_verified?: boolean
          remaining_minutes?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          phone_number?: string | null
          phone_verified?: boolean
          remaining_minutes?: number
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
      transactions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          amount: number
          type: string
          description: string | null
          minute_pack_id: string | null
          stripe_payment_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          amount: number
          type: string
          description?: string | null
          minute_pack_id?: string | null
          stripe_payment_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          amount?: number
          type?: string
          description?: string | null
          minute_pack_id?: string | null
          stripe_payment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_minute_pack_id_fkey"
            columns: ["minute_pack_id"]
            referencedRelation: "minute_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
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