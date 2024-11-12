export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      bulletins: {
        Row: {
          additionalImages: Json | null;
          body: string | null;
          created_at: string;
          date: string | null;
          firstAdditionalBody: string | null;
          id: number;
          mainSecondaryImage: string | null;
          secondAdditionalBody: string | null;
          secondBody: string | null;
          tags: Json | null;
          title: string | null;
          topics: Json | null;
        };
        Insert: {
          additionalImages?: Json | null;
          body?: string | null;
          created_at?: string;
          date?: string | null;
          firstAdditionalBody?: string | null;
          id?: number;
          mainSecondaryImage?: string | null;
          secondAdditionalBody?: string | null;
          secondBody?: string | null;
          tags?: Json | null;
          title?: string | null;
          topics?: Json | null;
        };
        Update: {
          additionalImages?: Json | null;
          body?: string | null;
          created_at?: string;
          date?: string | null;
          firstAdditionalBody?: string | null;
          id?: number;
          mainSecondaryImage?: string | null;
          secondAdditionalBody?: string | null;
          secondBody?: string | null;
          tags?: Json | null;
          title?: string | null;
          topics?: Json | null;
        };
        Relationships: [];
      };
      comunicados_de_prensa: {
        Row: {
          body: string | null;
          category: string | null;
          created_at: string;
          date: string | null;
          id: number;
          pdfSource: string | null;
          title: string | null;
        };
        Insert: {
          body?: string | null;
          category?: string | null;
          created_at?: string;
          date?: string | null;
          id?: number;
          pdfSource?: string | null;
          title?: string | null;
        };
        Update: {
          body?: string | null;
          category?: string | null;
          created_at?: string;
          date?: string | null;
          id?: number;
          pdfSource?: string | null;
          title?: string | null;
        };
        Relationships: [];
      };
      form: {
        Row: {
          applied_intervention: string;
          created_at: string;
          cui: string;
          department: string;
          id: number;
          institution: string;
          intervention_state: string;
          intervention_type: string;
          latitude: number;
          longitude: number;
          monitored: boolean;
          municipality: string;
          name: string | null;
          phone_number: string;
          picture_url: string;
          populated_place: string;
          promoter_cui: string;
        };
        Insert: {
          applied_intervention: string;
          created_at?: string;
          cui: string;
          department: string;
          id?: number;
          institution: string;
          intervention_state: string;
          intervention_type: string;
          latitude: number;
          longitude: number;
          monitored?: boolean;
          municipality: string;
          name?: string | null;
          phone_number: string;
          picture_url: string;
          populated_place: string;
          promoter_cui?: string;
        };
        Update: {
          applied_intervention?: string;
          created_at?: string;
          cui?: string;
          department?: string;
          id?: number;
          institution?: string;
          intervention_state?: string;
          intervention_type?: string;
          latitude?: number;
          longitude?: number;
          monitored?: boolean;
          municipality?: string;
          name?: string | null;
          phone_number?: string;
          picture_url?: string;
          populated_place?: string;
          promoter_cui?: string;
        };
        Relationships: [];
      };
      form_backup: {
        Row: {
          applied_intervention: string | null;
          created_at: string | null;
          cui: string | null;
          department: string | null;
          id: number | null;
          institution: string | null;
          intervention_state: string | null;
          intervention_type: string | null;
          latitude: number | null;
          longitude: number | null;
          monitored: boolean | null;
          municipality: string | null;
          name: string | null;
          phone_number: string | null;
          picture_url: string | null;
          populated_place: string | null;
          promoter_cui: string | null;
        };
        Insert: {
          applied_intervention?: string | null;
          created_at?: string | null;
          cui?: string | null;
          department?: string | null;
          id?: number | null;
          institution?: string | null;
          intervention_state?: string | null;
          intervention_type?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          monitored?: boolean | null;
          municipality?: string | null;
          name?: string | null;
          phone_number?: string | null;
          picture_url?: string | null;
          populated_place?: string | null;
          promoter_cui?: string | null;
        };
        Update: {
          applied_intervention?: string | null;
          created_at?: string | null;
          cui?: string | null;
          department?: string | null;
          id?: number | null;
          institution?: string | null;
          intervention_state?: string | null;
          intervention_type?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          monitored?: boolean | null;
          municipality?: string | null;
          name?: string | null;
          phone_number?: string | null;
          picture_url?: string | null;
          populated_place?: string | null;
          promoter_cui?: string | null;
        };
        Relationships: [];
      };
      form_backup_after_monitorings: {
        Row: {
          applied_intervention: string | null;
          created_at: string | null;
          cui: string | null;
          department: string | null;
          id: number | null;
          institution: string | null;
          intervention_state: string | null;
          intervention_type: string | null;
          latitude: number | null;
          longitude: number | null;
          monitored: boolean | null;
          municipality: string | null;
          name: string | null;
          phone_number: string | null;
          picture_url: string | null;
          populated_place: string | null;
          promoter_cui: string | null;
        };
        Insert: {
          applied_intervention?: string | null;
          created_at?: string | null;
          cui?: string | null;
          department?: string | null;
          id?: number | null;
          institution?: string | null;
          intervention_state?: string | null;
          intervention_type?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          monitored?: boolean | null;
          municipality?: string | null;
          name?: string | null;
          phone_number?: string | null;
          picture_url?: string | null;
          populated_place?: string | null;
          promoter_cui?: string | null;
        };
        Update: {
          applied_intervention?: string | null;
          created_at?: string | null;
          cui?: string | null;
          department?: string | null;
          id?: number | null;
          institution?: string | null;
          intervention_state?: string | null;
          intervention_type?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          monitored?: boolean | null;
          municipality?: string | null;
          name?: string | null;
          phone_number?: string | null;
          picture_url?: string | null;
          populated_place?: string | null;
          promoter_cui?: string | null;
        };
        Relationships: [];
      };
      form_backup_after_monitorings_2: {
        Row: {
          applied_intervention: string | null;
          created_at: string | null;
          cui: string | null;
          department: string | null;
          id: number;
          institution: string | null;
          intervention_state: string | null;
          intervention_type: string | null;
          latitude: number | null;
          longitude: number | null;
          monitored: boolean | null;
          municipality: string | null;
          name: string | null;
          phone_number: string | null;
          picture_url: string | null;
          populated_place: string | null;
          promoter_cui: string | null;
        };
        Insert: {
          applied_intervention?: string | null;
          created_at?: string | null;
          cui?: string | null;
          department?: string | null;
          id?: number;
          institution?: string | null;
          intervention_state?: string | null;
          intervention_type?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          monitored?: boolean | null;
          municipality?: string | null;
          name?: string | null;
          phone_number?: string | null;
          picture_url?: string | null;
          populated_place?: string | null;
          promoter_cui?: string | null;
        };
        Update: {
          applied_intervention?: string | null;
          created_at?: string | null;
          cui?: string | null;
          department?: string | null;
          id?: number;
          institution?: string | null;
          intervention_state?: string | null;
          intervention_type?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          monitored?: boolean | null;
          municipality?: string | null;
          name?: string | null;
          phone_number?: string | null;
          picture_url?: string | null;
          populated_place?: string | null;
          promoter_cui?: string | null;
        };
        Relationships: [];
      };
      historias_de_vida: {
        Row: {
          additionalImages: Json | null;
          body: string | null;
          created_at: string;
          date: string | null;
          firstAdditionalBody: string | null;
          headerImage: string | null;
          id: number;
          program: string | null;
          secondAdditionalBody: string | null;
          title: string | null;
          videoUrl: string | null;
        };
        Insert: {
          additionalImages?: Json | null;
          body?: string | null;
          created_at?: string;
          date?: string | null;
          firstAdditionalBody?: string | null;
          headerImage?: string | null;
          id?: number;
          program?: string | null;
          secondAdditionalBody?: string | null;
          title?: string | null;
          videoUrl?: string | null;
        };
        Update: {
          additionalImages?: Json | null;
          body?: string | null;
          created_at?: string;
          date?: string | null;
          firstAdditionalBody?: string | null;
          headerImage?: string | null;
          id?: number;
          program?: string | null;
          secondAdditionalBody?: string | null;
          title?: string | null;
          videoUrl?: string | null;
        };
        Relationships: [];
      };
      kid: {
        Row: {
          birthday: string | null;
          carnet: string | null;
          created_at: string;
          cui: string | null;
          family_cui: string;
          height: number | null;
          id: number;
          is_baby: boolean;
          last_date_height: string | null;
          last_date_weight: string | null;
          lines_marked_on_size_graphs: string | null;
          lines_marked_on_weight_graphs: string | null;
          name: string;
          no_height_control: boolean;
          no_weight_control: boolean;
          picture_carnet_size_url: string | null;
          picture_carnet_weight_url: string | null;
          points_marked_on_size_graphs: string | null;
          points_marked_on_weight_graphs: string | null;
          prev_to_last_date_height: string | null;
          prev_to_last_date_weight: string | null;
          weight: number | null;
        };
        Insert: {
          birthday?: string | null;
          carnet?: string | null;
          created_at?: string;
          cui?: string | null;
          family_cui: string;
          height?: number | null;
          id?: number;
          is_baby: boolean;
          last_date_height?: string | null;
          last_date_weight?: string | null;
          lines_marked_on_size_graphs?: string | null;
          lines_marked_on_weight_graphs?: string | null;
          name: string;
          no_height_control: boolean;
          no_weight_control: boolean;
          picture_carnet_size_url?: string | null;
          picture_carnet_weight_url?: string | null;
          points_marked_on_size_graphs?: string | null;
          points_marked_on_weight_graphs?: string | null;
          prev_to_last_date_height?: string | null;
          prev_to_last_date_weight?: string | null;
          weight?: number | null;
        };
        Update: {
          birthday?: string | null;
          carnet?: string | null;
          created_at?: string;
          cui?: string | null;
          family_cui?: string;
          height?: number | null;
          id?: number;
          is_baby?: boolean;
          last_date_height?: string | null;
          last_date_weight?: string | null;
          lines_marked_on_size_graphs?: string | null;
          lines_marked_on_weight_graphs?: string | null;
          name?: string;
          no_height_control?: boolean;
          no_weight_control?: boolean;
          picture_carnet_size_url?: string | null;
          picture_carnet_weight_url?: string | null;
          points_marked_on_size_graphs?: string | null;
          points_marked_on_weight_graphs?: string | null;
          prev_to_last_date_height?: string | null;
          prev_to_last_date_weight?: string | null;
          weight?: number | null;
        };
        Relationships: [];
      };
      monitoring: {
        Row: {
          additional_comments: string;
          created_at: string;
          form_id: number;
          form_verification: boolean;
          form_verification_justification: string | null;
          id: number;
          physical_verification: boolean;
          physical_verification_justification: string | null;
          promoter_cui: string;
          qol_verification: string;
          qol_verification_justification: string;
          quality_verification: string;
          quality_verification_justification: string | null;
          recommendations: string;
          who_answers_cui: string | null;
          who_answers_is_home_chief: boolean;
          who_answers_name: string | null;
        };
        Insert: {
          additional_comments: string;
          created_at?: string;
          form_id: number;
          form_verification: boolean;
          form_verification_justification?: string | null;
          id?: number;
          physical_verification: boolean;
          physical_verification_justification?: string | null;
          promoter_cui: string;
          qol_verification: string;
          qol_verification_justification: string;
          quality_verification: string;
          quality_verification_justification?: string | null;
          recommendations: string;
          who_answers_cui?: string | null;
          who_answers_is_home_chief: boolean;
          who_answers_name?: string | null;
        };
        Update: {
          additional_comments?: string;
          created_at?: string;
          form_id?: number;
          form_verification?: boolean;
          form_verification_justification?: string | null;
          id?: number;
          physical_verification?: boolean;
          physical_verification_justification?: string | null;
          promoter_cui?: string;
          qol_verification?: string;
          qol_verification_justification?: string;
          quality_verification?: string;
          quality_verification_justification?: string | null;
          recommendations?: string;
          who_answers_cui?: string | null;
          who_answers_is_home_chief?: boolean;
          who_answers_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "monitoring_form_id_fkey";
            columns: ["form_id"];
            isOneToOne: false;
            referencedRelation: "form";
            referencedColumns: ["id"];
          }
        ];
      };
      monitorings_backup_after_test: {
        Row: {
          additional_comments: string | null;
          created_at: string | null;
          form_id: number | null;
          form_verification: boolean | null;
          form_verification_justification: string | null;
          id: number;
          physical_verification: boolean | null;
          physical_verification_justification: string | null;
          promoter_cui: string | null;
          qol_verification: string | null;
          qol_verification_justification: string | null;
          quality_verification: string | null;
          quality_verification_justification: string | null;
          recommendations: string | null;
          who_answers_cui: string | null;
          who_answers_is_home_chief: boolean | null;
          who_answers_name: string | null;
        };
        Insert: {
          additional_comments?: string | null;
          created_at?: string | null;
          form_id?: number | null;
          form_verification?: boolean | null;
          form_verification_justification?: string | null;
          id?: number;
          physical_verification?: boolean | null;
          physical_verification_justification?: string | null;
          promoter_cui?: string | null;
          qol_verification?: string | null;
          qol_verification_justification?: string | null;
          quality_verification?: string | null;
          quality_verification_justification?: string | null;
          recommendations?: string | null;
          who_answers_cui?: string | null;
          who_answers_is_home_chief?: boolean | null;
          who_answers_name?: string | null;
        };
        Update: {
          additional_comments?: string | null;
          created_at?: string | null;
          form_id?: number | null;
          form_verification?: boolean | null;
          form_verification_justification?: string | null;
          id?: number;
          physical_verification?: boolean | null;
          physical_verification_justification?: string | null;
          promoter_cui?: string | null;
          qol_verification?: string | null;
          qol_verification_justification?: string | null;
          quality_verification?: string | null;
          quality_verification_justification?: string | null;
          recommendations?: string | null;
          who_answers_cui?: string | null;
          who_answers_is_home_chief?: boolean | null;
          who_answers_name?: string | null;
        };
        Relationships: [];
      };
      noticias: {
        Row: {
          additionalSections: Json | null;
          area: string | null;
          created_at: string;
          date: string | null;
          externalLinks: Json | null;
          id: number;
          mainBody: string | null;
          mainImage: string | null;
          state: string | null;
          subtitle: string | null;
          tags: Json | null;
          title: string | null;
        };
        Insert: {
          additionalSections?: Json | null;
          area?: string | null;
          created_at?: string;
          date?: string | null;
          externalLinks?: Json | null;
          id?: number;
          mainBody?: string | null;
          mainImage?: string | null;
          state?: string | null;
          subtitle?: string | null;
          tags?: Json | null;
          title?: string | null;
        };
        Update: {
          additionalSections?: Json | null;
          area?: string | null;
          created_at?: string;
          date?: string | null;
          externalLinks?: Json | null;
          id?: number;
          mainBody?: string | null;
          mainImage?: string | null;
          state?: string | null;
          subtitle?: string | null;
          tags?: Json | null;
          title?: string | null;
        };
        Relationships: [];
      };
      sesan_forms: {
        Row: {
          adult_beneficiaries: number | null;
          applied_intervention: string | null;
          childhood_beneficiaries: number | null;
          created_at: string;
          cui: string | null;
          department: string | null;
          elderly_beneficiaries: number | null;
          female_beneficiaries: number | null;
          first_childhood_beneficiaries: number | null;
          id: number;
          institution: string | null;
          intervention_state: string | null;
          intervention_type: string | null;
          latitude: number | null;
          longitude: number | null;
          male_beneficiaries: number | null;
          monitored: boolean | null;
          municipality: string | null;
          name: string | null;
          observations: string | null;
          phone_number: string | null;
          picture_url: string | null;
          populated_place: string | null;
          promoter_cui: string | null;
          total_beneficiaries: number | null;
          youth_beneficiaries: number | null;
        };
        Insert: {
          adult_beneficiaries?: number | null;
          applied_intervention?: string | null;
          childhood_beneficiaries?: number | null;
          created_at?: string;
          cui?: string | null;
          department?: string | null;
          elderly_beneficiaries?: number | null;
          female_beneficiaries?: number | null;
          first_childhood_beneficiaries?: number | null;
          id?: number;
          institution?: string | null;
          intervention_state?: string | null;
          intervention_type?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          male_beneficiaries?: number | null;
          monitored?: boolean | null;
          municipality?: string | null;
          name?: string | null;
          observations?: string | null;
          phone_number?: string | null;
          picture_url?: string | null;
          populated_place?: string | null;
          promoter_cui?: string | null;
          total_beneficiaries?: number | null;
          youth_beneficiaries?: number | null;
        };
        Update: {
          adult_beneficiaries?: number | null;
          applied_intervention?: string | null;
          childhood_beneficiaries?: number | null;
          created_at?: string;
          cui?: string | null;
          department?: string | null;
          elderly_beneficiaries?: number | null;
          female_beneficiaries?: number | null;
          first_childhood_beneficiaries?: number | null;
          id?: number;
          institution?: string | null;
          intervention_state?: string | null;
          intervention_type?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          male_beneficiaries?: number | null;
          monitored?: boolean | null;
          municipality?: string | null;
          name?: string | null;
          observations?: string | null;
          phone_number?: string | null;
          picture_url?: string | null;
          populated_place?: string | null;
          promoter_cui?: string | null;
          total_beneficiaries?: number | null;
          youth_beneficiaries?: number | null;
        };
        Relationships: [];
      };
      web_user: {
        Row: {
          created_at: string;
          dpi: string | null;
          id: number;
          name: string | null;
          password: string | null;
          profile_picture: string | null;
          role: string | null;
          salt: string | null;
        };
        Insert: {
          created_at?: string;
          dpi?: string | null;
          id?: number;
          name?: string | null;
          password?: string | null;
          profile_picture?: string | null;
          role?: string | null;
          salt?: string | null;
        };
        Update: {
          created_at?: string;
          dpi?: string | null;
          id?: number;
          name?: string | null;
          password?: string | null;
          profile_picture?: string | null;
          role?: string | null;
          salt?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
