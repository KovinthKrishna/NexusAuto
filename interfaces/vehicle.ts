interface VehicleRequest {
    vehicleType: string;
    brand: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
    notes?: string;
}

interface VehicleResponse extends VehicleRequest {
    _id: string;
}

interface VehicleUpdateRequest {
    vehicleType?: string;
    brand?: string;
    model?: string;
    year?: number;
    licensePlate?: string;
    color?: string;
    notes?: string;
}

interface VehicleRemoveRequest {
    vehicleId: string;
}