import axios from 'axios';
import { AvailabilityResponse, BookingData, Booking, Center, Service, Vehicle } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const bookingAPI = {
  // Check availability
  checkAvailability: async (centerId: number, date: string, serviceId: number): Promise<AvailabilityResponse> => {
    const response = await api.get(`/availability/${centerId}/${date}/${serviceId}/`);
    return response.data;
  },

  // Create booking
  createBooking: async (bookingData: BookingData): Promise<Booking> => {
    const response = await api.post('/bookings/', bookingData);
    return response.data;
  },

  // Get all bookings (optional)
  getBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings/');
    return response.data;
  },

  getCenters: async (): Promise<Center[]> => {
    const response = await api.get('/centers/');
    return response.data;
  },

  getServices: async (): Promise<Service[]> => {
    const response = await api.get('/services/');
    return response.data;
  },

  getVehicles: async (userId: number): Promise<Vehicle[]> => {
    // const response = await api.get(`/vehicles/?user_id=${userId}`);
    // return response.data;
    return [
      { id: 1, type: "Car A" },
      { id: 2, type: "Bike B" },
    ];
  },
};