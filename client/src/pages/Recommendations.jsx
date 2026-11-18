import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSearch } from "react-icons/fa";

import {
  getRecommendedRestaurantsApi,
  getRecommendedMenuApi,
  getPopularRecommendationsApi,
} from "../api/recommendationApi";

import Loader from "../components/Loader/Loader";
import EmptyState from "../components/EmptyState/EmptyState";
import SearchBar from "../components/SearchBar/SearchBar";
import RestaurantCard from "../components/RestaurantCard/RestaurantCard";
import MenuCard from "../components/MenuCard/MenuCard";

const Recommendations = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);
  const [recommendedMenu, setRecommendedMenu] = useState([]);

  const [popularRestaurants, setPopularRestaurants] = useState([]);
  

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);

      const [
        restaurants,
        menu,
        popular,
      ] = await Promise.all([
        getRecommendedRestaurantsApi(),
        getRecommendedMenuApi(),
        getPopularRecommendationsApi(),
      ]);

      setRecommendedRestaurants(restaurants || []);
      setRecommendedMenu(menu || []);

      setPopularRestaurants(popular?.restaurants || []);
     
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterRestaurants = (list) =>
    list.filter((restaurant) =>
      restaurant.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  const filterMenu = (list) =>
    list.filter((item) =>
      item.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  const filteredRecommendedRestaurants = useMemo(
    () => filterRestaurants(recommendedRestaurants),
    [recommendedRestaurants, search]
  );

  const filteredPopularRestaurants = useMemo(
    () => filterRestaurants(popularRestaurants),
    [popularRestaurants, search]
  );

  const filteredRecommendedMenu = useMemo(
    () => filterMenu(recommendedMenu),
    [recommendedMenu, search]
  );

 

  if (loading) {
    return <Loader />;
  }
  return (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8"
      >
        <FaArrowLeft />
        Back to Home
      </button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          🎯 Recommendations
        </h1>

        <p className="mt-2 text-gray-600">
          Personalized suggestions based on your activity.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <SearchBar
          placeholder="Search restaurants or dishes..."
          value={search}
          onChange={setSearch}
          onClear={() => setSearch("")}
        />
      </div>

      {/* Empty */}
     {filteredRecommendedRestaurants.length === 0 &&
filteredPopularRestaurants.length === 0 &&
filteredRecommendedMenu.length === 0 ? (
        <EmptyState
          icon={<FaSearch />}
          title="Nothing Found"
          description="Try another search."
        />
      ) : (
        <div className="space-y-12">

          {/* Recommended Restaurants */}
          <section>
            <h2 className="text-2xl font-bold mb-6">
              ⭐ Recommended Restaurants
            </h2>

            {filteredRecommendedRestaurants.length === 0 ? (
              <p className="text-gray-500">
                No restaurant recommendations.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRecommendedRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id || restaurant.restaurant_id}
                    restaurant={restaurant}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Recommended Menu */}
          <section>
            <h2 className="text-2xl font-bold mb-6">
              🍕 Recommended Menu
            </h2>

            {filteredRecommendedMenu.length === 0 ? (
              <p className="text-gray-500">
                No menu recommendations.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {filteredRecommendedMenu.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Popular Restaurants */}
          <section>
            <h2 className="text-2xl font-bold mb-6">
              🔥 Popular Restaurants
            </h2>

            {filteredPopularRestaurants.length === 0 ? (
              <p className="text-gray-500">
                No popular restaurants.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPopularRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Popular Menu */}
          

        </div>
      )}
    </div>
  </div>
);
};

export default Recommendations;