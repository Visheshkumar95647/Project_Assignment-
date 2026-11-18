import { useState } from "react";

const MenuFilterPanel = ({ onFilter, onClear }) => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onFilter({
      keyword: keyword.trim() || null,
      category: category.trim() || null,
      restaurant_id: restaurantId ? parseInt(restaurantId) : null,
      min_price: minPrice ? parseFloat(minPrice) : null,
      max_price: maxPrice ? parseFloat(maxPrice) : null,
    });
  };

  const handleClear = () => {
    setKeyword("");
    setCategory("");
    setRestaurantId("");
    setMinPrice("");
    setMaxPrice("");
    onClear();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        Filter Menu Items
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

          {/* Search Keyword */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Name
            </label>

            <input
              type="text"
              placeholder="Menu item name..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>

            <input
              type="text"
              placeholder="e.g. Pizza, Burger, Chinese"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Restaurant ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant ID
            </label>

            <input
              type="number"
              placeholder="Restaurant ID..."
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Minimum Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Price
            </label>

            <input
              type="number"
              step="0.01"
              placeholder="Minimum price..."
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Maximum Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Price
            </label>

            <input
              type="number"
              step="0.01"
              placeholder="Maximum price..."
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-medium"
          >
            Apply Filters
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Clear All
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuFilterPanel;