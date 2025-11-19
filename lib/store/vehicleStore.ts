import { create } from 'zustand';

export interface Vehicle {
    _id: string;
    vehicleType: string;
    brand: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
    notes?: string;
}

interface VehicleStore {
    vehicles: Vehicle[];
    isLoading: boolean;
    error: string | null;

    // Store-only operations (work on state only)
    addVehicle: (vehicle: Vehicle) => void;
    setVehicles: (vehicles: Vehicle[]) => void;
    removeVehicle: (vehicleId: string) => void;
    updateVehicle: (vehicleId: string, updatedData: Partial<Omit<Vehicle, '_id'>>) => void;

    // helpers
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useVehicleStore = create<VehicleStore>((set) => ({
    vehicles: [],
    isLoading: false,
    error: null,

    addVehicle: (vehicle) => {
        set((state) => ({ vehicles: [vehicle, ...state.vehicles] }));
    },

    setVehicles: (vehicles) => {
        set({ vehicles });
    },

    removeVehicle: (vehicleId) => {
        set((state) => ({ vehicles: state.vehicles.filter(v => v._id !== vehicleId) }));
    },

    updateVehicle: (vehicleId, updatedData) => {
        set((state) => ({
            vehicles: state.vehicles.map(v =>
                v._id === vehicleId ? { ...v, ...updatedData } : v
            )
        }));
    },

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
}));

export const useVehicleActions = () => {
    const { addVehicle, setVehicles, removeVehicle, updateVehicle, setLoading, setError } = useVehicleStore();
    return {
        addVehicle,
        setVehicles,
        removeVehicle,
        updateVehicle,
        setLoading,
        setError,
    };
};

export const useVehicles = () => {
    const { vehicles, isLoading, error } = useVehicleStore();
    return {
        vehicles,
        isLoading,
        error,
    };
};
