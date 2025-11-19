"use client";
import React, { useState, useEffect, use } from 'react';
import { ServiceSelector } from '../components/serviceselector';
import { AvailabilityDisplay } from '../components/availabilitydisplay';
import { BookingForm } from '../components/bookingform';
import { VehicleSelector } from '../components/VehicleSelector';   // <-- Added
import { bookingAPI } from '../utils/api';
import { Center, Service, TimeSlot, AvailabilityResponse, BookingData,Vehicle } from '../types';
import { Card } from '../components/ui/card';
import { SuccessModal } from '../components/successmodal';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/authStore';

const Home: React.FC = () => {
  const [centers, setCenters] = useState<Center[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);  // <-- Added
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Authentication check
  useEffect(() => {
    if (!isLoading && user) {
      console.log("Current user ID:", user.id); // Debug log
      setIsCheckingAuth(false);
      if (!isAuthenticated) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Load centers & services
  useEffect(() => {
if (!isAuthenticated || isCheckingAuth || !user) return;

    const loadData = async () => {
      try {
        const [centersData, servicesData,getVehicles] = await Promise.all([
          bookingAPI.getCenters(),
          bookingAPI.getServices(),
          bookingAPI.getVehicles(user.id) 
        ]);
        setCenters(centersData);
        setServices(servicesData);
        setVehicles(getVehicles);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [isAuthenticated, isCheckingAuth]);

  // Check availability
  useEffect(() => {
    if (!isAuthenticated || isCheckingAuth) return;

    if (selectedCenter && selectedService && selectedDate) {
      checkAvailability();
    } else {
      setAvailability(null);
    }
  }, [selectedCenter, selectedService, selectedDate, isAuthenticated, isCheckingAuth]);

  if (isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  const checkAvailability = async () => {
    if (!selectedCenter || !selectedService || !selectedDate) return;

    setLoading(true);
    try {
      const availabilityData = await bookingAPI.checkAvailability(
        selectedCenter,
        selectedDate,
        selectedService
      );
      setAvailability(availabilityData);
    } catch (error) {
      console.error('Error checking availability:', error);
      alert('Error checking availability. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setBookingSuccess(null);
  };

  const handleBookingSubmit = async (bookingData: BookingData) => {
    if (!selectedVehicle) {
      alert("Please select a vehicle before booking.");
      return;
    }

    setBookingLoading(true);
    try {
      const finalData = {
        ...bookingData,
        customer_id: user!.id,
        vehicle_Name: selectedVehicle,  // <-- Attach vehicle to booking
      };

      await bookingAPI.createBooking(finalData);

      setShowSuccessModal(true);
      setSelectedSlot(null);
      await checkAvailability();
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push('/');
  };

  const getSelectedService = () => services.find(s => s.id === selectedService) || null;
  const getSelectedCenter = () => centers.find(c => c.id === selectedCenter) || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
      <div className="max-w-5xl mx-auto px-6">

        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-extrabold text-gray-900">
            Service Booking System
          </h1>
        </div>

        {/* Service Selection */}
        <Card className="mb-8 p-6 shadow-lg bg-white">
          <ServiceSelector
            centers={centers}
            services={services}
            selectedCenter={selectedCenter}
            selectedService={selectedService}
            onCenterChange={setSelectedCenter}
            onServiceChange={setSelectedService}
          />

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
            />
          </div>
        </Card>

        <AvailabilityDisplay
          availability={availability}
          selectedService={getSelectedService()}
          selectedDate={selectedDate}
          onSlotSelect={handleSlotSelect}
          loading={loading}
        />

        {/* Booking Form + Vehicle Selector */}
        {selectedSlot && (
          <div className="mt-8 p-6 shadow-lg bg-white rounded-xl">

            {/* Vehicle Selector */}
            <VehicleSelector
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onVehicleChange={setSelectedVehicle}
              
            />

            {/* Booking Form */}
            <BookingForm
              selectedSlot={selectedSlot}
              selectedCenter={getSelectedCenter()}
              selectedService={getSelectedService()}
              selectedDate={selectedDate}
              onBookingSubmit={handleBookingSubmit}
              onCancel={() => setSelectedSlot(null)}
              loading={bookingLoading}
            />
          </div>
        )}

        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          title="Appointment Booked Successfully!"
          message="Your service appointment has been confirmed."
          buttonText="Back to Dashboard"
        />
      </div>
    </div>
  );
};

export default Home;
