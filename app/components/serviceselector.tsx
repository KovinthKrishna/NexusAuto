import React from 'react';
import { Service, Center } from '../types';

interface ServiceSelectorProps {
  centers: Center[];
  services: Service[];
  selectedCenter: number | null;
  selectedService: number | null;
  onCenterChange: (centerId: number) => void;
  onServiceChange: (serviceId: number) => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  centers,
  services,
  selectedCenter,
  selectedService,
  onCenterChange,
  onServiceChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Center
        </label>
        <select
          value={selectedCenter || ''}
          onChange={(e) => onCenterChange(Number(e.target.value))}
          className="w-full p-3 bg-gray-800/60 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"

        >
          <option value="">Select a center</option>
          {centers.map((center) => (
            <option key={center.id} value={center.id}>
              {center.name} - {center.location}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service
        </label>
        <select
          value={selectedService || ''}
          onChange={(e) => onServiceChange(Number(e.target.value))}
          className="w-full p-3 bg-gray-800/60 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          disabled={!selectedCenter}
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} ({service.duration_minutes} min) - ${service.price}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};