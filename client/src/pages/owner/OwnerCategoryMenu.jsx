import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import { MdLocalOffer, MdStar } from "react-icons/md";
import toast from "react-hot-toast";

import {
  getCategoryMenuApi,
  createMenuItemApi,
  updateMenuItemApi,
  deleteMenuItemApi,
  addSpecialApi,
  removeSpecialApi,
  addDealApi,
  removeDealApi,
} from "../../api/menuApi";

import { getCategoryByIdApi } from "../../api/categoryApi";

import MenuItemFormModal from "./MenuItemFormModal";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import Loader from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";

const OwnerCategoryMenu = () => {
  const { id: restaurantId, categoryId } = useParams();

  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [categoryId]);

  const loadData = async () => {
    try {
      const categoryData = await getCategoryByIdApi(categoryId);
      const menuData = await getCategoryMenuApi(categoryId);

      setCategory(categoryData);
      setItems(menuData || []);
    } catch (error) {
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      setFormLoading(true);

      if (editingItem) {
        await updateMenuItemApi(editingItem.id, data);
        toast.success("Item updated");
      } else {
        await createMenuItemApi({
          ...data,
          category_id: Number(categoryId),
        });

        toast.success("Item created");
      }

      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(error.message || "Failed");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await deleteMenuItemApi(deleteTarget.id);

      toast.success("Item deleted");

      setDeleteTarget(null);

      loadData();
    } catch (error) {
      toast.error(error.message || "Failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleSpecial = async (item) => {
    try {
      if (item.is_special) {
        await removeSpecialApi(item.id);
      } else {
        await addSpecialApi(item.id);
      }

      loadData();
    } catch {
      toast.error("Failed");
    }
  };

  const toggleDeal = async (item) => {
    try {
      if (item.is_deal_of_day) {
        await removeDealApi(item.id);
      } else {
        await addDealApi(item.id);
      }

      loadData();
    } catch {
      toast.error("Failed");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <div className="flex justify-between items-center mb-8">

        <div>

          <div className="text-sm text-gray-500 mb-2">

            <Link to="/owner/restaurants">
              My Restaurants
            </Link>

            <span> / </span>

            <Link to={`/owner/restaurants/${restaurantId}/categories`}>
              Categories
            </Link>

            <span> / Menu</span>

          </div>

          <h1 className="text-3xl font-bold">
            {category?.name} Menu
          </h1>

        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setShowModal(true);
          }}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <HiPlus />

          Add Item

        </button>

      </div>

            {items.length === 0 ? (

        <EmptyState
          icon="🍴"
          title="No Menu Items"
          description="Add your first menu item."

          action={
            <button
              onClick={() => {
                setEditingItem(null);
                setShowModal(true);
              }}
              className="mt-4 bg-orange-600 text-white px-5 py-2 rounded-lg"
            >
              Add Item
            </button>
          }
        />

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {items.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >

              <div className="h-40 bg-gray-100">

                {item.image_url ? (

                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    🍴
                  </div>

                )}

              </div>

              <div className="p-4">

                <div className="flex justify-between items-start">

                  <h2 className="font-semibold">
                    {item.name}
                  </h2>

                  <span className="text-orange-600 font-bold">
                    ₹{item.price}
                  </span>

                </div>

                <p className="text-gray-500 text-sm mt-2">
                  {item.description}
                </p>

                <p
                  className={`mt-3 text-sm font-medium ${
                    item.is_available
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {item.is_available
                    ? "Available"
                    : "Unavailable"}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4">

                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setShowModal(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-2 rounded-lg"
                  >
                    <HiPencil />

                    Edit

                  </button>

                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="flex items-center justify-center gap-2 bg-red-100 text-red-700 py-2 rounded-lg"
                  >
                    <HiTrash />

                    Delete

                  </button>

                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">

                  <button
                    onClick={() => toggleSpecial(item)}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg ${
                      item.is_special
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100"
                    }`}
                  >
                    <MdStar />

                    {item.is_special
                      ? "Unspecial"
                      : "Special"}

                  </button>

                  <button
                    onClick={() => toggleDeal(item)}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg ${
                      item.is_deal_of_day
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100"
                    }`}
                  >
                    <MdLocalOffer />

                    {item.is_deal_of_day
                      ? "Undeal"
                      : "Deal"}

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

      {showModal && (
        <MenuItemFormModal
          item={editingItem}
          restaurantId={restaurantId}
          categoryId={categoryId}
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

export default OwnerCategoryMenu;
