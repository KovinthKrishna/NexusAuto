import { useAuthStore } from "../store/authStore";
import axios from "axios";

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

// Vehicle API methods
export const vehicleApi = {
  addVehicle: async (data: VehicleRequest) => {
  const response = await apiClient.post<{ message: string; vehicle: VehicleResponse }>(
    '/api/vehicle/add_vehicles',
    data
  );

  console.log("Add Vehicle Data:", data);
  console.log("Add Vehicle Response:", response.data.vehicle);

  return response.data.vehicle;
},

    getVehicles: async () => {
    const response = await apiClient.get<VehicleResponse[]>(`/api/vehicle/get_vehicles`);
    return response.data;
  },
  
    removeVehicle: async (data: VehicleRemoveRequest) => {
    const response = await apiClient.delete(`/api/vehicle/delete_vehicle/${data.vehicleId}`);
    return response.data;
  },

    updateVehicle: async (vehicleId: string, data: VehicleUpdateRequest) => {
    const response = await apiClient.put<VehicleResponse>(`/api/vehicle/update_vehicle/${vehicleId}`, data);
    return response.data;
  }

};

