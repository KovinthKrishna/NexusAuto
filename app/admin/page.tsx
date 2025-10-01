"use client";

import { AdminOnly } from "@/components/auth/ProtectedRoute";
import { adminApi, handleApiError } from "@/lib/api/client";
import { RegisterRequest, UserResponse } from "@/lib/types";
import { useEffect, useState } from "react";

/**
 * Admin Dashboard component
 *
 * Features:
 * - Employee management
 * - Create new employees
 * - Toggle employee status
 * - View all employees
 * - Admin-only access
 */
export default function AdminDashboard() {
  return (
    <AdminOnly>
      <AdminDashboardContent />
    </AdminOnly>
  );
}

function AdminDashboardContent() {
  const [employees, setEmployees] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create employee form state
  const [newEmployee, setNewEmployee] = useState<RegisterRequest>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getEmployees();
      setEmployees(data);
      setError("");
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError("");
    setSuccess("");

    try {
      await adminApi.createEmployee(newEmployee);
      setSuccess("Employee created successfully!");
      setNewEmployee({ firstName: "", lastName: "", email: "", password: "" });
      setShowCreateForm(false);
      await loadEmployees();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleStatus = async (employeeId: number) => {
    try {
      await adminApi.toggleEmployeeStatus(employeeId);
      setSuccess("Employee status updated successfully!");
      await loadEmployees();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage employees and system administration
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {success}
        </div>
      )}

      {/* Create Employee Section */}
      <div className="mb-8 rounded-lg bg-white shadow">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Employee Management
          </h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {showCreateForm ? "Cancel" : "Add Employee"}
          </button>
        </div>

        {showCreateForm && (
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Create New Employee
            </h3>
            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmployee.firstName}
                    onChange={(e) =>
                      setNewEmployee((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmployee.lastName}
                    onChange={(e) =>
                      setNewEmployee((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={newEmployee.password}
                  onChange={(e) =>
                    setNewEmployee((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isCreating ? "Creating..." : "Create Employee"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Employee List */}
        <div className="px-6 py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {employee.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {employee.role.replace("ROLE_", "").toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            employee.enabled
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {employee.enabled ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(employee.id)}
                          className={`${
                            employee.enabled
                              ? "text-red-600 hover:text-red-900"
                              : "text-green-600 hover:text-green-900"
                          }`}
                        >
                          {employee.enabled ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {employees.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  No employees found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
