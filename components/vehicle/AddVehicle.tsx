"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { MdDirectionsCar } from "react-icons/md";
import vehicleImage from "@/public/Vehicle/Addvehicle.jpg";
import toast from "react-hot-toast";
import { vehicleApi } from "@/lib/api/addVehicleClient";
import { useVehicles, useVehicleActions, Vehicle } from "@/lib/store/vehicleStore";

interface FormData {
  id?: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  notes: string;
}

const initialFormState: FormData = {
  vehicleType: "",
  brand: "",
  model: "",
  year: 0,
  licensePlate: "",
  color: "",
  notes: "",
};

const VEHICLE_TYPES = ["Car", "Bike", "Van", "Truck", "SUV"];

interface AddVehicleProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddVehicle: React.FC<AddVehicleProps> = ({ isOpen, onClose }) => {
  const { vehicles } = useVehicles();
  const { addVehicle, removeVehicle, updateVehicle, setLoading, setError, setVehicles } = useVehicleActions();

  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const firstInputRef = useRef<HTMLSelectElement | null>(null);

  useEffect(()=>{
  const loadVehicles = async () => {
    try {
      setLoading(true);
      const vehicles = await vehicleApi.getVehicles();
      console.log("Loaded Vehicles:", vehicles);
       setVehicles(vehicles);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  loadVehicles();
},[]);

  // Autofocus when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      setFormData(initialFormState);
      setIsSubmitting(false);
      setIsEditing(false);
    }
  }, [isOpen]);


  // ESC key close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && isOpen && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: name === 'year' ? Number(value) || 0 : value
  }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoading(true);

    try {
      if (isEditing && formData.id) {
       
        const updatedVehicle = {
          vehicleType: formData.vehicleType,
          brand: formData.brand,
          model: formData.model,
          year: formData.year,
          licensePlate: formData.licensePlate,
          color: formData.color,
          notes: formData.notes,
        };
        await vehicleApi.updateVehicle(formData.id, updatedVehicle);
        updateVehicle(formData.id, updatedVehicle);
        toast.success("Vehicle updated successfully");
      } else {
        //  Add new vehicle
        const newVehicleData = {
          vehicleType: formData.vehicleType,
          brand: formData.brand,
          model: formData.model,
          year: formData.year,
          licensePlate: formData.licensePlate,
          color: formData.color,
          notes: formData.notes,
        };
        const savedVehicle = await vehicleApi.addVehicle(newVehicleData);
        addVehicle(savedVehicle); // add full object from backend
        toast.success("Vehicle added successfully");
        
      }
      setFormData(initialFormState);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to save vehicle");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setFormData({
      id: vehicle._id,
      vehicleType: vehicle.vehicleType,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      color: vehicle.color,
      notes: vehicle.notes || "",
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await vehicleApi.removeVehicle({ vehicleId: id });
      removeVehicle(id);
      toast.success("Vehicle deleted successfully");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to delete vehicle");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-5xl border border-gray-500 shadow-2xl rounded-2xl overflow-hidden transform transition-all bg-gray-900/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src={vehicleImage}
            alt="Vehicle background"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>

        {/* Header */}
        <div className="relative p-5 border-b border-gray-700 flex justify-between items-center bg-black/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <MdDirectionsCar className="text-2xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Vehicle Management</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all cursor-pointer"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="relative grid grid-cols-1 md:grid-cols-2">
          {/* Vehicle List */}
          <div className="p-5 border-r border-gray-700 bg-black/60">
            <h3 className="text-lg font-semibold text-white mb-3">Saved Vehicles</h3>
            {vehicles.length === 0 ? (
              <p className="text-gray-400 text-sm">No vehicles added yet.</p>
            ) : (
              <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {vehicles.map((v) => (
                  <li
                    key={v._id}
                    className="bg-gray-800/60 border border-gray-700 p-3 rounded-lg flex justify-between items-center hover:bg-gray-700/60 transition-all"
                  >
                    <div>
                      <p className="text-white font-semibold">
                        {v.brand} {v.model} ({v.year})
                      </p>
                      <p className="text-gray-400 text-sm">
                        vehicle Type:- {v.vehicleType} 
                        <br/>
                        Color:- {v.color}
                      </p>
                      <p className="text-gray-500 text-xs">Plate: {v.licensePlate}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(v)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(v._id)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Add / Edit Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Vehicle Type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-200">
                  Vehicle Type
                </label>
                <select
                  ref={firstInputRef}
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/60 border border-gray-500 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="">Select type</option>
                  {VEHICLE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand / Model */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="brand"
                  placeholder="Brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="bg-black/60 border border-gray-500 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  name="model"
                  placeholder="Model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  className="bg-black/60 border border-gray-500 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Year / License */}
              <div className="grid grid-cols-2 gap-3">
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="bg-black/60 border border-gray-500 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
             >
             <option value="">Select Year</option>
             {Array.from({ length: 40 }, (_, i) => {
             const year = new Date().getFullYear() - i; // past 40 years
             return (
                <option key={year} value={year}>
                   {year}
                </option>
                  );
                  })}
                </select>
                <input
                  name="licensePlate"
                  placeholder="License Plate"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  required
                  className="bg-black/60 border border-gray-500 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Color */}
              <input
                name="color"
                placeholder="Color"
                value={formData.color}
                onChange={handleChange}
                required
                className="w-full bg-black/60 border border-gray-500 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              {/* Notes */}
              <textarea
                name="notes"
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full bg-black/60 border border-gray-500 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />

              {/* Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(initialFormState);
                    setIsEditing(false);
                  }}
                  className="px-6 py-3 rounded-lg border border-gray-600 text-sm font-semibold text-gray-200 hover:bg-black/70 transition-all cursor-pointer"
                  disabled={isSubmitting}
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-gray-800 to-gray-600 text-white font-semibold py-3 rounded-lg hover:from-gray-900 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl cursor-pointer"
                >
                  {isSubmitting
                    ? "Saving..."
                    : isEditing
                    ? "Update Vehicle"
                    : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

function setError(arg0: string) {
  throw new Error("Function not implemented.");
}

