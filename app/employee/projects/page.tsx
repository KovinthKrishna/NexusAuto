"use client";

import React, { useEffect, useState } from "react";
import { useBookingStore } from "@/lib/store/bookingStore";
import { bookingRequestsApi } from "@/lib/api/bookingRequestsClient";
import {
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaCarSide,
  FaClock,
  FaCalendarAlt,
  FaClipboardList,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function ProjectsPage() {
  const { bookings, updateBookingStatus, setBookings } = useBookingStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [currentTime, setCurrentTime] = useState<string>("");

  const selectedRequest = bookings?.find((req) => req.bookingId === selectedId);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching booking requests...");
        const fetchedBookings = await bookingRequestsApi.fetchBookingRequests();
        setBookings(fetchedBookings);
        console.log("Fetched bookings:", fetchedBookings);
      } catch (err) {
        console.error("Failed to fetch booking requests:", err);
      }
    };

    fetchData();
  }, [setBookings]);



  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle status update
  const handleStatusChange = async (
    bookingId: string,
    newStatus: "Accepted" | "Rejected" | "Completed"
  ) => {
    try {
      setLoadingId(bookingId);
      const updatedBooking = await bookingRequestsApi.updateBookingStatus({
        bookingId,
        newStatus,
      });
      updateBookingStatus(bookingId, newStatus);
      toast.success(`Booking ${newStatus} successfully`, { position: "top-center" });
      console.log("Updated Booking:", updatedBooking);
    } catch (err) {
      toast.error("Failed to update booking status", { position: "top-center" });
      console.error("Error updating booking:", err);
    } finally {
      setLoadingId(null);
    }
  };

  // Color badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Accepted":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "Rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  // Filter bookings by status
  const filteredBookings =
    filterStatus === "All"
      ? bookings
      : bookings?.filter((b) => b.currentStatus === filterStatus);

  const statusCounts = {
    All: bookings?.length || 0,
    Pending: bookings?.filter((b) => b.currentStatus === "Pending").length || 0,
    Accepted: bookings?.filter((b) => b.currentStatus === "Accepted").length || 0,
    Completed: bookings?.filter((b) => b.currentStatus === "Completed").length || 0,
  };

  return (
    <div className="min-h-screen text-white p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Booking Management
            </h1>
            <p className="text-slate-400 mt-2">Manage and track service bookings</p>
          </div>

          
          <div className="hidden md:flex items-center gap-4 bg-slate-800/50 px-6 py-3 rounded-xl border border-slate-700/50">
            <FaClock className="text-cyan-400" />
            <div className="text-right">
              <p className="text-xs text-slate-400">Last Updated</p>
              <p className="text-sm font-medium">{currentTime}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilterStatus(status)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                filterStatus === status
                  ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/50"
                  : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
              }`}
            >
              <p className="text-2xl md:text-3xl font-bold">{count}</p>
              <p className="text-xs md:text-sm text-slate-400 mt-1">{status}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings List */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 px-6 py-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <FaClipboardList className="text-cyan-400 text-xl" />
              <h2 className="text-xl font-semibold">Booking Requests</h2>
              <span className="ml-auto bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium">
                {filteredBookings?.length || 0}
              </span>
            </div>
          </div>

          <div className="p-4 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
            <AnimatePresence>
              {filteredBookings?.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <FaInfoCircle className="text-5xl text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No bookings found</p>
                </motion.div>
              )}

              {filteredBookings?.map((req, index) => (
                <motion.div
                  key={req.bookingId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.01 }}
                  className={`p-5 rounded-xl cursor-pointer transition-all duration-300 border ${
                    selectedId === req.bookingId
                      ? "bg-linear-to-r from-blue-600/30 to-cyan-600/30 border-blue-500/50 shadow-lg shadow-blue-500/20"
                      : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600"
                  }`}
                  onClick={() => setSelectedId(req.bookingId)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {req.serviceName}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <FaCarSide className="text-cyan-400" />
                       <span>
                     {req.vehicle?.brand ?? ""} {req.vehicle?.model ?? ""}
                       </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs mt-2">
                        <FaCalendarAlt className="text-blue-400" />
                        <span>{new Date(req.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        req.currentStatus
                      )}`}
                    >
                      {req.currentStatus}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  {(req.currentStatus === "Pending" ||
                    req.currentStatus === "Accepted") && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700/50">
                      {req.currentStatus === "Pending" && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={loadingId === req.bookingId}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(req.bookingId, "Accepted");
                            }}
                            className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                          >
                            <FaCheck /> Accept
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={loadingId === req.bookingId}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(req.bookingId, "Rejected");
                            }}
                            className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 disabled:opacity-50 shadow-lg shadow-red-500/20"
                          >
                            <FaTimes /> Reject
                          </motion.button>
                        </>
                      )}

                      {req.currentStatus === "Accepted" && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={loadingId === req.bookingId}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(req.bookingId, "Completed");
                          }}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 shadow-lg shadow-blue-500/20"
                        >
                          Mark as Completed
                        </motion.button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 px-6 py-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <FaInfoCircle className="text-cyan-400 text-xl" />
              <h2 className="text-xl font-semibold">Booking Details</h2>
            </div>
          </div>

          <div className="p-6">
            {selectedRequest ? (
              <motion.div
                key={selectedRequest.bookingId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                      selectedRequest.currentStatus
                    )}`}
                  >
                    {selectedRequest.currentStatus}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Booking ID</p>
                    <p className="text-sm font-mono">
                      {selectedRequest?.bookingId.slice(0, 8)}
                    </p>
                  </div>
                </div>

                {/* Service Info */}
                <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">
                    Service Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Service Type</span>
                      <span className="font-medium">
                        {selectedRequest.serviceName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Appointment Date</span>
                      <span className="font-medium">
                        {new Date(selectedRequest.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Appointment Time</span>
                      <span className="font-medium">
                        {new Date(selectedRequest.date).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
                  <div className="flex items-center gap-2 mb-3">
                    <FaCarSide className="text-cyan-400 text-xl" />
                    <h3 className="text-lg font-semibold">
                      Vehicle Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Brand</p>
                      <p className="font-medium">
                        {selectedRequest?.vehicle?.brand || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Model</p>
                      <p className="font-medium">
                        {selectedRequest?.vehicle?.model || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Year</p>
                      <p className="font-medium">
                        {selectedRequest?.vehicle?.year || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Color</p>
                      <p className="font-medium">
                      {selectedRequest?.vehicle?.color || "Not specified"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-400 mb-1">
                        License Plate
                      </p>
                      <p className="font-medium font-mono bg-slate-600/30 px-3 py-2 rounded-lg inline-block">
                        {selectedRequest?.vehicle?.licensePlate || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedRequest?.notes && (
                  <div className="bg-slate-700/30 rounded-xl p-5 border border-slate-600/30">
                    <h3 className="text-sm font-semibold text-slate-400 mb-2">
                      Additional Notes
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      {selectedRequest?.notes}
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)] text-slate-400">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <FaInfoCircle className="text-6xl mb-4 text-slate-600 mx-auto" />
                  <p className="text-lg font-medium">Select a booking</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Click on any booking to view details
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
