import { Database } from './database';

export type RoomRow = Database['public']['Tables']['rooms']['Row'];
export type RoomPricingRow = Database['public']['Tables']['room_pricing']['Row'];
export type RoomAmenityRow = Database['public']['Tables']['room_amenities']['Row'];

export interface RoomWithPricing extends RoomRow {
  pricing?: RoomPricingRow;
  amenities?: RoomAmenityRow[];
  is_available?: boolean;
}

