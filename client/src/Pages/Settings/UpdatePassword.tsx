

import { useState } from "react";
import toast from "react-hot-toast";
import Header from "../../Components/Header/Header";
import { updatePassword } from "../../services/authServices";

export interface updatePasswordData {
  currentPassword?: string;
  newPassword?: string;
}

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      (currentPassword && !newPassword) ||
      (!currentPassword && newPassword)
    ) {
      return toast.error(
        "To change password, both current and new passwords must be filled"
      );
    }

    if (newPassword && newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }

    if (newPassword && newPassword !== confirmNewPassword) {
      return toast.error("New password and confirm password do not match");
    }

    const updatedData = {
      currentPassword,
      newPassword,
    };

    try {
      const response = await updatePassword(updatedData);
      if (response.data.success) {
        toast.success("Password updated successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPasswords((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <div className="max-w-2xl mx-auto p-6 mt-10 bg-white dark:bg-gray-800 rounded shadow-md transition-colors duration-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white transition-colors duration-200">
          Change Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Current Password
            </label>
            <input
              type={showPasswords ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
              New Password
            </label>
            <input
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Confirm New Password
            </label>
            <input
              type={showPasswords ? "text" : "password"}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
            />

            <button
              type="button"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 mt-2 transition-colors duration-200"
              onClick={togglePasswordVisibility}
            >
              {showPasswords ? "Hide Passwords" : "Show Passwords"}
            </button>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-200"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
