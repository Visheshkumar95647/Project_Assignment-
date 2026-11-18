import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiHeart, HiOutlineHeart, HiLocationMarker, HiPhone } from 'react-icons/hi'
import { MdRestaurantMenu, MdCategory } from 'react-icons/md'
import toast from 'react-hot-toast'
import { addFavoriteApi, removeFavoriteApi } from '../../api/favoriteApi'

const RestaurantCard = ({ restaurant, isFavorite = false, onFavoriteChange }) => {
  const [fav, setFav] = useState(isFavorite)
  const [favLoading, setFavLoading] = useState(false)

  const handleFavorite = async (e) => {
    e.preventDefault()
    setFavLoading(true)
    try {
      if (fav) {
        await removeFavoriteApi(restaurant.id)
        setFav(false)
        toast.success('Removed from favorites')
      } else {
        await addFavoriteApi(restaurant.id)
        setFav(true)
        toast.success('Added to favorites')
      }
      onFavoriteChange?.()
    } catch (err) {
      toast.error(err.message || 'Failed to update favorite')
    } finally {
      setFavLoading(false)
    }
  }

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
        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          disabled={favLoading}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full p-1.5 shadow hover:scale-110 transition disabled:opacity-60"
        >
          {fav ? (
            <HiHeart className="w-5 h-5 text-red-500" />
          ) : (
            <HiOutlineHeart className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base mb-1 truncate">{restaurant.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{restaurant.description}</p>

        {restaurant.location && (
          <div className="text-xs text-amber-600 font-medium mb-2 flex items-center gap-1">
            <span>📍</span>
            <span>{restaurant.location}</span>
          </div>
        )}
        {restaurant.categories?.length > 0 && (
          <div className="text-xs text-blue-600 font-medium mb-2 flex items-center gap-1">
            <span>🍴</span>
            <span>
              {restaurant.categories.map(category => category.name).join(", ")}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
          <HiLocationMarker className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{restaurant.address}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <HiPhone className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{restaurant.phone}</span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Link
            to={`/restaurants/${restaurant.id}`}
            className="flex flex-col items-center justify-center gap-1 bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-medium py-2 rounded-lg transition"
          >
            <span>👁️</span>
            <span>View</span>
          </Link>
          <Link
            to={`/restaurants/${restaurant.id}/categories`}
            className="flex flex-col items-center justify-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium py-2 rounded-lg transition"
          >
            <MdCategory className="w-4 h-4" />
            <span>Categories</span>
          </Link>
          <Link
            to={`/restaurants/${restaurant.id}/menu`}
            className="flex flex-col items-center justify-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium py-2 rounded-lg transition"
          >
            <MdRestaurantMenu className="w-4 h-4" />
            <span>Menu</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RestaurantCard
