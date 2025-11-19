import { BookingUpdate, fetchBookingRequests } from '@/interfaces/bookingUpdate';
import {useBookingStore} from '../store/bookingStore';
import axios from "axios";
import { useAuthStore } from '../store/authStore';

const API_BASE_URL =process.env.AUTH_SERVICE_API_URL2 || "http://localhost:3004";
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to automatically add authorization header
 apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for global error handling and token management
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { logout } = useAuthStore.getState();

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      logout();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

//booking request Updates API methods
export const bookingRequestsApi = {
    // Fetch all booking requests
    fetchBookingRequests: async () => {
       const response = await apiClient.get<fetchBookingRequests[]>(`/api/bookings`);
       console.log("Booking Requests Response:", response.data);
        return response.data; // directly return the array
},

    updateBookingStatus: async (data: BookingUpdate) => {
    const response = await apiClient.patch<{ message: string; updatedBooking: fetchBookingRequests }>(
    `/api/bookings/${data.bookingId}/status`,
    { newStatus: data.newStatus }
     );
     return response.data.updatedBooking;
     },


};
