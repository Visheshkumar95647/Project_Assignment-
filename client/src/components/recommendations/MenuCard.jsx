import { FaStar, FaPlus, FaLeaf } from "react-icons/fa";

const MenuCard = ({ item, onAdd }) => {
  return (
    <div className="min-w-[250px] max-w-[250px] bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">

      {/* Image */}

      <img
        src={
          item.image_url ||
          "https://placehold.co/600x400?text=Food"
        }
        alt={item.name}
        className="w-full h-40 object-cover"
      />

      {/* Body */}

      <div className="p-4">

        <div className="flex justify-between items-start">

          <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
            {item.name}
          </h3>

          <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-lg text-xs">

            <FaStar />

            {item.rating || "4.5"}

          </div>

        </div>

        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {item.description || "Delicious food prepared fresh."}
        </p>

        <div className="flex items-center justify-between mt-4">

          <div>

            <p className="text-orange-600 text-xl font-bold">
              ₹{item.price}
            </p>

            <p className="text-xs text-gray-500">
              {item.category?.name || "Food"}
            </p>

          </div>

          <button
            onClick={() => onAdd && onAdd(item)}
            disabled={!item.is_available}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${
              item.is_available
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FaPlus />
            {item.is_available ? "Add" : "Unavailable"}
          </button>

        </div>

        {item.is_vegetarian && (
          <div className="flex items-center gap-2 mt-3 text-green-600 text-sm">
            <FaLeaf />
            Vegetarian
          </div>
        )}

      </div>

    </div>
  );
};

export default MenuCard;