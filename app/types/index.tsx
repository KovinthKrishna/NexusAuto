export interface Center {
  id: number;
  name: string;
  location: string;
}

export interface Service {
  id: number;
  name: string;
  category: string;
  duration_minutes: number;
  price: number;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  gap_remaining_after: number;
}

export interface AvailabilityResponse {
  available: boolean;
  slots: TimeSlot[];
  message?: string;
  suggested_dates?: Array<{
    date: string;
    num_slots: number;
    earliest_start: string | null;
  }>;
}

export interface BookingData {
  center_id: number;
  service_id: number;
  date: string;
  start_time: string;
  end_time: string;
  customer_name: string;
}

export interface Booking extends BookingData {
  id: number;
  status: string;
  created_at: string;
  center: Center;
  service: Service;
}

export interface Vehicle {
  id: number;
  type?: string;
}
