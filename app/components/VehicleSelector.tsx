import React from 'react';
import { Vehicle } from '../types';

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicle: string | null;
  onVehicleChange: (vehicleId: string) => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  vehicles,
  selectedVehicle,
  onVehicleChange,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Vehicle
      </label>

      <select
        value={selectedVehicle || ''}
        onChange={(e) => onVehicleChange(e.target.value)}
        className="w-full p-3 bg-gray-800/60 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
      >
        <option value="">Choose your vehicle</option>

        {vehicles.map((vehicle, idx) => (
          <option key={idx} value={vehicle.type}> {/* <-- use type */}
            {vehicle.type}
          </option>
        ))}
      </select>
    </div>
  );
};
