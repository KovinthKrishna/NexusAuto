"use client";

import { handleApiError, userApi } from "@/lib/api/client";
import { useAuth, useAuthActions } from "@/lib/store/auth";
import { ChangePasswordRequest, UpdateProfileRequest } from "@/lib/types";
import { useState } from "react";

/**
 * Common profile management component
 *
 * Features:
 * - Profile information editing
 * - Password change functionality
 * - Form validation
 * - Success/error feedback
 * - Responsive design
 * - Used across all user roles
 */
export default function ProfileManager() {
  const { user } = useAuth();
  const { updateUser } = useAuthActions();

  // Profile form state
  const [profileData, setProfileData] = useState<UpdateProfileRequest>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    currentPassword: "",
    newPassword: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
    {},
  );
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {},
  );
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const validateProfile = (): boolean => {
    const errors: Record<string, string> = {};

    if (!profileData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (profileData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }

    if (!profileData.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (profileData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = (): boolean => {
    const errors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)
    ) {
      errors.newPassword =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword =
        "New password must be different from current password";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage("");

    if (!validateProfile()) {
      return;
    }

    setIsUpdatingProfile(true);

    try {
      const updatedUser = await userApi.updateProfile(profileData);
      updateUser(updatedUser);
      setProfileMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      setProfileMessage(handleApiError(error));
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");

    if (!validatePassword()) {
      return;
    }

    setIsChangingPassword(true);

    try {
      await userApi.changePassword(passwordData);
      setPasswordData({ currentPassword: "", newPassword: "" });
      setConfirmPassword("");
      setPasswordMessage("Password changed successfully!");
    } catch (error) {
      console.error("Password change failed:", error);
      setPasswordMessage(handleApiError(error));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleProfileInputChange =
    (field: keyof UpdateProfileRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfileData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      if (profileErrors[field]) {
        setProfileErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    };

  const handlePasswordInputChange =
    (field: keyof ChangePasswordRequest | "confirmPassword") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (field === "confirmPassword") {
        setConfirmPassword(e.target.value);
      } else {
        setPasswordData((prev) => ({
          ...prev,
          [field]: e.target.value,
        }));
      }

      if (passwordErrors[field]) {
        setPasswordErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "bg-red-100 text-red-800";
      case "ROLE_EMPLOYEE":
        return "bg-blue-100 text-blue-800";
      case "ROLE_CUSTOMER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatRole = (role: string) => {
    return (
      role.replace("ROLE_", "").toLowerCase().charAt(0).toUpperCase() +
      role.replace("ROLE_", "").toLowerCase().slice(1)
    );
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white shadow">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Profile Settings
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your account information
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(user.role)}`}
              >
                {formatRole(user.role)}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  user.enabled
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user.enabled ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                activeTab === "password"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Change Password
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "profile" && (
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Profile Information
              </h3>

              {profileMessage && (
                <div
                  className={`mb-4 rounded-md p-4 ${
                    profileMessage.includes("successfully")
                      ? "border border-green-200 bg-green-50 text-green-700"
                      : "border border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {profileMessage}
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileInputChange("firstName")}
                      className={`mt-1 block w-full border px-3 py-2 ${
                        profileErrors.firstName
                          ? "border-red-300"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                    />
                    {profileErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {profileErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileInputChange("lastName")}
                      className={`mt-1 block w-full border px-3 py-2 ${
                        profileErrors.lastName
                          ? "border-red-300"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                    />
                    {profileErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {profileErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    disabled
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 shadow-sm sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Email cannot be changed
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className={`rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm ${
                      isUpdatingProfile
                        ? "cursor-not-allowed bg-gray-400"
                        : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    }`}
                  >
                    {isUpdatingProfile ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Change Password
              </h3>

              {passwordMessage && (
                <div
                  className={`mb-4 rounded-md p-4 ${
                    passwordMessage.includes("successfully")
                      ? "border border-green-200 bg-green-50 text-green-700"
                      : "border border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {passwordMessage}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange("currentPassword")}
                    className={`mt-1 block w-full border px-3 py-2 ${
                      passwordErrors.currentPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {passwordErrors.currentPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange("newPassword")}
                    className={`mt-1 block w-full border px-3 py-2 ${
                      passwordErrors.newPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handlePasswordInputChange("confirmPassword")}
                    className={`mt-1 block w-full border px-3 py-2 ${
                      passwordErrors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className={`rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm ${
                      isChangingPassword
                        ? "cursor-not-allowed bg-gray-400"
                        : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    }`}
                  >
                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
