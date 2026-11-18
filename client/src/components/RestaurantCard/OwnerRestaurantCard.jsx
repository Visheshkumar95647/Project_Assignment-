import { Link } from 'react-router-dom'
import { HiPencil, HiTrash, HiLocationMarker, HiPhone } from 'react-icons/hi'
import { MdRestaurantMenu, MdCategory } from 'react-icons/md'

const OwnerRestaurantCard = ({ restaurant, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
      {/* Image */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {restaurant.image_url ? (
          <img
            src={restaurant.image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
            🍽️
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base mb-1 truncate">{restaurant.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{restaurant.description}</p>

        <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
          <HiLocationMarker className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{restaurant.address}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <HiPhone className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{restaurant.phone}</span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={() => onEdit(restaurant)}
            className="flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium py-2 rounded-lg transition"
          >
            <HiPencil className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(restaurant)}
            className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium py-2 rounded-lg transition"
          >
            <HiTrash className="w-4 h-4" />
            Delete
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/owner/restaurants/${restaurant.id}/categories`}
            className="flex items-center justify-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium py-2 rounded-lg transition"
          >
            <MdCategory className="w-4 h-4" />
            Categories
          </Link>
          <Link
            to={`/owner/restaurants/${restaurant.id}/menu`}
            className="flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium py-2 rounded-lg transition"
          >
            <MdRestaurantMenu className="w-4 h-4" />
            Menu
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OwnerRestaurantCard
