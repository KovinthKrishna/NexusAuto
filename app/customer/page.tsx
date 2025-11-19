"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/store/authStore";
import AddVehicle from "@/components/vehicle/AddVehicle";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

/**
 * Customer Dashboard component
 *
 * Features:
 * - Customer-specific content
 * - Service history
 * - Appointment booking
 * - Vehicle management
 */
export default function CustomerDashboard() {
  return (
    // <ProtectedRoute requiredRole={["ROLE_CUSTOMER"]}>
    <CustomerDashboardContent />
    // </ProtectedRoute>
  );
}

function CustomerDashboardContent() {
  const { user } = useAuth();
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const router = useRouter(); // Initialize router

  const handleBookAppointment = () => {
    router.push('/booking'); // Navigate to booking page
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {user?.firstName}! Manage your vehicles and service
          appointments.
        </p>
      </div>

      {/* Dashboard Overview */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10l-2-18h3.5a.5.5 0 01.5.5V3H5v-.5a.5.5 0 01.5-.5H9l-2 18z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    My Vehicles
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">2</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a4 4 0 118 0v4m-8 0h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Active Services
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">1</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a4 4 0 118 0v4m-8 0h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Upcoming Appointments
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">1</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Service History
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">12</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={handleBookAppointment}
            className="rounded-lg bg-blue-600 p-6 text-white transition-colors hover:bg-blue-700">

            <div className="text-center">
              <svg
                className="mx-auto mb-2 h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3a4 4 0 118 0v4m-8 0h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z"
                />
              </svg>
              <p className="font-medium">Book Appointment</p>
              <p className="mt-1 text-sm text-blue-100">
                Schedule your next service
              </p>
            </div>
          </button>

          <button className="rounded-lg bg-green-600 p-6 text-white transition-colors hover:bg-green-700 cursor-pointer"
            onClick={() => setIsAddVehicleOpen(true)}>
            <div className="text-center">
              <svg
                className="mx-auto mb-2 h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <p className="font-medium">Add Vehicle</p>
              <p className="mt-1 text-sm text-green-100">
                Register a new vehicle
              </p>
            </div>
          </button>

          <button className="rounded-lg bg-purple-600 p-6 text-white transition-colors hover:bg-purple-700">
            <div className="text-center">
              <svg
                className="mx-auto mb-2 h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="font-medium">View History</p>
              <p className="mt-1 text-sm text-purple-100">
                Check service records
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* My Vehicles */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">My Vehicles</h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 rounded-lg border border-gray-200 p-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    2020 Honda Civic
                  </p>
                  <p className="text-sm text-gray-500">License: ABC-123</p>
                  <p className="text-sm text-gray-500">
                    Last service: 2 weeks ago
                  </p>
                </div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Good
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 rounded-lg border border-gray-200 p-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    2018 Toyota Camry
                  </p>
                  <p className="text-sm text-gray-500">License: XYZ-789</p>
                  <p className="text-sm text-gray-500">
                    Last service: 1 month ago
                  </p>
                </div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Due Soon
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">
              Upcoming Appointments
            </h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-4 rounded-lg border border-gray-200 p-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a4 4 0 118 0v4m-8 0h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Oil Change Service
                  </p>
                  <p className="text-sm text-gray-500">Honda Civic - ABC-123</p>
                  <p className="text-sm text-gray-500">Tomorrow at 10:00 AM</p>
                  <p className="text-sm text-gray-500">Service Bay 3</p>
                </div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    Confirmed
                  </span>
                </div>
              </div>

              <div className="py-8 text-center text-gray-500">
                <p className="text-sm">No other appointments scheduled</p>
                <button className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                  Schedule an appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddVehicle
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
      />
    </div>
  );
}
