// import { useState, useEffect } from 'react'
// import { useParams, Link } from 'react-router-dom'
// import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi'
// import { MdStar, MdLocalOffer } from 'react-icons/md'
// import toast from 'react-hot-toast'
// import {
//   getRestaurantMenuApi,
//   createMenuItemApi,
//   updateMenuItemApi,
//   deleteMenuItemApi,
//   addSpecialApi,
//   removeSpecialApi,
//   addDealApi,
//   removeDealApi,
// } from '../../api/menuApi'
// import { getRestaurantByIdApi } from '../../api/restaurantApi'
// import MenuItemFormModal from './MenuItemFormModal'
// import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
// import Loader from '../../components/Loader/Loader'
// import EmptyState from '../../components/EmptyState/EmptyState'

// const OwnerMenu = () => {
//   const { id: restaurantId } = useParams()
//   const [restaurant, setRestaurant] = useState(null)
//   const [items, setItems] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [showModal, setShowModal] = useState(false)
//   const [editingItem, setEditingItem] = useState(null)
//   const [formLoading, setFormLoading] = useState(false)

//   const [deleteTarget, setDeleteTarget] = useState(null)
//   const [deleteLoading, setDeleteLoading] = useState(false)

//   const fetchData = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const [rest, menu] = await Promise.all([
//         getRestaurantByIdApi(restaurantId),
//         getRestaurantMenuApi(restaurantId),
//       ])
//       setRestaurant(rest)
//       setItems(menu)
//     } catch (err) {
//       setError(err.message || 'Failed to load menu')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => { fetchData() }, [restaurantId])

//   const handleFormSubmit = async (data) => {
//     setFormLoading(true)
//     try {
//       if (editingItem) {
//         await updateMenuItemApi(editingItem.id, data)
//         toast.success('Item updated!')
//       } else {
//         await createMenuItemApi(data)
//         toast.success('Item created!')
//       }
//       setShowModal(false)
//       fetchData()
//     } catch (err) {
//       toast.error(err.message || 'Failed to save item')
//     } finally {
//       setFormLoading(false)
//     }
//   }

//   const handleDeleteConfirm = async () => {
//     setDeleteLoading(true)
//     try {
//       await deleteMenuItemApi(deleteTarget.id)
//       toast.success('Item deleted')
//       setDeleteTarget(null)
//       fetchData()
//     } catch (err) {
//       toast.error(err.message || 'Failed to delete item')
//     } finally {
//       setDeleteLoading(false)
//     }
//   }

//   const handleToggleSpecial = async (item) => {
//     try {
//       if (item.is_special) {
//         await removeSpecialApi(item.id)
//         toast.success('Removed from specials')
//       } else {
//         await addSpecialApi(item.id)
//         toast.success('Marked as special')
//       }
//       fetchData()
//     } catch (err) {
//       toast.error(err.message || 'Failed to update')
//     }
//   }

//   const handleToggleDeal = async (item) => {
//     try {
//       if (item.is_deal_of_day) {
//         await removeDealApi(item.id)
//         toast.success('Removed from deals')
//       } else {
//         await addDealApi(item.id)
//         toast.success('Marked as deal')
//       }
//       fetchData()
//     } catch (err) {
//       toast.error(err.message || 'Failed to update')
//     }
//   }

//   if (loading) return <Loader />

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Breadcrumb */}
//       <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
//         <Link to="/owner/restaurants" className="hover:text-primary-600">My Restaurants</Link>
//         <span>/</span>
//         <span className="text-gray-700 font-medium">{restaurant?.name} — Menu</span>
//       </div>

//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
//           <p className="text-sm text-gray-400 mt-0.5">{restaurant?.name}</p>
//         </div>
//         <button
//           onClick={() => { setEditingItem(null); setShowModal(true) }}
//           className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition"
//         >
//           <HiPlus className="w-4 h-4" />
//           Add Item
//         </button>
//       </div>

//       {error && <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm mb-6">{error}</div>}

//       {items.length === 0 ? (
//         <EmptyState
//           icon="🍴"
//           title="No menu items yet"
//           description="Add your first menu item."
//           action={
//             <button
//               onClick={() => { setEditingItem(null); setShowModal(true) }}
//               className="mt-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
//             >
//               Add Item
//             </button>
//           }
//         />
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {items.map((item) => (
//             <div
//               key={item.id}
//               className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${!item.is_available ? 'opacity-70' : ''}`}
//             >
//               {/* Image */}
//               <div className="relative h-36 bg-gray-100">
//                 {item.image_url ? (
//                   <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">🍴</div>
//                 )}
//                 <div className="absolute top-2 left-2 flex gap-1">
//                   {item.is_special && (
//                     <span className="bg-yellow-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">★ Special</span>
//                   )}
//                   {item.is_deal_of_day && (
//                     <span className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">Deal</span>
//                   )}
//                 </div>
//               </div>

//               <div className="p-4">
//                 <div className="flex justify-between items-start mb-1">
//                   <h3 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h3>
//                   <span className="text-primary-600 font-bold text-sm ml-2">${item.price.toFixed(2)}</span>
//                 </div>
//                 <p className="text-xs text-gray-400 line-clamp-2 mb-1">{item.description}</p>
//                 <p className={`text-xs font-medium mb-3 ${item.is_available ? 'text-green-600' : 'text-gray-400'}`}>
//                   {item.is_available ? 'Available' : 'Unavailable'}
//                 </p>

//                 {/* Primary actions */}
//                 <div className="grid grid-cols-2 gap-2 mb-2">
//                   <button
//                     onClick={() => { setEditingItem(item); setShowModal(true) }}
//                     className="flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium py-2 rounded-lg transition"
//                   >
//                     <HiPencil className="w-3.5 h-3.5" /> Edit
//                   </button>
//                   <button
//                     onClick={() => setDeleteTarget(item)}
//                     className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium py-2 rounded-lg transition"
//                   >
//                     <HiTrash className="w-3.5 h-3.5" /> Delete
//                   </button>
//                 </div>

//                 {/* Special / Deal toggles */}
//                 <div className="grid grid-cols-2 gap-2">
//                   <button
//                     onClick={() => handleToggleSpecial(item)}
//                     className={`flex items-center justify-center gap-1 text-xs font-medium py-2 rounded-lg transition ${
//                       item.is_special
//                         ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
//                         : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
//                     }`}
//                   >
//                     <MdStar className="w-3.5 h-3.5" />
//                     {item.is_special ? 'Unspecial' : 'Special'}
//                   </button>
//                   <button
//                     onClick={() => handleToggleDeal(item)}
//                     className={`flex items-center justify-center gap-1 text-xs font-medium py-2 rounded-lg transition ${
//                       item.is_deal_of_day
//                         ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                         : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
//                     }`}
//                   >
//                     <MdLocalOffer className="w-3.5 h-3.5" />
//                     {item.is_deal_of_day ? 'Undeal' : 'Deal'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {showModal && (
//         <MenuItemFormModal
//           item={editingItem}
//           restaurantId={restaurantId}
//           categoryId={null}
//           onSubmit={handleFormSubmit}
//           onClose={() => setShowModal(false)}
//           loading={formLoading}
//         />
//       )}

//       {deleteTarget && (
//         <ConfirmDialog
//           message={`Delete "${deleteTarget.name}"? This cannot be undone.`}
//           onConfirm={handleDeleteConfirm}
//           onCancel={() => setDeleteTarget(null)}
//           loading={deleteLoading}
//         />
//       )}
//     </div>
//   )
// }

// export default OwnerMenu
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import { MdLocalOffer, MdStar } from "react-icons/md";
import toast from "react-hot-toast";

import {
    getRestaurantMenuApi,
    createMenuItemApi,
    updateMenuItemApi,
    deleteMenuItemApi,
    addSpecialApi,
    removeSpecialApi,
    addDealApi,
    removeDealApi,
} from "../../api/menuApi";

import MenuItemFormModal from "./MenuItemFormModal";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import Loader from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";

const OwnerMenu = () => {
    const { id: restaurantId } = useParams();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        loadMenu();
    }, [restaurantId]);

    const loadMenu = async () => {
        try {
            const data = await getRestaurantMenuApi(restaurantId);
            setItems(data || []);
        } catch {
            toast.error("Failed to load menu");
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (data) => {
        try {
            setFormLoading(true);

            if (editingItem) {
                await updateMenuItemApi(editingItem.id, data);
                toast.success("Item updated");
            } else {
                await createMenuItemApi(data);
                toast.success("Item created");
            }

            setShowModal(false);
            loadMenu();
        } catch (error) {
            toast.error(error.message || "Failed to save");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);

            await deleteMenuItemApi(deleteTarget.id);

            toast.success("Item deleted");

            setDeleteTarget(null);

            loadMenu();
        } catch (error) {
            toast.error(error.message || "Failed");
        } finally {
            setDeleteLoading(false);
        }
    };

    const toggleSpecial = async (item) => {
        try {
            if (item.is_special) {
                await removeSpecialApi(item.id);
            } else {
                await addSpecialApi(item.id);
            }

            loadMenu();
        } catch {
            toast.error("Failed");
        }
    };

    const toggleDeal = async (item) => {
        try {
            if (item.is_deal_of_day) {
                await removeDealApi(item.id);
            } else {
                await addDealApi(item.id);
            }

            loadMenu();
        } catch {
            toast.error("Failed");
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            <div className="flex justify-between items-center mb-8">

                <div>

                    <div className="text-sm text-gray-500 mb-2">

                        <Link to="/owner/restaurants">
                            My Restaurants
                        </Link>

                        <span> / Menu</span>

                    </div>

                    <h1 className="text-3xl font-bold">
                        Menu Items
                    </h1>

                </div>

                <button
                    onClick={() => {
                        setEditingItem(null);
                        setShowModal(true);
                    }}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <HiPlus />

                    Add Item

                </button>

            </div>
            {items.length === 0 ? (

                <EmptyState
                    icon="🍴"
                    title="No Menu Items"
                    description="Add your first menu item."

                    action={
                        <button
                            onClick={() => {
                                setEditingItem(null);
                                setShowModal(true);
                            }}
                            className="mt-4 bg-orange-600 text-white px-5 py-2 rounded-lg"
                        >
                            Add Item
                        </button>
                    }
                />

            ) : (

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {items.map((item) => (

                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow overflow-hidden"
                        >

                            <div className="h-40 bg-gray-100">

                                {item.image_url ? (

                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />

                                ) : (

                                    <div className="w-full h-full flex items-center justify-center text-5xl">
                                        🍴
                                    </div>

                                )}

                            </div>

                            <div className="p-4">

                                <div className="flex justify-between items-start">

                                    <h2 className="font-semibold">
                                        {item.name}
                                    </h2>

                                    <span className="text-orange-600 font-bold">
                                        ₹{item.price}
                                    </span>

                                </div>

                                <p className="text-gray-500 text-sm mt-2">
                                    {item.description}
                                </p>

                                <p
                                    className={`mt-3 text-sm font-medium ${item.is_available
                                            ? "text-green-600"
                                            : "text-red-500"
                                        }`}
                                >
                                    {item.is_available
                                        ? "Available"
                                        : "Unavailable"}
                                </p>

                                <div className="grid grid-cols-2 gap-2 mt-4">

                                    <button
                                        onClick={() => {
                                            setEditingItem(item);
                                            setShowModal(true);
                                        }}
                                        className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-2 rounded-lg"
                                    >
                                        <HiPencil />

                                        Edit

                                    </button>

                                    <button
                                        onClick={() => setDeleteTarget(item)}
                                        className="flex items-center justify-center gap-2 bg-red-100 text-red-700 py-2 rounded-lg"
                                    >
                                        <HiTrash />

                                        Delete

                                    </button>

                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-2">

                                    <button
                                        onClick={() => toggleSpecial(item)}
                                        className={`flex items-center justify-center gap-2 py-2 rounded-lg ${item.is_special
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-gray-100"
                                            }`}
                                    >
                                        <MdStar />

                                        {item.is_special
                                            ? "Unspecial"
                                            : "Special"}

                                    </button>

                                    <button
                                        onClick={() => toggleDeal(item)}
                                        className={`flex items-center justify-center gap-2 py-2 rounded-lg ${item.is_deal_of_day
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100"
                                            }`}
                                    >
                                        <MdLocalOffer />

                                        {item.is_deal_of_day
                                            ? "Undeal"
                                            : "Deal"}

                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

            {showModal && (
                <MenuItemFormModal
                    item={editingItem}
                    restaurantId={restaurantId}
                    categoryId={null}
                    onSubmit={handleFormSubmit}
                    onClose={() => setShowModal(false)}
                    loading={formLoading}
                />
            )}

            {deleteTarget && (
                <ConfirmDialog
                    message={`Delete "${deleteTarget.name}"?`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deleteLoading}
                />
            )}

        </div>
    );
};

export default OwnerMenu;