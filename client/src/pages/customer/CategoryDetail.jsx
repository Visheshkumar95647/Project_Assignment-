import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MdRestaurantMenu } from "react-icons/md";

import { getCategoryByIdApi } from "../../api/categoryApi";
import Loader from "../../components/Loader/Loader";

const CategoryDetail = () => {
  const { id: restaurantId, categoryId } = useParams();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategory();
  }, [categoryId]);

  const loadCategory = async () => {
    try {
      const data = await getCategoryByIdApi(categoryId);
      setCategory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!category) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">Category not found</h2>

        <Link
          to={`/restaurants/${restaurantId}/categories`}
          className="text-blue-600"
        >
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <div className="flex gap-2 text-sm text-gray-500 mb-6">

        <Link to="/restaurants">Restaurants</Link>

        <span>/</span>

        <Link to={`/restaurants/${restaurantId}/categories`}>
          Categories
        </Link>

        <span>/</span>

        <span>{category.name}</span>

      </div>

      <div className="bg-white rounded-xl shadow p-8 text-center">

        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
          <MdRestaurantMenu
            size={32}
            className="text-orange-600"
          />
        </div>

        <h1 className="text-2xl font-bold mb-3">
          {category.name}
        </h1>

        <Link
          to={`/restaurants/${restaurantId}/categories/${categoryId}/menu`}
          className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
        >
          <MdRestaurantMenu />
          View Menu
        </Link>

      </div>

    </div>
  );
};

export default CategoryDetail;