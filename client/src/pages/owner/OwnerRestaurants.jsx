import { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import toast from "react-hot-toast";

import {
  getMyRestaurantsApi,
  createRestaurantApi,
  updateRestaurantApi,
  deleteRestaurantApi,
} from "../../api/restaurantApi";

import OwnerRestaurantCard from "../../components/RestaurantCard/OwnerRestaurantCard";
import RestaurantFormModal from "./RestaurantFormModal";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import Loader from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";

const OwnerRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await getMyRestaurantsApi();
      setRestaurants(data || []);
    } catch {
      toast.error("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      setFormLoading(true);

      if (editingRestaurant) {
        await updateRestaurantApi(editingRestaurant.id, data);
        toast.success("Restaurant updated");
      } else {
        await createRestaurantApi(data);
        toast.success("Restaurant created");
      }

      setShowModal(false);
      loadRestaurants();
    } catch (error) {
      toast.error(error.message || "Failed to save");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await deleteRestaurantApi(deleteTarget.id);

      toast.success("Restaurant deleted");

      setDeleteTarget(null);

      loadRestaurants();
    } catch (error) {
      toast.error(error.message || "Failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          My Restaurants
        </h1>

        <button
          onClick={() => {
            setEditingRestaurant(null);
            setShowModal(true);
          }}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <HiPlus />

          Add Restaurant

        </button>

      </div>
            {restaurants.length === 0 ? (

        <EmptyState
          icon="🍽️"
          title="No Restaurants"
          description="Create your first restaurant."

          action={
            <button
              onClick={() => {
                setEditingRestaurant(null);
                setShowModal(true);
              }}
              className="mt-4 bg-orange-600 text-white px-5 py-2 rounded-lg"
            >
              Add Restaurant
            </button>
          }
        />

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {restaurants.map((restaurant) => (

            <OwnerRestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onEdit={(restaurant) => {
                setEditingRestaurant(restaurant);
                setShowModal(true);
              }}
              onDelete={setDeleteTarget}
            />

          ))}

        </div>

      )}

      {showModal && (
        <RestaurantFormModal
          restaurant={editingRestaurant}
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

export default OwnerRestaurants;