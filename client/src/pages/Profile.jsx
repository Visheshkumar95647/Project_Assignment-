import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  getProfileApi,
  updateProfileApi,
  changePasswordApi,
} from "../api/profileApi";

import { logout } from "../redux/auth/authSlice";
import { clearCart } from "../redux/cart/cartSlice";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ===========================
  // Fetch Profile
  // ===========================

  const fetchProfile = async () => {
    try {
      const data = await getProfileApi(token);
      setProfile(data);
    } catch (error) {
      toast.error(error.message || "Failed to load profile");
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  // ===========================
  // Edit Profile Form
  // ===========================

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm();

  useEffect(() => {
    if (profile) {
      resetProfile({
        name: profile.name,
        email: profile.email,
      });
    }
  }, [profile, resetProfile]);

  // ===========================
  // Change Password Form
  // ===========================

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch,
    formState: { errors: passwordErrors },
  } = useForm();

  // ===========================
  // Update Profile
  // ===========================

  const updateProfile = async (data) => {
    try {
      setLoading(true);

      await updateProfileApi({
        name: data.name.trim(),
      });

      toast.success("Profile updated successfully");

      await fetchProfile();

      setEditOpen(false);
    } catch (error) {
      toast.error(error.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Change Password
  // ===========================

  const changePassword = async (data) => {
    try {
      setLoading(true);

      await changePasswordApi({
        current_password: data.current_password,
        new_password: data.new_password,
      });

      toast.success("Password changed successfully");

      resetPassword();

      setPasswordOpen(false);

      dispatch(logout());
      dispatch(clearCart());

      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64 text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      <button
        onClick={() => navigate("/")}
        className="text-orange-600 hover:underline mb-6"
      >
        ← Home
      </button>

      <h1 className="text-3xl font-bold mb-6">
        My Profile
      </h1>
      {/* ==========================
          PROFILE CARD
      ========================== */}

      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">

        <div className="flex justify-between items-start">

          <div>

            <h2 className="text-2xl font-bold text-gray-800">
              {profile.name}
            </h2>

            <p className="text-gray-500 capitalize mt-1">
              {profile.role}
            </p>

          </div>

          <button
            onClick={() => setEditOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg transition"
          >
            Edit Profile
          </button>

        </div>

        <hr className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>

            <p className="text-sm text-gray-500">
              Full Name
            </p>

            <p className="text-lg font-semibold mt-1">
              {profile.name}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Email Address
            </p>

            <p className="text-lg font-semibold mt-1 break-all">
              {profile.email}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Role
            </p>

            <span className="inline-block mt-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full capitalize font-medium">
              {profile.role}
            </span>

          </div>

        </div>

      </div>

      {/* ==========================
          SECURITY CARD
      ========================== */}

      <div className="bg-white shadow-lg rounded-xl p-6">

        <h2 className="text-xl font-bold mb-2">
          Security
        </h2>

        <p className="text-gray-500 mb-5">
          Keep your account secure by changing your password regularly.
        </p>

        <button
          onClick={() => setPasswordOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg transition"
        >
          Change Password
        </button>

      </div>

      {/* ==========================
          EDIT PROFILE MODAL
      ========================== */}

      {editOpen && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

            <h2 className="text-2xl font-bold mb-6">
              Edit Profile
            </h2>

            <form
              onSubmit={handleProfileSubmit(updateProfile)}
              className="space-y-5"
            >
              {/* Name */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  {...registerProfile("name", {
                    required: "Name is required",

                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },

                    maxLength: {
                      value: 50,
                      message: "Name cannot exceed 50 characters",
                    },

                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Only letters and spaces are allowed",
                    },
                  })}
                />

                {profileErrors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {profileErrors.name.message}
                  </p>
                )}

              </div>

              {/* Email */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  disabled
                  className="w-full border rounded-lg p-3 bg-gray-100 text-gray-500 cursor-not-allowed"
                  {...registerProfile("email")}
                />

                <p className="text-xs text-gray-500 mt-2">
                  Email cannot be changed.
                </p>

              </div>

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="flex-1 border border-gray-300 rounded-lg py-3 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-3 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ==========================
          CHANGE PASSWORD MODAL
      ========================== */}

      {passwordOpen && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

            <h2 className="text-2xl font-bold mb-6">
              Change Password
            </h2>

            <form
              onSubmit={handlePasswordSubmit(changePassword)}
              className="space-y-5"
            >              {/* Current Password */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Current Password
                </label>

                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  {...registerPassword("current_password", {
                    required: "Current password is required",
                  })}
                />

                {passwordErrors.current_password && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordErrors.current_password.message}
                  </p>
                )}

              </div>

              {/* New Password */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  New Password
                </label>

                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  {...registerPassword("new_password", {
                    required: "New password is required",

                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />

                {passwordErrors.new_password && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordErrors.new_password.message}
                  </p>
                )}

              </div>

              {/* Confirm Password */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  {...registerPassword("confirm_password", {
                    required: "Please confirm your password",

                    validate: (value) =>
                      value === watch("new_password") ||
                      "Passwords do not match",
                  })}
                />

                {passwordErrors.confirm_password && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordErrors.confirm_password.message}
                  </p>
                )}

              </div>

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => {
                    resetPassword();
                    setPasswordOpen(false);
                  }}
                  className="flex-1 border border-gray-300 rounded-lg py-3 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-3 disabled:opacity-50"
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Profile;