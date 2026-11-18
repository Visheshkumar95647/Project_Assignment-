import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getRestaurantMenuApi,
  searchMenuApi,
} from "../../api/menuApi";

import MenuCard from "../../components/MenuCard/MenuCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import Loader from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";

const RestaurantMenu = () => {
  const { id: restaurantId } = useParams();

  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [showSpecials, setShowSpecials] = useState(false);
  const [showDeals, setShowDeals] = useState(false);
  const [showAvailable, setShowAvailable] = useState(false);

  useEffect(() => {
    loadMenu();
  }, [restaurantId]);

  const getMaxPrice = () => {
    if (allItems.length === 0) return 10000;
    return Math.ceil(Math.max(...allItems.map((item) => item.price || 0)));
  };

  useEffect(() => {
    if (maxPrice === 10000 && allItems.length > 0) {
      setMaxPrice(getMaxPrice());
    }
  }, [allItems]);

  const loadMenu = async () => {
    try {
      const data = await getRestaurantMenuApi(restaurantId);
      setAllItems(data || []);
      setItems(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (keyword) => {
    if (!keyword.trim()) {
      loadMenu();
      return;
    }

    try {
      const data = await searchMenuApi(keyword);

      setItems(
        data.filter(
          (item) =>
            item.restaurant_id === Number(restaurantId)
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const applyFilters = () => {
    const filtered = allItems.filter((item) => {
      // Price range filter
      if (item.price < minPrice || item.price > maxPrice) {
        return false;
      }

      // Specials filter
      if (showSpecials && !item.is_special) {
        return false;
      }

      // Deals filter
      if (showDeals && !item.is_deal_of_day) {
        return false;
      }

      // Available filter
      if (showAvailable && !item.is_available) {
        return false;
      }

      return true;
    });

    setItems(filtered);
  };

  const resetFilters = () => {
    setMinPrice(0);
    setMaxPrice(getMaxPrice());
    setShowSpecials(false);
    setShowDeals(false);
    setShowAvailable(false);
    setItems(allItems);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">

        <Link to="/restaurants">
          Restaurants
        </Link>

        <span>/</span>

        <span>Menu</span>

      </div>

      <h1 className="text-3xl font-bold mb-6">
        Restaurant Menu
      </h1>

      {/* Filter Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <span className="self-center text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <input
                type="range"
                min="0"
                max={getMaxPrice()}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Specials Filter */}
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showSpecials}
                onChange={(e) => setShowSpecials(e.target.checked)}
                className="w-4 h-4 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Specials</span>
            </label>
          </div>

          {/* Deals Filter */}
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showDeals}
                onChange={(e) => setShowDeals(e.target.checked)}
                className="w-4 h-4 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Deals</span>
            </label>
          </div>

          {/* Available Filter */}
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAvailable}
                onChange={(e) => setShowAvailable(e.target.checked)}
                className="w-4 h-4 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Available</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-end gap-2">
            <button
              onClick={applyFilters}
              className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm"
            >
              Apply
            </button>
            <button
              onClick={resetFilters}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <SearchBar
        placeholder="Search menu..."
        onSearch={handleSearch}
        onClear={loadMenu}
      />

            <div className="mt-8">

        {items.length === 0 ? (

          <EmptyState
            icon="🍴"
            title="No Menu Items"
            description="No menu items found."
          />

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {items.map((item) => (

              <MenuCard
                key={item.id}
                item={item}
              />

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default RestaurantMenu;
