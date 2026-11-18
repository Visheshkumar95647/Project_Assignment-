import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getCategoryByIdApi } from "../../api/categoryApi";
import { getCategoryMenuApi } from "../../api/menuApi";

import MenuCard from "../../components/MenuCard/MenuCard";
import Loader from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";

const CategoryMenu = () => {
  const { id: restaurantId, categoryId } = useParams();

  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [categoryId]);

  const loadData = async () => {
    try {
      const [categoryData, menuData] = await Promise.all([
        getCategoryByIdApi(categoryId),
        getCategoryMenuApi(categoryId),
      ]);

      setCategory(categoryData);
      setItems(menuData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">

        <Link to="/restaurants">
          Restaurants
        </Link>

        <span>/</span>

        <Link to={`/restaurants/${restaurantId}/categories`}>
          Categories
        </Link>

        <span>/</span>

        <span>{category?.name}</span>

      </div>

      <h1 className="text-3xl font-bold mb-8">
        {category?.name} Menu
      </h1>

      {items.length === 0 ? (
        <EmptyState
          icon="🍴"
          title="No Menu Items"
          description="No menu items available in this category."
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
  );
};

export default CategoryMenu;