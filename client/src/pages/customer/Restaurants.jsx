import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  getRestaurantsApi,
  searchRestaurantsApi,
} from "../../api/restaurantApi";

import { getFavoritesApi } from "../../api/favoriteApi";

import RestaurantCard from "../../components/RestaurantCard/RestaurantCard";
import RestaurantSearchFilter from "../../components/RestaurantSearchFilter/RestaurantSearchFilter";
import Loader from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category");

    if (category) {
      handleSearch({
        keyword: null,
        location: null,
        category,
      });
    } else {
      loadRestaurants();
    }
  }, [searchParams]);

  const loadRestaurants = async () => {
    try {
      const restaurantData = await getRestaurantsApi();
      setRestaurants(restaurantData);

      try {
        const favoriteData = await getFavoritesApi();

        setFavorites(
          favoriteData
            .map((item) => item.restaurant_id || item.id)
            .filter(Boolean)
        );
      } catch {
        setFavorites([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters) => {
    if (
      !filters.keyword &&
      !filters.location &&
      !filters.category
    ) {
      loadRestaurants();
      return;
    }

    try {
      const data = await searchRestaurantsApi(
        filters.keyword,
        filters.location,
        filters.category
      );

      setRestaurants(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Restaurants
      </h1>

      <RestaurantSearchFilter
        onSearch={handleSearch}
        onClear={loadRestaurants}
      />

      <div className="mt-8">
        {restaurants.length === 0 ? (
          <EmptyState
            icon="🍽️"
            title="No Restaurants Found"
            description="No restaurants are available."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                isFavorite={favorites.includes(restaurant.id)}
                onFavoriteChange={loadRestaurants}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;