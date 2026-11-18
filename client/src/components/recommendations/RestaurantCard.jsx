import { FaStar, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/restaurants/${restaurant.id}`)}
      className="min-w-[290px] max-w-[290px] bg-white rounded-2xl shadow hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Image */}

      <img
        src={
          restaurant.image_url ||
          "https://placehold.co/600x400?text=Restaurant"
        }
        alt={restaurant.name}
        className="w-full h-44 object-cover"
      />

      {/* Body */}

      <div className="p-4">

        <div className="flex justify-between items-start">

          <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
            {restaurant.name}
          </h3>

          <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-lg text-xs">

            <FaStar />

            {restaurant.rating || "4.5"}

          </div>

        </div>

        <p className="text-gray-500 text-sm mt-1 line-clamp-1">
          {restaurant.description || "Delicious food"}
        </p>

        <div className="flex justify-between mt-4 text-sm text-gray-600">

          <div className="flex items-center gap-1">

            <FaClock />

            {restaurant.delivery_time || "30 mins"}

          </div>

          <div>

            ₹{restaurant.average_cost || 250} for two

          </div>

        </div>

        <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">

          <FaMapMarkerAlt />

          <span className="line-clamp-1">

            {restaurant.address || "Near You"}

          </span>

        </div>

        <button
          className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl font-semibold transition"
        >
          View Restaurant
        </button>

      </div>
    </div>
  );
};

export default RestaurantCard;