import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import toast from "react-hot-toast";
import { getRestaurantCategoriesApi } from "../../api/categoryApi";

const MenuItemFormModal = ({
  item,
  restaurantId,
  categoryId,
  onSubmit,
  onClose,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      price: item?.price || "",
      image_url: item?.image_url || "",
      is_available: item?.is_available ?? true,
      category_id: item?.category_id || categoryId || "",
    },
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (item) {
      reset({
        name: item.name || "",
        description: item.description || "",
        price: item.price || "",
        image_url: item.image_url || "",
        is_available: item.is_available ?? true,
        category_id: item.category_id || categoryId || "",
      });
    }
  }, [item, categoryId, reset]);

  useEffect(() => {
    const loadCategories = async () => {
      if (!restaurantId) return;
      try {
        setLoadingCategories(true);
        const data = await getRestaurantCategoriesApi(restaurantId);
        setCategories(data || []);
        if (!item && !categoryId && data?.length) {
          setValue("category_id", String(data[0].id));
        }
      } catch (error) {
        toast.error(error.message || "Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, [restaurantId, item, categoryId, setValue]);

  const submitHandler = (data) => {
    onSubmit({
      name: data.name.trim(),
      description: data.description.trim(),
      price: Number(data.price),
      image_url: data.image_url.trim() || null,
      is_available: data.is_available,
      category_id: Number(data.category_id),
      restaurant_id: Number(restaurantId),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
      <div className="flex min-h-full items-center justify-center py-6">
        <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-lg">

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {item ? "Edit Menu Item" : "Add Menu Item"}
            </h2>
            <button type="button" onClick={onClose}>
              <HiX size={22} />
            </button>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                autoComplete="off"
                placeholder="Enter menu item name"
                {...register("name", {
                  required: "Menu item name is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                  maxLength: { value: 100, message: "Maximum 100 characters" },
                  pattern: {
                    value: /^[A-Za-z0-9\s&'-]+$/,
                    message: "Invalid characters",
                  },
                })}
                className="w-full border rounded-lg px-4 py-2"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                rows={4}
                autoComplete="off"
                placeholder="Describe this menu item"
                {...register("description", {
                  required: "Description is required",
                  minLength: { value: 10, message: "Minimum 10 characters" },
                  maxLength: { value: 500, message: "Maximum 500 characters" },
                })}
                className="w-full border rounded-lg px-4 py-2"
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Category</label>
              <select
                {...register("category_id", { required: "Please select a category" })}
                disabled={Boolean(categoryId) || loadingCategories}
                className="w-full border rounded-lg px-4 py-2 disabled:bg-gray-100"
              >
                {!categoryId && <option value="">Select a category</option>}
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id.message}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Price</label>
              <input
                type="number"
                step="0.01"
                min="1"
                placeholder="Enter price"
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Minimum price is ₹1" },
                  max: { value: 10000, message: "Maximum price is ₹10,000" },
                })}
                className="w-full border rounded-lg px-4 py-2"
              />
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                {...register("image_url", {
                  pattern: {
                    value: /^https?:\/\/.+$/i,
                    message: "Enter a valid image URL",
                  },
                })}
              />
              {errors.image_url && <p className="mt-1 text-sm text-red-500">{errors.image_url.message}</p>}
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("is_available")} />
              Available
            </label>

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
                className="flex-1 rounded-lg bg-orange-600 py-2 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : item ? "Update Menu Item" : "Create Menu Item"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default MenuItemFormModal;
