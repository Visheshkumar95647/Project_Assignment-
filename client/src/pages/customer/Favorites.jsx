// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { FaArrowLeft, FaHeart, FaSearch } from 'react-icons/fa';
// // import toast from 'react-hot-toast';
// // import { getFavoriteRestaurantsApi, removeFavoriteApi } from '../../api/favoriteApi';
// // import Loader from '../../components/Loader/Loader';
// // import EmptyState from '../../components/EmptyState/EmptyState';
// // import SearchBar from '../../components/SearchBar/SearchBar';

// // const Favorites = () => {
// //   const navigate = useNavigate();
// //   const [favorites, setFavorites] = useState([]);
// //   const [filteredFavorites, setFilteredFavorites] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [removingId, setRemovingId] = useState(null);

// //   useEffect(() => {
// //     fetchFavorites();
// //   }, []);

// //   // Filter favorites based on search term
// //   useEffect(() => {
// //     if (searchTerm.trim() === '') {
// //       setFilteredFavorites(favorites);
// //     } else {
// //       const filtered = favorites.filter((restaurant) =>
// //         restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         restaurant.address?.toLowerCase().includes(searchTerm.toLowerCase())
// //       );
// //       setFilteredFavorites(filtered);
// //     }
// //   }, [searchTerm, favorites]);

// //   const fetchFavorites = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await getFavoriteRestaurantsApi();
// //       setFavorites(data || []);
// //     } catch (error) {
// //       console.error('Error fetching favorites:', error);
// //       toast.error('Failed to load favorites');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleRemoveFavorite = async (restaurantId) => {
// //     try {
// //       setRemovingId(restaurantId);
// //       await removeFavoriteApi(restaurantId);
// //       setFavorites(favorites.filter((r) => r.id !== restaurantId));
// //       toast.success('Removed from favorites');
// //     } catch (error) {
// //       console.error('Error removing favorite:', error);
// //       toast.error('Failed to remove from favorites');
// //     } finally {
// //       setRemovingId(null);
// //     }
// //   };

// //   const handleSearch = (value) => {
// //     setSearchTerm(value);
// //   };

// //   const handleClearSearch = () => {
// //     setSearchTerm('');
// //   };

// //   if (loading) {
// //     return <Loader />;
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <div className="max-w-7xl mx-auto px-4 py-8">
// //         {/* Header */}
// //         <button
// //           onClick={() => navigate('/')}
// //           className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8"
// //         >
// //           <FaArrowLeft /> Home
// //         </button>

// //         <div className="mb-8">
// //           <h1 className="text-3xl font-bold text-gray-800 mb-2">My Favorite Restaurants</h1>
// //           <p className="text-gray-600">
// //             {favorites.length} {favorites.length === 1 ? 'restaurant' : 'restaurants'} saved
// //           </p>
// //         </div>

// //         {/* Search Bar */}
// //         {favorites.length > 0 && (
// //           <div className="mb-8">
// //             <SearchBar
// //               placeholder="Search favorites..."
// //               value={searchTerm}
// //               onChange={handleSearch}
// //               onClear={handleClearSearch}
// //             />
// //           </div>
// //         )}

// //         {/* Empty State */}
// //         {favorites.length === 0 ? (
// //           <EmptyState
// //             title="No Favorite Restaurants Yet"
// //             description="Start adding your favorite restaurants to quickly access them later!"
// //             buttonText="Browse Restaurants"
// //             onButtonClick={() => navigate('/restaurants')}
// //           />
// //         ) : filteredFavorites.length === 0 ? (
// //           <div className="bg-white rounded-lg shadow-md p-12 text-center">
// //             <FaSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
// //             <h2 className="text-xl font-semibold text-gray-800 mb-2">No results found</h2>
// //             <p className="text-gray-600 mb-4">
// //               No restaurants match your search term "{searchTerm}"
// //             </p>
// //             <button
// //               onClick={handleClearSearch}
// //               className="text-orange-600 hover:text-orange-700 font-semibold"
// //             >
// //               Clear search
// //             </button>
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {filteredFavorites.map((restaurant) => (
// //               <div
// //                 key={restaurant.id}
// //                 className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
// //               >
// //                 {/* Image */}
// //                 {restaurant.image_url && (
// //                   <img
// //                     src={restaurant.image_url}
// //                     alt={restaurant.name}
// //                     className="w-full h-48 object-cover"
// //                   />
// //                 )}

// //                 {/* Content */}
// //                 <div className="p-6">
// //                   {/* Header */}
// //                   <div className="flex justify-between items-start mb-2">
// //                     <h3 className="text-lg font-semibold text-gray-800 flex-1">{restaurant.name}</h3>
// //                     <button
// //                       onClick={() => handleRemoveFavorite(restaurant.id)}
// //                       disabled={removingId === restaurant.id}
// //                       className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition disabled:opacity-50"
// //                       title="Remove from favorites"
// //                     >
// //                       <FaHeart size={18} />
// //                     </button>
// //                   </div>

// //                   {/* Address */}
// //                   {restaurant.address && (
// //                     <p className="text-sm text-gray-600 mb-4">{restaurant.address}</p>
// //                   )}

// //                   {/* Info */}
// //                   <div className="flex gap-4 mb-4 text-sm">
// //                     {restaurant.rating && (
// //                       <div className="flex items-center">
// //                         <span className="text-yellow-500 mr-1">⭐</span>
// //                         <span className="text-gray-700">{restaurant.rating}</span>
// //                       </div>
// //                     )}
// //                     {restaurant.delivery_time && (
// //                       <div className="text-gray-600">
// //                         <span>⏱ {restaurant.delivery_time} min</span>
// //                       </div>
// //                     )}
// //                     {restaurant.category && (
// //                       <div className="text-gray-600">
// //                         <span>📍 {restaurant.category}</span>
// //                       </div>
// //                     )}
// //                   </div>

// //                   {/* Description */}
// //                   {restaurant.description && (
// //                     <p className="text-sm text-gray-600 mb-4 line-clamp-2">
// //                       {restaurant.description}
// //                     </p>
// //                   )}

// //                   {/* Action Buttons */}
// //                   <div className="flex gap-3">
// //                     <button
// //                       onClick={() => navigate(`/restaurants/${restaurant.id}`)}
// //                       className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition font-semibold text-sm"
// //                     >
// //                       View Details
// //                     </button>
// //                     <button
// //                       onClick={() => navigate(`/restaurants/${restaurant.id}/menu`)}
// //                       className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-semibold text-sm"
// //                     >
// //                       Order Now
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Favorites;


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaArrowLeft, FaHeart } from "react-icons/fa";
// import toast from "react-hot-toast";

// import {
//   getFavoriteRestaurantsApi,
//   removeFavoriteApi,
// } from "../../api/favoriteApi";

// import Loader from "../../components/Loader/Loader";
// import EmptyState from "../../components/EmptyState/EmptyState";
// import SearchBar from "../../components/SearchBar/SearchBar";

// const Favorites = () => {
//   const navigate = useNavigate();

//   const [favorites, setFavorites] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadFavorites();
//   }, []);

//   const loadFavorites = async () => {
//     try {
//       const data = await getFavoriteRestaurantsApi();
//       setFavorites(data || []);
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeFavorite = async (id) => {
//     try {
//       await removeFavoriteApi(id);

//       setFavorites((prev) =>
//         prev.filter((item) => item.id !== id)
//       );

//       toast.success("Removed from favorites");
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const filtered = favorites.filter((restaurant) =>
//     String(restaurant?.name || "")
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   );

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">

//       <div className="max-w-7xl mx-auto px-4 py-8">

//         <button
//           onClick={() => navigate("/")}
//           className="flex items-center gap-2 text-orange-600 mb-8"
//         >
//           <FaArrowLeft />
//           Home
//         </button>

//         <h1 className="text-3xl font-bold mb-2">
//           Favorite Restaurants
//         </h1>

//         <p className="text-gray-500 mb-6">
//           {favorites.length} Restaurant
//           {favorites.length !== 1 && "s"}
//         </p>

//         {favorites.length > 0 && (
//           <SearchBar
//             placeholder="Search..."
//             value={search}
//             onChange={setSearch}
//             onClear={() => setSearch("")}
//           />
//         )}

//         <div className="mt-8">

//           {favorites.length === 0 ? (

//             <EmptyState
//               title="No Favorites"
//               description="Add restaurants to your favorites."
//               buttonText="Browse Restaurants"
//               onButtonClick={() =>
//                 navigate("/restaurants")
//               }
//             />

//           ) : filtered.length === 0 ? (

//             <EmptyState
//               title="No Results"
//               description="No restaurant found."
//             />

//           ) : (

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

//               {filtered.map((restaurant) => (

//                 <div
//                   key={restaurant.id}
//                   className="bg-white rounded-lg shadow p-5"
//                 >

//                   <div className="relative h-44 w-full bg-gray-100 rounded-lg overflow-hidden mb-4">
//                     {restaurant.image_url ? (
//                       <img
//                         src={restaurant.image_url}
//                         alt={restaurant.name}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300">
//                         🍽️
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex justify-between">

//                     <h2 className="text-lg font-semibold">
//                       {restaurant.name}
//                     </h2>

//                     <button
//                       onClick={() =>
//                         removeFavorite(restaurant.id)
//                       }
//                       className="text-red-500"
//                     >
//                       <FaHeart />
//                     </button>

//                   </div>

//                   <p className="text-sm text-gray-500 mt-2">
//                     {restaurant.address}
//                   </p>

//                   <div className="flex gap-3 mt-5">

//                     <button
//                       onClick={() =>
//                         navigate(`/restaurants/${restaurant.id}`)
//                       }
//                       className="flex-1 bg-orange-600 text-white py-2 rounded-lg"
//                     >
//                       Details
//                     </button>

//                     <button
//                       onClick={() =>
//                         navigate(`/restaurants/${restaurant.id}/menu`)
//                       }
//                       className="flex-1 border py-2 rounded-lg"
//                     >
//                       Menu
//                     </button>

//                   </div>

//                 </div>

//               ))}

//             </div>

//           )}

//         </div>

//       </div>

//     </div>
//   );
// };

// export default Favorites;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";

import {
  getFavoriteRestaurantsApi,
  removeFavoriteApi,
} from "../../api/favoriteApi";

import Loader from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";
import SearchBar from "../../components/SearchBar/SearchBar";

const Favorites = () => {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await getFavoriteRestaurantsApi();
      setFavorites(data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id) => {
    try {
      await removeFavoriteApi(id);

      setFavorites((prev) =>
        prev.filter((item) => item.id !== id)
      );

      toast.success("Removed from favorites");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filtered = favorites.filter((restaurant) =>
    String(restaurant.restaurant_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-orange-600 mb-8"
        >
          <FaArrowLeft />
          Home
        </button>

        <h1 className="text-3xl font-bold mb-2">
          Favorite Restaurants
        </h1>

        <p className="text-gray-500 mb-6">
          {favorites.length} Restaurant
          {favorites.length !== 1 && "s"}
        </p>

        {favorites.length > 0 && (
          <SearchBar
            placeholder="Search restaurant..."
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
          />
        )}

        <div className="mt-8">
                      {favorites.length === 0 ? (

            <EmptyState
              title="No Favorites"
              description="Add restaurants to your favorites."
              buttonText="Browse Restaurants"
              onButtonClick={() => navigate("/restaurants")}
            />

          ) : filtered.length === 0 ? (

            <EmptyState
              title="No Results"
              description="No restaurant found."
            />

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {filtered.map((restaurant) => (

                <div
                  key={restaurant.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
                >

                  {/* Image Placeholder */}
                  <div className="h-44 bg-gradient-to-r from-orange-100 to-orange-200 flex items-center justify-center">
                    <span className="text-6xl">🍽️</span>
                  </div>

                  <div className="p-5">

                    <div className="flex items-start justify-between">

                      <div>

                        <h2 className="text-xl font-semibold text-gray-800">
                          {restaurant.restaurant_name}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                          Restaurant ID : {restaurant.restaurant_id}
                        </p>

                      </div>

                      <button
                        onClick={() => removeFavorite(restaurant.id)}
                        className="text-red-500 hover:text-red-600"
                        title="Remove Favorite"
                      >
                        <FaHeart size={18} />
                      </button>

                    </div>

                    <div className="mt-6 flex gap-3">

                      <button
                        onClick={() =>
                          navigate(`/restaurants/${restaurant.restaurant_id}`)
                        }
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-medium transition"
                      >
                        Details
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/restaurants/${restaurant.restaurant_id}/menu`)
                        }
                        className="flex-1 border border-gray-300 hover:bg-gray-100 py-2 rounded-lg font-medium transition"
                      >
                        Menu
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
          </div>
  );
};

export default Favorites;