interface ProjectRequest {
    vehicleId: string;
    appointmentId: string;
    customerId: string;
    serviceType: string;
    projectType: "Service" | "Modification";
     notes?: string;
}