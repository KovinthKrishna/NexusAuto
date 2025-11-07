import React from 'react';
import { AvailabilityResponse, TimeSlot, Service } from '../types';
import { Button } from './ui/buttons';
import { Card } from './ui/card';

interface AvailabilityDisplayProps {
  availability: AvailabilityResponse | null;
  selectedService: Service | null;
  selectedDate: string;
  onSlotSelect: (slot: TimeSlot) => void;
  loading: boolean;
}

export const AvailabilityDisplay: React.FC<AvailabilityDisplayProps> = ({
  availability,
  selectedService,
  selectedDate,
  onSlotSelect,
  loading,
}) => {
  if (loading) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking availability...</p>
        </div>
      </Card>
    );
  }

  if (!availability) {
    return (
      <Card>
        <div className="text-center py-8 text-gray-500">
          Select a center, service, and date to see available slots
        </div>
      </Card>
    );
  }

  if (!availability.available) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-red-600 text-lg font-semibold mb-4">
            No slots available on {selectedDate}
          </div>
          <p className="text-gray-600 mb-4">{availability.message}</p>
          
          {availability.suggested_dates && availability.suggested_dates.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Suggested Dates:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {availability.suggested_dates.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="font-medium">{suggestion.date}</div>
                    <div className="text-sm text-gray-600">
                      {suggestion.num_slots} slots available
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-black text-xl font-semibold mb-4">
        Available Slots for {selectedDate}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {availability.slots.map((slot, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-black text-lg font-semibold text-center mb-2">
              {slot.start_time} - {slot.end_time}
            </div>
            <div className="text-blacktext-sm text-gray-600 text-center mb-3">
              {selectedService?.duration_minutes} min service
            </div>
            <Button
              onClick={() => onSlotSelect(slot)}
              className="w-full"
            >
              Book This Slot
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};