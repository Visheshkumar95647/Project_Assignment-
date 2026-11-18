import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getRestaurantCategoriesApi,
  searchCategoriesApi,
} from "../../api/categoryApi";

import CategoryCard from "../../components/CategoryCard/CategoryCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import Loader from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";

const RestaurantCategories = () => {
  const { id: restaurantId } = useParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, [restaurantId]);

  const loadCategories = async () => {
    try {
      const data = await getRestaurantCategoriesApi(restaurantId);
      setCategories(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (keyword) => {
    if (!keyword.trim()) {
      loadCategories();
      return;
    }

    try {
      const data = await searchCategoriesApi(
        keyword,
        restaurantId
      );

      setCategories(
        data || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Breadcrumb */}

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">

        <Link to="/restaurants">
          Restaurants
        </Link>

        <span>/</span>

        <span>Categories</span>

      </div>

      <h1 className="text-3xl font-bold mb-6">
        Restaurant Categories
      </h1>

      <SearchBar
        placeholder="Search categories..."
        onSearch={handleSearch}
        onClear={loadCategories}
      />
            <div className="mt-8">

        {categories.length === 0 ? (

          <EmptyState
            icon="📂"
            title="No Categories Found"
            description="This restaurant has no categories."
          />

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {categories.map((category) => (

              <CategoryCard
                key={category.id}
                category={category}
                restaurantId={restaurantId}
              />

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default RestaurantCategories;