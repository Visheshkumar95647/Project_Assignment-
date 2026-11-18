import { Link } from "react-router-dom";
import { MdRestaurantMenu } from "react-icons/md";

const CategoryCard = ({ category: { id, name, image_url }, restaurantId }) => {
  return (
    <Link
      to={`/restaurants/${restaurantId}/categories/${id}/menu`}
      className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-primary-200 hover:shadow-md group"
    >
      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 transition group-hover:bg-primary-100 overflow-hidden">
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <MdRestaurantMenu className="h-6 w-6 text-primary-500" />
        )}
      </div>

      <div className="min-w-0">
        <h3 className="truncate font-semibold text-gray-800">
          {name}
        </h3>

        <p className="mt-0.5 text-xs text-gray-400">
          View menu items →
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;