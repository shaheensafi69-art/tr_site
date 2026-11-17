export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      provinces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          is_active: boolean;
          display_order: number;
          description: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['provinces']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['provinces']['Insert']>;
      };
      cities: {
        Row: {
          id: string;
          province_id: string;
          name: string;
          slug: string;
          is_active: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cities']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['cities']['Insert']>;
      };
      hotels: {
        Row: {
          id: string;
          name: string;
          slug: string;
          province_id: string;
          city_id: string;
          stars: number;
          rating: number;
          review_count: number;
          address: string;
          cover_image: string;
          images: string[];
          short_description: string;
          description: string;
          phone: string;
          email: string | null;
          latitude: number | null;
          longitude: number | null;
          check_in_time: string;
          check_out_time: string;
          hourly_start_time?: string;
          hourly_end_time?: string;
          min_hourly_duration?: number;
          max_hourly_duration?: number;
          google_maps_url?: string;
          rules: string[];
          faq: { question: string; answer: string }[];
          commission_rate: number;
          is_featured: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['hotels']['Row']>;
        Update: Partial<Database['public']['Tables']['hotels']['Row']>;
      };
      hotel_amenities: {
        Row: {
          id: string;
          hotel_id: string;
          name: string;
          icon: string;
          is_featured: boolean;
        };
      };
      rooms: {
        Row: {
          id: string;
          hotel_id: string;
          name: string;
          room_number: string | null;
          room_type: 'single' | 'double' | 'triple' | 'quad' | 'family' | 'suite';
          bed_type: string;
          standard_capacity: number;
          max_capacity: number;
          size_sqm: number;
          cover_image: string;
          images: string[];
          description: string;
          status: 'available' | 'reserved' | 'occupied' | 'cleaning' | 'maintenance' | 'unavailable';
          breakfast_type: 'included' | 'optional' | 'none';
          breakfast_price: number;
          is_hourly_available: boolean;
          is_published: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
      };
      room_amenities: {
        Row: {
          id: string;
          room_id: string;
          name: string;
          icon: string;
        };
      };
      room_pricing: {
        Row: {
          id: string;
          room_id: string;
          daily_price: number;
          hourly_price: number;
          hourly_min_hours: number;
          discount_percentage: number;
          special_price: number | null;
          breakfast_price: number;
          currency: string;
          valid_from: string;
          valid_to: string | null;
          is_active: boolean;
          created_at: string;
        };
      };
      currencies: {
        Row: {
          code: 'TOMAN' | 'USD' | 'EUR' | 'AFN';
          name_fa: string;
          name_en: string;
          symbol: string;
          rate_to_toman: number;
          is_active: boolean;
          updated_at: string;
        };
      };
      customers: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          country_code: string;
          email: string | null;
          is_repeat_customer: boolean;
          total_bookings: number;
          created_at: string;
          updated_at: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          booking_code: string;
          customer_id: string;
          hotel_id: string;
          room_id: string;
          booking_type: 'daily' | 'hourly';
          check_in_date: string;
          check_out_date: string;
          check_in_time: string | null;
          duration_hours: number | null;
          start_timestamp: string;
          end_timestamp: string;
          adults_count: number;
          children_count: number;
          rooms_count: number;
          breakfast_included: boolean;
          currency: string;
          exchange_rate_used: number;
          daily_rate_base: number;
          hotel_net_amount: number;
          commission_rate: number;
          commission_amount: number;
          total_amount: number;
          total_amount_currency: number;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'expired';
          expires_at: string;
          special_requests: string | null;
          qr_data: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      bank_accounts: {
        Row: {
          id: string;
          bank_name: string;
          card_number: string;
          account_number: string | null;
          iban: string | null;
          account_holder: string;
          currency: string;
          is_active: boolean;
          created_at: string;
        };
      };
      payments: {
        Row: {
          id: string;
          booking_id: string;
          bank_account_id: string | null;
          amount: number;
          currency: string;
          tracking_number: string | null;
          receipt_url: string | null;
          status: 'unpaid' | 'awaiting_verification' | 'paid' | 'rejected' | 'refunded';
          payment_method: string;
          notes: string | null;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          hotel_id: string;
          booking_id: string | null;
          customer_name: string;
          rating: number;
          comment: string;
          is_verified_stay: boolean;
          is_published: boolean;
          created_at: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          brand_name: string;
          tagline: string;
          phone: string;
          whatsapp: string;
          telegram: string;
          email: string;
          address: string;
          commission_rate_default: number;
          hold_duration_minutes: number;
          updated_at: string;
        };
      };
      telegram_notifications: {
        Row: {
          id: string;
          booking_id: string | null;
          event_type: string;
          message: string;
          status: 'pending' | 'sent' | 'failed';
          retry_count: number;
          error_message: string | null;
          sent_at: string | null;
          created_at: string;
        };
      };
    };
  };
}

