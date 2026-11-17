import { Database } from './database';
import { HotelRow } from './hotel';
import { RoomRow } from './room';

export type BookingRow = Database['public']['Tables']['bookings']['Row'];
export type CustomerRow = Database['public']['Tables']['customers']['Row'];
export type PaymentRow = Database['public']['Tables']['payments']['Row'];
export type BankAccountRow = Database['public']['Tables']['bank_accounts']['Row'];

export interface BookingWithDetails extends BookingRow {
  customer?: CustomerRow;
  hotel?: HotelRow;
  room?: RoomRow;
  payment?: PaymentRow;
}

export interface CreateBookingInput {
  hotel_id: string;
  room_id: string;
  booking_type: 'daily' | 'hourly';
  check_in_date: string;
  check_out_date: string;
  check_in_time?: string;
  duration_hours?: number;
  adults_count: number;
  children_count?: number;
  breakfast_included: boolean;
  currency: 'TOMAN' | 'USD' | 'EUR' | 'AFN';
  customer_name: string;
  customer_phone: string;
  customer_country_code?: string;
  customer_email?: string;
  special_requests?: string;
}

export interface BookingTrackingResult {
  booking: BookingWithDetails;
  hotel: HotelRow;
  room: RoomRow;
  payment: PaymentRow | null;
  bank_account: BankAccountRow | null;
}

