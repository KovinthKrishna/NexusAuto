"use client";

import React, { useState, useEffect } from "react";
import { useBookingStore } from "@/lib/store/bookingStore";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function CompletedProjectsPage() {
  const { bookings } = useBookingStore();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [sortField, setSortField] = useState<"serviceName" | "appointDate">(
    "appointDate"
  );
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Fix hydration issue
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter completed bookings
  const completedBookings = bookings.filter(
    (b) => b.currentStatus === "Completed"
  );

  const totalPages = Math.max(1, Math.ceil(completedBookings.length / itemsPerPage));

  //  Sorting logic
  const sortedBookings = [...completedBookings].sort((a, b) => {
    if (sortField === "serviceName") {
      return a.serviceName.localeCompare(b.serviceName);
    } else {
      return (
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }
  });

  // Pagination logic
  const paginatedBookings = sortedBookings.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Navigate to detail page
  const handleRowClick = (bookingId: string) => {
    router.push(`/employee/projects/completed/${bookingId}`);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen text-white p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 w-full max-w-5xl">
        Completed Bookings
      </h1>

      {/* Sort + Filter Controls */}
      <div className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by service, vehicle, or date..."
          className="w-full sm:w-2/3 bg-[#1C1F24] border border-[#2E333A] rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-green-500"
        />
        <div className="flex gap-3">
          <select
            className="bg-[#1C1F24] border border-[#2E333A] rounded-lg px-4 py-2 text-sm outline-none"
            value={sortField}
            onChange={(e) =>
              setSortField(e.target.value as "serviceName" | "appointDate")
            }
          >
            <option value="appointDate">Sort By: Completion Date</option>
            <option value="serviceName">Sort By: Service Name</option>
          </select>
          <select className="bg-[#1C1F24] border border-[#2E333A] rounded-lg px-4 py-2 text-sm outline-none">
            <option>Filter By Date</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full max-w-7xl overflow-x-auto border border-[#2E333A] rounded-xl bg-[#15181D] shadow-lg">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#1F2228] text-gray-300">
            <tr>
              <th className="p-3 text-left">BOOKING</th>
              <th className="p-3 text-left">COMPLETION DATE</th>
              <th className="p-3 text-left">NOTES</th>
              <th className="p-3 text-left">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBookings.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">
                  No completed bookings found.
                </td>
              </tr>
            ) : (
              paginatedBookings.map((task, index) => (
                <motion.tr
                  key={task.bookingId}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleRowClick(task.bookingId)}
                  className="border-b border-[#2E333A] hover:bg-[#1C2026] cursor-pointer"
                >
                  <td className="p-3 font-medium text-white">
                    {task.vehicle.brand} {task.vehicle.model} –{" "}
                    {task.serviceName}
                  </td>
                  <td className="p-3 text-gray-400">
                    {new Date(task.date).toLocaleDateString("en-US")}
                  </td>
                  <td className="p-3 text-gray-400 truncate max-w-[300px]">
                    {task.notes || "No notes available"}
                  </td>
                  <td className="p-3">
                    <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                      <FaCheckCircle className="text-green-400" /> Completed
                    </span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center w-full max-w-7xl mt-4 text-sm text-gray-400">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`flex items-center gap-1 px-3 py-1 rounded-md ${
            page === 1
              ? "text-gray-500 cursor-not-allowed"
              : "hover:text-white hover:bg-[#1C1F24]"
          }`}
        >
          <IoChevronBack /> Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={`flex items-center gap-1 px-3 py-1 rounded-md ${
            page === totalPages
              ? "text-gray-500 cursor-not-allowed"
              : "hover:text-white hover:bg-[#1C1F24]"
          }`}
        >
          Next <IoChevronForward />
        </button>
      </div>
    </div>
  );
}
