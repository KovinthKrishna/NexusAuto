import { Booking } from "@/lib/store/bookingStore";


interface BookingUpdate {
    bookingId: string;
    newStatus: Booking["currentStatus"];
}

interface fetchBookingRequests extends Booking {
     
}
export type { BookingUpdate, fetchBookingRequests };



