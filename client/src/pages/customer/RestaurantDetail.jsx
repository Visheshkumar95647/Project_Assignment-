import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  HiHeart,
  HiLocationMarker,
  HiOutlineHeart,
  HiPhone,
} from "react-icons/hi";
import {
  MdCategory,
  MdRestaurantMenu,
} from "react-icons/md";
import toast from "react-hot-toast";

import { getRestaurantByIdApi } from "../../api/restaurantApi";
import {
  getFavoritesApi,
  addFavoriteApi,
  removeFavoriteApi,
} from "../../api/favoriteApi";

import Loader from "../../components/Loader/Loader";

const RestaurantDetail = () => {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurant();
  }, [id]);

  const loadRestaurant = async () => {
    try {
      const restaurantData = await getRestaurantByIdApi(id);
      setRestaurant(restaurantData);

      try {
        const favorites = await getFavoritesApi();

        setIsFavorite(
          favorites.some(
            (item) =>
              (item.restaurant_id || item.id) ===
              restaurantData.id
          )
        );
      } catch {
        // Ignore favorite errors
      }
    } catch (error) {
      toast.error(error.message || "Failed to load restaurant");
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavoriteApi(restaurant.id);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await addFavoriteApi(restaurant.id);
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!restaurant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/restaurants"
          className="text-orange-600 mb-6 inline-block"
        >
          ← Back to Restaurants
        </Link>

        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">
            Restaurant not found
          </h1>
          <p className="text-gray-500 mb-6">
            This restaurant may have been removed.
          </p>
          <Link
            to="/restaurants"
            className="inline-block bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <Link
        to="/restaurants"
        className="text-orange-600 mb-6 inline-block"
      >
        ← Back to Restaurants
      </Link>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="relative h-72 bg-gray-100">

          {restaurant.image_url ? (
            <img
              src={restaurant.image_url}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🍽️
            </div>
          )}

          <button
            onClick={handleFavorite}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow"
          >
            {isFavorite ? (
              <HiHeart className="text-red-500 text-2xl" />
            ) : (
              <HiOutlineHeart className="text-2xl" />
            )}
          </button>

        </div>

        <div className="p-6">
                      <h1 className="text-3xl font-bold">
            {restaurant.name}
          </h1>

          <p className="text-gray-500 mt-3">
            {restaurant.description}
          </p>

          <div className="flex flex-wrap gap-6 mt-6 text-gray-600">

            <div className="flex items-center gap-2">
              <HiLocationMarker className="text-orange-600" />
              {restaurant.address}
            </div>

            <div className="flex items-center gap-2">
              <HiPhone className="text-orange-600" />
              {restaurant.phone}
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">

            <Link
              to={`/restaurants/${restaurant.id}/categories`}
              className="flex items-center justify-center gap-2 bg-purple-100 text-purple-700 rounded-lg py-3 hover:bg-purple-200"
            >
              <MdCategory />
              Categories
            </Link>

            <Link
              to={`/restaurants/${restaurant.id}/menu`}
              className="flex items-center justify-center gap-2 bg-green-100 text-green-700 rounded-lg py-3 hover:bg-green-200"
            >
              <MdRestaurantMenu />
              Menu
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default RestaurantDetail;