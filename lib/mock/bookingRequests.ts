// /lib/mock/bookingRequests.ts

export interface VehicleInfo {
  brand: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
}

export interface BookingRequest {
  history: any;
  id: string;
  customerId: string;
  vehicleId: string;
  vehicle: VehicleInfo; // new field
  serviceType: string;
  notes: string;
  status: "Pending" | "Accepted" | "Rejected" | "Completed" | "In Progress"| "Hold on";
  requestedDate: string;
  
}

// Dummy booking requests data (temporary simulation)
export const dummyBookingRequests: BookingRequest[] = [
  {
      id: "REQ-001",
      customerId: "68fbad16af0882876851bfa9",
      vehicleId: "68fbad16af0882876851bfa8",
      vehicle: {
          brand: "Toyota",
          model: "Corolla",
          year: 2020,
          color: "White",
          licensePlate: "ABC-1234",
      },
      serviceType: "Oil Change",
      notes: "Please change the oil filter as well.",
      status: "Pending",
      requestedDate: "2025-11-06T09:30:00Z",
      history: undefined
  },
  {
      id: "REQ-002",
      customerId: "68fbad16af0882876851bfaa",
      vehicleId: "68fbad16af0882876851bfab",
      vehicle: {
          brand: "Honda",
          model: "Civic",
          year: 2019,
          color: "Black",
          licensePlate: "XYZ-4567",
      },
      serviceType: "Brake Pad Replacement",
      notes: "Check brake fluid level too.",
      status: "Pending",
      requestedDate: "2025-11-05T15:00:00Z",
      history: undefined
  },
  {
      id: "REQ-003",
      customerId: "68fbad16af0882876851bfac",
      vehicleId: "68fbad16af0882876851bfad",
      vehicle: {
          brand: "Nissan",
          model: "Altima",
          year: 2021,
          color: "Silver",
          licensePlate: "JKL-8901",
      },
      serviceType: "Full Engine Service",
      notes: "Car makes noise during idle.",
      status: "Pending",
      requestedDate: "2025-11-04T10:15:00Z",
      history: undefined
  },
  {
      id: "REQ-004",
      customerId: "68fbad16af0882876851bfae",
      vehicleId: "68fbad16af0882876851bfaf",
      vehicle: {
          brand: "Suzuki",
          model: "Swift",
          year: 2018,
          color: "Red",
          licensePlate: "QWE-5678",
      },
      serviceType: "Wheel Alignment",
      notes: "Car pulls slightly to the left.",
      status: "Pending",
      requestedDate: "2025-11-03T11:45:00Z",
      history: undefined
  },
    {
        id: "REQ-005",
        customerId: "68fbad16af0882876851bfb0",
        vehicleId: "68fbad16af0882876851bfb1",
        vehicle: {
            brand: "Mazda",
            model: "CX-5",
            year: 2022,
            color: "Blue",
            licensePlate: "LMN-2345",
        },
        serviceType: "Battery Replacement",
        notes: "Replace with Amaron Pro battery.",
        status: "Completed",
        requestedDate: "2025-10-30T14:20:00Z",
        history: undefined
    },
    {
        id: "REQ-006",
        customerId: "68fbad16af0882876851bfb4",
        vehicleId: "68fbad16af0882876851bfb3",
        vehicle: {
            brand: "Mazda",
            model: "CX-5",
            year: 2022,
            color: "Blue",
            licensePlate: "LMN-2345",
        },
        serviceType: "Battery Replacement",
        notes: "Replace with Amaron Pro battery.",
        status: "Completed",
        requestedDate: "2025-10-30T14:20:00Z",
        history: undefined
    },
    {
        id: "REQ-007",
        customerId: "68fbad16af0882876851bfe0",
        vehicleId: "68fbad16af0882876851bfa1",
        vehicle: {
            brand: "Mazda",
            model: "CX-5",
            year: 2022,
            color: "Blue",
            licensePlate: "LMN-2345",
        },
        serviceType: "Battery Replacement",
        notes: "Replace with Amaron Pro battery.",
        status: "Completed",
        requestedDate: "2025-10-30T14:20:00Z",
        history: undefined
    },
];
