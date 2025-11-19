"use client";

import React from "react";
import { useBookingStore } from "@/lib/store/bookingStore";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

export default function CompletedTaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { bookings } = useBookingStore();
  const router = useRouter();

  
  const { id } = React.use(params);

  // Find the task by bookingId
  const task = bookings.find((b) => b.bookingId === id);

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Task not found 🛠️</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 transition rounded-lg font-medium"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-4 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 transition rounded-lg font-medium"
        >
          ← Back
        </button>
        <span
          className={`px-4 py-1.5 text-sm rounded-full font-semibold ${
            task.currentStatus === "Completed"
              ? "bg-green-700/30 text-green-400"
              : "bg-yellow-700/30 text-yellow-400"
          }`}
        >
          {task.currentStatus}
        </span>
      </div>

      {/* Two-column layout */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        {/* Left Column - Task Details */}
        <div className="flex-1 bg-[#15181D] rounded-2xl p-6 border border-[#2A2F36] shadow-lg">
          <h2 className="text-xl font-bold mb-4">Task Details</h2>
          <p className="text-gray-300 mb-6">
            {task.notes || "No specific notes provided for this service request."}
          </p>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <p>
              <strong className="text-gray-400">Booking ID:</strong> {task.bookingId}
            </p>
            <p>
              <strong className="text-gray-400">Service Name:</strong> {task.serviceName}
            </p>
            <p>
              <strong className="text-gray-400">Completion Date:</strong>{" "}
              {dayjs(task.date).format("YYYY-MM-DD")}
            </p>
            <p>
              <strong className="text-gray-400">Assigned Technician:</strong> John Doe
            </p>
            <p>
              <strong className="text-gray-400">Status:</strong> {task.currentStatus}
            </p>
          </div>
        </div>

        {/* Right Column - Vehicle & Customer Details */}
        <div className="flex-1 bg-[#15181D] rounded-2xl p-6 border border-[#2A2F36] shadow-lg">
          <h2 className="text-xl font-bold mb-4">Vehicle & Customer Details</h2>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <p>
              <strong className="text-gray-400">Vehicle Brand:</strong> {task.vehicle.brand}
            </p>
            <p>
              <strong className="text-gray-400">Model:</strong> {task.vehicle.model}
            </p>
            <p>
              <strong className="text-gray-400">Customer Name:</strong> {task.customerName}
            </p>
            <p>
              <strong className="text-gray-400">Contact:</strong> 078382929
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
