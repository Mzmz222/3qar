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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      districts: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          area_size: string | null
          contact_numbers: string[] | null
          created_at: string | null
          deal_type: Database["public"]["Enums"]["property_deal_type"]
          description: string | null
          dimensions: string | null
          district: string | null
          id: string
          is_featured: boolean | null
          lat: number | null
          lng: number | null
          parcel_number: string | null
          price: string | null
          property_type: Database["public"]["Enums"]["property_type"] | null
          qr_token: string | null
          status: Database["public"]["Enums"]["property_status"]
          street_width: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          area_size?: string | null
          contact_numbers?: string[] | null
          created_at?: string | null
          deal_type?: Database["public"]["Enums"]["property_deal_type"]
          description?: string | null
          dimensions?: string | null
          district?: string | null
          id?: string
          is_featured?: boolean | null
          lat?: number | null
          lng?: number | null
          parcel_number?: string | null
          price?: string | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          qr_token?: string | null
          status?: Database["public"]["Enums"]["property_status"]
          street_width?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          area_size?: string | null
          contact_numbers?: string[] | null
          created_at?: string | null
          deal_type?: Database["public"]["Enums"]["property_deal_type"]
          description?: string | null
          dimensions?: string | null
          district?: string | null
          id?: string
          is_featured?: boolean | null
          lat?: number | null
          lng?: number | null
          parcel_number?: string | null
          price?: string | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          qr_token?: string | null
          status?: Database["public"]["Enums"]["property_status"]
          street_width?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_district_fkey"
            columns: ["district"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          is_cover: boolean | null
          property_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          is_cover?: boolean | null
          property_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          is_cover?: boolean | null
          property_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_views: {
        Row: {
          created_at: string | null
          id: string
          property_id: string | null
          source: Database["public"]["Enums"]["view_source"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id?: string | null
          source?: Database["public"]["Enums"]["view_source"]
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string | null
          source?: Database["public"]["Enums"]["view_source"]
        }
        Relationships: [
          {
            foreignKeyName: "property_views_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          default_contact_numbers: string[] | null
          id: string
          site_name: string
          whatsapp_channel_link: string | null
        }
        Insert: {
          default_contact_numbers?: string[] | null
          id?: string
          site_name?: string
          whatsapp_channel_link?: string | null
        }
        Update: {
          default_contact_numbers?: string[] | null
          id?: string
          site_name?: string
          whatsapp_channel_link?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      property_deal_type: "direct" | "indirect"
      property_status: "draft" | "published" | "sold"
      property_type:
      | "land"
      | "apartment"
      | "building"
      | "shop"
      | "house"
      | "villa"
      | "duplex"
      | "farm"
      view_source:
      | "qr"
      | "whatsapp"
      | "search"
      | "direct"
      | "social"
      | "unknown"
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
      property_deal_type: ["direct", "indirect"],
      property_status: ["draft", "published", "sold"],
      property_type: [
        "land",
        "apartment",
        "building",
        "shop",
        "house",
        "villa",
        "duplex",
        "farm",
      ],
      view_source: ["qr", "whatsapp", "search", "direct", "social", "unknown"],
    },
  },
} as const
