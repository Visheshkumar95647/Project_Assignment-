import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";

const RestaurantFormModal = ({
  restaurant,
  onSubmit,
  onClose,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (restaurant) {
      reset({
        name: restaurant.name || "",
        description: restaurant.description || "",
        address: restaurant.address || "",
        phone: restaurant.phone || "",
        location: restaurant.location || "",
        image_url: restaurant.image_url || "",
      });
    } else {
      reset({
        name: "",
        description: "",
        address: "",
        phone: "",
        location: "",
        image_url: "",
      });
    }
  }, [restaurant, reset]);

  const submitHandler = (data) => {
    const payload = {
      name: data.name.trim(),
      description: data.description.trim(),
      address: data.address.trim(),
      phone: data.phone.trim(),
      location: data.location.trim(),
      image_url: data.image_url.trim(),
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
      <div className="flex min-h-full items-center justify-center py-6">
        <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-lg">

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {restaurant ? "Edit Restaurant" : "Add Restaurant"}
            </h2>

            <button
              type="button"
              onClick={onClose}
            >
              <HiX size={22} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-4"
          >

            {/* Name */}
            <div>
              <label className="block mb-1 font-medium">
                Name
              </label>

              <input
                type="text"
                autoComplete="off"
                placeholder="Enter restaurant name"
                {...register("name", {
                  required: "Restaurant name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Name cannot exceed 100 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z0-9\s&'-]+$/,
                    message:
                      "Only letters, numbers, spaces, &, ' and - are allowed",
                  },
                })}
                className="w-full rounded-lg border px-4 py-2"
              />

              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-medium">
                Description
              </label>

              <textarea
                rows={4}
                autoComplete="off"
                placeholder="Describe your restaurant"
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message:
                      "Description must be at least 10 characters",
                  },
                  maxLength: {
                    value: 500,
                    message:
                      "Description cannot exceed 500 characters",
                  },
                })}
                className="w-full rounded-lg border px-4 py-2"
              />

              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block mb-1 font-medium">
                Address
              </label>

              <input
                type="text"
                autoComplete="off"
                placeholder="Enter restaurant address"
                {...register("address", {
                  required: "Address is required",
                  minLength: {
                    value: 5,
                    message:
                      "Address must be at least 5 characters",
                  },
                  maxLength: {
                    value: 200,
                    message:
                      "Address cannot exceed 200 characters",
                  },
                })}
                className="w-full rounded-lg border px-4 py-2"
              />

              {errors.address && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-1 font-medium">
                Phone
              </label>

              <input
                type="text"
                autoComplete="off"
                placeholder="9876543210"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message:
                      "Enter a valid 10-digit mobile number",
                  },
                })}
                className="w-full rounded-lg border px-4 py-2"
              />

              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block mb-1 font-medium">
                Location
              </label>

              <input
                type="text"
                autoComplete="off"
                placeholder="e.g. Downtown, North End"
                {...register("location", {
                  required: "Location is required",
                  minLength: {
                    value: 2,
                    message:
                      "Location must be at least 2 characters",
                  },
                  maxLength: {
                    value: 100,
                    message:
                      "Location cannot exceed 100 characters",
                  },
                })}
                className="w-full rounded-lg border px-4 py-2"
              />

              {errors.location && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label className="block mb-1 font-medium">
                Image URL
              </label>

              <input
                type="url"
                autoComplete="off"
                placeholder="https://images.unsplash.com/..."
                {...register("image_url", {
                  required: "Image URL is required",
                  pattern: {
                    value: /^https?:\/\/.+$/i,
                    message: "Enter a valid image URL",
                  },
                })}
                className="w-full rounded-lg border px-4 py-2"
              />

              {errors.image_url && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.image_url.message}
                </p>
              )}
            </div>

            <div className="sticky bottom-0 flex gap-3 bg-white pt-2">

              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border py-2 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-orange-600 py-2 text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : restaurant
                    ? "Update Restaurant"
                    : "Create Restaurant"}
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default RestaurantFormModal;