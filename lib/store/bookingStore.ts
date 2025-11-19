import { create} from 'zustand';
import { Vehicle } from './vehicleStore';

export interface Booking {
    _id: string;
    bookingId: string;
    customerName: string;
    currentStatus: "Pending" | "Accepted" | "Rejected" | "Completed" | "In-Progress"| "Hold on";
    date: string;
    serviceName: string;
    vehicle: Vehicle;
    notes?: string;
    }

interface BookingStore {    
    bookings: Booking[];
    isLoading: boolean;
    error: string | null;

// Store-only operations (work on state only)
    setBookings: (bookings: Booking[]) => void;
    addBooking: (booking: Booking) => void;
    updateBookingStatus: (bookingId: string, newStatus: Booking["currentStatus"]) => void;
    removeBooking: (bookingId: string) => void;

    // helpers
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

}
export const useBookingStore = create<BookingStore>((set) => ({
    bookings: [],
    isLoading: false,
    error: null,

    setBookings: (bookings) => set({ bookings }),

    addBooking: (booking) => {
        set((state) => ({ bookings: [booking, ...state.bookings] }));
    },
    updateBookingStatus: (bookingId, newStatus) => {
        set((state) => ({
            bookings: state.bookings.map((b) => 
                b.bookingId === bookingId ? { ...b, currentStatus: newStatus } : b
            ),
        }));
    },
    removeBooking: (bookingId) => {
        set((state) => ({
            bookings: state.bookings.filter((b) => b.bookingId !== bookingId),
        }));
    },
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
}));


export const useBookingActions = () => {
    const { setBookings, addBooking, updateBookingStatus, removeBooking, setLoading, setError } = useBookingStore();
    return {    
        setBookings,   
        addBooking,
        updateBookingStatus,
        removeBooking,
        setLoading,
        setError,
    };
};

export const useBookings = () => {
    const { bookings, isLoading, error } = useBookingStore();
    return { bookings, isLoading, error };
}