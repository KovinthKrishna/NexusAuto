"use client";

import React, { useEffect, useState } from "react";
import { useBookingStore } from "@/lib/store/bookingStore";
import { bookingRequestsApi } from "@/lib/api/bookingRequestsClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCarSide,
  FaInfoCircle,
  FaCheck,
  FaClock,
  FaCalendarAlt,
  FaTasks,
  FaSpinner,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function InProgressProjectsPage() {
  const { bookings, setBookings, updateBookingStatus } = useBookingStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [clientDate, setClientDate] = useState<string>("");

  // Fetch booking requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching booking requests...");
        const fetchedBookings = await bookingRequestsApi.fetchBookingRequests();
        setBookings(fetchedBookings);
      } catch (err) {
        console.error("Failed to fetch booking requests:", err);
      }
    };
    fetchData();
  }, [setBookings]);

  // Set date on client to avoid hydration errors
  useEffect(() => {
    setClientDate(new Date().toLocaleDateString());
  }, []);

  const inProgressBookings = bookings?.filter(
    (req) => req.currentStatus === "In-Progress"
  );

  const selectedRequest = inProgressBookings?.find(
    (req) => req.bookingId === selectedId
  );

  const handleMarkCompleted = async (bookingId: string) => {
    try {
      setLoadingId(bookingId);
      const updatedBooking = await bookingRequestsApi.updateBookingStatus({
        bookingId,
        newStatus: "Completed",
      });

      updateBookingStatus(bookingId, "Completed");
      toast.success("Marked as Completed successfully!");
      console.log("Updated Booking:", updatedBooking);
    } catch (err) {
      toast.error("Failed to update booking status");
      console.error("Error updating booking:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen text-white p-4 md:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent flex items-center gap-3">
              <FaSpinner className="text-amber-400 animate-spin" />
              In-Progress Tasks
            </h1>
            <p className="text-slate-400 mt-2">
              Monitor and complete ongoing service bookings
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4 bg-slate-800/50 px-6 py-3 rounded-xl border border-slate-700/50">
            <FaTasks className="text-amber-400 text-xl" />
            <div className="text-right">
              <p className="text-xs text-slate-400">Active Tasks</p>
              <p className="text-2xl font-bold text-amber-400">
                {inProgressBookings?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-amber-500/20 p-4 rounded-xl">
                <FaClock className="text-2xl text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total In Progress</p>
                <p className="text-2xl font-bold">
                  {inProgressBookings?.length || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-4 rounded-xl">
                <FaCalendarAlt className="text-2xl text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Today's Date</p>
                <p className="text-lg font-semibold">{clientDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500/20 p-4 rounded-xl">
                <FaCheck className="text-2xl text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Completion Rate</p>
                <p className="text-lg font-semibold">Track Progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Active Tasks List */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 px-6 py-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <FaTasks className="text-amber-400 text-xl" />
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {inProgressBookings?.length || 0}
                </span>
              </div>
              <h2 className="text-xl font-semibold">Ongoing Tasks</h2>
            </div>
          </div>

          <div className="p-4 space-y-3 max-h-[calc(100vh-380px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
            <AnimatePresence>
              {inProgressBookings?.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="bg-slate-700/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    <FaTasks className="text-5xl text-slate-600" />
                  </div>
                  <p className="text-slate-400 text-lg font-medium">
                    No in-progress bookings
                  </p>
                  <p className="text-slate-500 text-sm mt-2">
                    All tasks are completed or pending
                  </p>
                </motion.div>
              )}

              {inProgressBookings?.map((req, index) => (
                <motion.div
                  key={req.bookingId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  exit={{ opacity: 0, x: -20 }}
                  whileHover={{ scale: 1.01 }}
                  className={`p-5 rounded-xl cursor-pointer transition-all duration-300 border ${
                    selectedId === req.bookingId
                      ? "bg-gradient-to-r from-amber-600/30 to-orange-600/30 border-amber-500/50 shadow-lg shadow-amber-500/20"
                      : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600"
                  }`}
                  onClick={() => setSelectedId(req.bookingId)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {req.serviceName}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                        <FaCarSide className="text-amber-400" />
                        <span>
                          {req.vehicle.brand} {req.vehicle.model}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <FaCalendarAlt className="text-blue-400" />
                        <span>
                          {new Date(req.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <FaSpinner className="animate-spin" />
                        {req.currentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Complete Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loadingId === req.bookingId}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkCompleted(req.bookingId);
                    }}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 px-4 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                  >
                    {loadingId === req.bookingId ? (
                      <>
                        <FaSpinner className="animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <FaCheck /> Mark as Completed
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side - Task Details */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 px-6 py-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <FaInfoCircle className="text-amber-400 text-xl" />
              <h2 className="text-xl font-semibold">Task Details</h2>
            </div>
          </div>

          <div className="p-6">
            {selectedRequest ? (
              <motion.div
                key={selectedRequest.bookingId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Status and ID */}
                <div className="flex items-center justify-between">
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-2">
                    <FaSpinner className="animate-spin" />
                    {selectedRequest.currentStatus}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Task ID</p>
                    <p className="text-sm font-mono text-slate-300">
                      {selectedRequest.bookingId.slice(0, 8)}
                    </p>
                  </div>
                </div>

                {/* Service Information */}
                <div className="bg-gradient-to-br from-slate-700/40 to-slate-700/20 rounded-xl p-5 border border-slate-600/30">
                  <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                    <FaTasks />
                    Service Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-600/30">
                      <span className="text-slate-400">Service Type</span>
                      <span className="font-semibold text-white">
                        {selectedRequest.serviceName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-600/30">
                      <span className="text-slate-400">Appointment Date</span>
                      <span className="font-medium text-white">
                        {new Date(selectedRequest.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Appointment Time</span>
                      <span className="font-medium text-white">
                        {new Date(selectedRequest.date).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Info & Notes remain same as before */}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-380px)] text-slate-400">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <div className="bg-slate-700/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    <FaInfoCircle className="text-5xl text-slate-600" />
                  </div>
                  <p className="text-lg font-medium">Select a task</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Click on any ongoing task to view details
                  </p>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
