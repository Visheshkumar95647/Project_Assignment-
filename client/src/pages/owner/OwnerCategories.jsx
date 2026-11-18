import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  HiPlus,
  HiPencil,
  HiTrash,
} from "react-icons/hi";
import { MdRestaurantMenu } from "react-icons/md";
import toast from "react-hot-toast";

import {
  getRestaurantCategoriesApi,
  searchCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../../api/categoryApi";

import CategoryFormModal from "./CategoryFormModal";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import Loader from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";
import SearchBar from "../../components/SearchBar/SearchBar";

const OwnerCategories = () => {
  const { id: restaurantId } = useParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadCategories();
  }, [restaurantId]);

  const loadCategories = async () => {
    try {
      const data = await getRestaurantCategoriesApi(restaurantId);
      setCategories(data || []);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      setFormLoading(true);

      if (editingCategory) {
        await updateCategoryApi(editingCategory.id, {
          name: data.name,
        });

        toast.success("Category updated");
      } else {
        await createCategoryApi(data);

        toast.success("Category created");
      }

      setShowModal(false);
      loadCategories();
    } catch (error) {
      toast.error(error.message || "Failed to save category");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await deleteCategoryApi(deleteTarget.id);

      toast.success("Category deleted");

      setDeleteTarget(null);

      loadCategories();
    } catch (error) {
      toast.error(error.message || "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSearch = async (keyword) => {
    if (!keyword.trim()) {
      loadCategories();
      return;
    }

    try {
      setSearching(true);
      const data = await searchCategoriesApi(
        keyword,
        restaurantId
      );
      setCategories(data || []);
    } catch (error) {
      toast.error(error.message || "Search failed");
    } finally {
      setSearching(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <div className="flex justify-between items-center mb-8">

        <div>

          <div className="text-sm text-gray-500 mb-2">

            <Link to="/owner/restaurants">
              My Restaurants
            </Link>

            <span> / Categories</span>

          </div>

          <h1 className="text-3xl font-bold">
            Categories
          </h1>

        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setShowModal(true);
          }}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <HiPlus />

          Add Category

        </button>

      </div>

      <div className="mb-6">
        <SearchBar
          placeholder="Search categories..."
          onSearch={handleSearch}
          onClear={loadCategories}
        />
      </div>

      {searching && <Loader />}

      {!searching && (
        <>
            {categories.length === 0 ? (

        <EmptyState
          icon="📂"
          title="No Categories"
          description="Create your first category."

          action={
            <button
              onClick={() => {
                setEditingCategory(null);
                setShowModal(true);
              }}
              className="mt-4 bg-orange-600 text-white px-5 py-2 rounded-lg"
            >
              Add Category
            </button>
          }
        />

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {categories.map((category) => (

            <div
              key={category.id}
              className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
            >

              <div className="bg-orange-100 p-3 rounded-lg">

                <MdRestaurantMenu className="text-orange-600 text-xl" />

              </div>

              <div className="flex-1">

                <h2 className="font-semibold">
                  {category.name}
                </h2>

              </div>

              <div className="flex gap-2">

                <Link
                  to={`/owner/restaurants/${restaurantId}/categories/${category.id}/menu`}
                  className="p-2 bg-green-100 rounded-lg text-green-700"
                >
                  <MdRestaurantMenu />
                </Link>

                <button
                  onClick={() => {
                    setEditingCategory(category);
                    setShowModal(true);
                  }}
                  className="p-2 bg-blue-100 rounded-lg text-blue-700"
                >
                  <HiPencil />
                </button>

                <button
                  onClick={() => setDeleteTarget(category)}
                  className="p-2 bg-red-100 rounded-lg text-red-700"
                >
                  <HiTrash />
                </button>

              </div>

            </div>

          ))}

        </div>

      )}
        </>
      )}

      {showModal && (
        <CategoryFormModal
          category={editingCategory}
          restaurantId={restaurantId}
          onSubmit={handleFormSubmit}
          onClose={() => setShowModal(false)}
          loading={formLoading}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

    </div>
  );
};

export default OwnerCategories;
