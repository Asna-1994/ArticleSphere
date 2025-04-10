import { useState } from "react";
import toast from "react-hot-toast";
import Header from "../Components/Header";
import { updatePassword } from "../services/authServices";

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
    <div>
      <Header />
      <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Change Password
        </h2>
        <form onSubmit={handleSubmit} className="">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type={showPasswords ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm new Password
            </label>
            <input
              type={showPasswords ? "text" : "password"}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />

            <button
              type="button"
              className="text-sm text-blue-600 mt-1"
              onClick={togglePasswordVisibility}
            >
              {showPasswords ? "Hide Passwords" : "Show Passwords"}
            </button>
          </div>

          <div className="col-span-1 md:col-span-2 pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
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
