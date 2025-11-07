import React, { useState } from 'react';
import { BookingData, TimeSlot, Center, Service } from '../types';
import { Button } from './ui/buttons';
import { Card } from './ui/card';

interface BookingFormProps {
  selectedSlot: TimeSlot | null;
  selectedCenter: Center | null;
  selectedService: Service | null;
  selectedDate: string;
  onBookingSubmit: (bookingData: BookingData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedSlot,
  selectedCenter,
  selectedService,
  selectedDate,
  onBookingSubmit,
  onCancel,
  loading = false,
}) => {
  const [customerName, setCustomerName] = useState('');

  if (!selectedSlot || !selectedCenter || !selectedService) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingData: BookingData = {
      center_id: selectedCenter.id,
      service_id: selectedService.id,
      date: selectedDate,
      start_time: selectedSlot.start_time,
      end_time: selectedSlot.end_time,
      customer_name: customerName,
    };

    onBookingSubmit(bookingData);
  };

  return (
    <Card className="mt-6">
      <h2 className="text-black text-xl font-semibold mb-4">Complete Your Booking</h2>
      
      <div className="text-black mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Booking Details:</h3>
        <p><strong>Center:</strong> {selectedCenter.name}</p>
        <p><strong>Service:</strong> {selectedService.name}</p>
        <p><strong>Date:</strong> {selectedDate}</p>
        <p><strong>Time:</strong> {selectedSlot.start_time} - {selectedSlot.end_time}</p>
        <p><strong>Duration:</strong> {selectedService.duration_minutes} minutes</p>
        <p><strong>Price:</strong> ${selectedService.price}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4 text-black">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your full name"
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={!customerName.trim() || loading}
            className="flex-1"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};