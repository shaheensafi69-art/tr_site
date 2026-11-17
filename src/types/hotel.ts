import { Database } from './database';

export type HotelRow = Database['public']['Tables']['hotels']['Row'];
export type ProvinceRow = Database['public']['Tables']['provinces']['Row'];
export type CityRow = Database['public']['Tables']['cities']['Row'];
export type HotelAmenityRow = Database['public']['Tables']['hotel_amenities']['Row'];

export interface HotelWithDetails extends HotelRow {
  province?: ProvinceRow;
  city?: CityRow;
  amenities?: HotelAmenityRow[];
  min_price?: number;
  rooms_count?: number;
}

export interface HotelFilterParams {
  provinceSlug?: string;
  citySlug?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  minPrice?: number;
  maxPrice?: number;
  stars?: number[];
  amenities?: string[];
  bookingType?: 'daily' | 'hourly' | 'all';
  hasBreakfast?: boolean;
  sortBy?: 'recommended' | 'price_asc' | 'price_desc' | 'rating_desc' | 'stars_desc';
}

