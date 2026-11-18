import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";

const CategoryFormModal = ({
  category,
  restaurantId,
  onSubmit,
  onClose,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: category?.name || "",
    },
  });

  useEffect(() => {
    reset({
      name: category?.name || "",
    });
  }, [category, reset]);

  const handleFormSubmit = (data) => {
    onSubmit({
      name: data.name.trim(),
      restaurant_id: Number(restaurantId),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {category ? "Edit Category" : "Add Category"}
          </h2>

          <button
            type="button"
            onClick={onClose}
          >
            <HiX size={22} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >

          <div>
            <label className="mb-1 block font-medium">
              Category Name
            </label>

            <input
              type="text"
              autoComplete="off"
              placeholder="e.g. Starters, Pizza, Desserts"
              {...register("name", {
                required: "Category name is required",

                minLength: {
                  value: 3,
                  message: "Category name must be at least 3 characters",
                },

                maxLength: {
                  value: 50,
                  message: "Category name cannot exceed 50 characters",
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

          <div className="flex gap-3">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border py-2 transition hover:bg-gray-100"
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
                : category
                ? "Update Category"
                : "Create Category"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default CategoryFormModal;