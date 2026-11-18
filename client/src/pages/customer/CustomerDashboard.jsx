import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiHeart, HiShoppingCart, HiSparkles, HiTruck } from "react-icons/hi";
import { MdRestaurant, MdReceiptLong } from "react-icons/md";

import { getRestaurantsApi } from "../../api/restaurantApi";
import { getFavoriteRestaurantsApi } from "../../api/favoriteApi";
import { getOrdersApi } from "../../api/orderApi";

import {
    getRecommendedRestaurantsApi,
    getRecommendedMenuApi,
    getPopularRecommendationsApi,
} from "../../api/recommendationApi";

import { getCartApi } from "../../api/cartApi";

import Loader from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";
import RestaurantCard from "../../components/RestaurantCard/RestaurantCard";
import MenuCard from "../../components/MenuCard/MenuCard";

const statCards = [
    {
        key: "restaurants",
        title: "Restaurants",
        icon: MdRestaurant,
        accent: "bg-orange-100 text-orange-700",
    },
    {
        key: "favorites",
        title: "Favorites",
        icon: HiHeart,
        accent: "bg-rose-100 text-rose-700",
    },
    {
        key: "orders",
        title: "Orders",
        icon: MdReceiptLong,
        accent: "bg-blue-100 text-blue-700",
    },
    {
        key: "cartItems",
        title: "Cart Items",
        icon: HiShoppingCart,
        accent: "bg-emerald-100 text-emerald-700",
    },
];

const quickLinks = [
    {
        title: "Browse Restaurants",
        description: "Explore places to order from.",
        to: "/restaurants",
        tone: "bg-orange-600 text-white",
    },
    {
        title: "Your Favorites",
        description: "Jump back into saved restaurants.",
        to: "/favorites",
        tone: "bg-white text-gray-900 border border-gray-200",
    },
    {
        title: "Recommendations",
        description: "Personalized food suggestions.",
        to: "/recommendations",
        tone: "bg-white text-gray-900 border border-gray-200",
    },
];

const CustomerDashboard = () => {
    const [loading, setLoading] = useState(true);

    const [restaurants, setRestaurants] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [orders, setOrders] = useState([]);

    const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);
    const [recommendedMenu, setRecommendedMenu] = useState([]);

    const [popularRestaurants, setPopularRestaurants] = useState([]);


    const [cart, setCart] = useState({ items: [] });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);

            const [
                restaurantData,
                favoriteData,
                orderData,
                recommendedRestaurantData,
                recommendedMenuData,
                popularData,
                cartData,
            ] = await Promise.all([
                getRestaurantsApi().catch(() => []),
                getFavoriteRestaurantsApi().catch(() => []),
                getOrdersApi().catch(() => []),
                getRecommendedRestaurantsApi().catch(() => []),
                getRecommendedMenuApi().catch(() => []),
                getPopularRecommendationsApi().catch(() => ({
                    restaurants: [],
                    menu_items: [],
                })),
                getCartApi().catch(() => ({ items: [] })),
            ]);

            setRestaurants(Array.isArray(restaurantData) ? restaurantData : []);
            setFavorites(Array.isArray(favoriteData) ? favoriteData : []);
            setOrders(Array.isArray(orderData) ? orderData : []);

            setRecommendedRestaurants(
                Array.isArray(recommendedRestaurantData)
                    ? recommendedRestaurantData
                    : []
            );

            setRecommendedMenu(
                Array.isArray(recommendedMenuData)
                    ? recommendedMenuData
                    : []
            );
            setPopularRestaurants(popularData?.restaurants || []);

            setCart(cartData || { items: [] });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader/>;
    }

    const stats = {
        restaurants: restaurants.length,
        favorites: favorites.length,
        orders: orders.length,
        cartItems: (cart.items || []).reduce(
            (sum, item) => sum + (item.quantity || 0),
            0
        ),
    };

    const latestOrders = orders.slice(0, 3);
    const spotlightRestaurants = restaurants.slice(0, 3);

    const suggestedRestaurants = recommendedRestaurants.slice(0, 3);
    const suggestedMenu = recommendedMenu.slice(0, 6);

    const topRestaurants = popularRestaurants.slice(0, 3);
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff3e8,_#f8fafc_42%,_#eef2ff)]">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                {/* Hero */}
                <section className="overflow-hidden rounded-[28px] bg-gray-950 px-6 py-8 text-white shadow-xl sm:px-8">
                    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">

                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">
                                <HiSparkles className="h-4 w-4" />
                                Customer Dashboard
                            </div>

                            <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
                                Everything you need to order faster is in one place.
                            </h1>

                            <p className="mt-4 max-w-2xl text-sm text-gray-300 sm:text-base">
                                Track orders, revisit favorites, discover restaurants, and
                                explore personalized food recommendations.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                {quickLinks.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className={`rounded-xl px-4 py-3 text-sm font-semibold transition hover:translate-y-[-1px] ${link.tone}`}
                                    >
                                        <div>{link.title}</div>
                                        <div className="mt-0.5 text-xs opacity-80">
                                            {link.description}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                            {statCards.map((card) => {
                                const Icon = card.icon;

                                return (
                                    <div
                                        key={card.key}
                                        className="rounded-2xl bg-white/8 p-4 backdrop-blur"
                                    >
                                        <div
                                            className={`mb-3 inline-flex rounded-xl p-3 ${card.accent}`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <div className="text-sm text-gray-300">
                                            {card.title}
                                        </div>

                                        <div className="mt-1 text-3xl font-bold text-white">
                                            {stats[card.key]}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">

                    {/* Recent Orders */}
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">

                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Recently Active
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Your newest orders at a glance.
                                </p>
                            </div>

                            <Link
                                to="/orders"
                                className="text-sm font-semibold text-orange-600"
                            >
                                View all
                            </Link>
                        </div>

                        {latestOrders.length === 0 ? (
                            <EmptyState
                                icon="🧾"
                                title="No recent orders"
                                description="Your new orders will appear here once you place one."
                            />
                        ) : (
                            <div className="space-y-4">
                                {latestOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="font-semibold">
                                                    Order #{order.id}
                                                </div>

                                                <div className="text-xs text-gray-500 mt-1">
                                                    {new Date(order.created_at).toLocaleString()}
                                                </div>
                                            </div>

                                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase text-orange-700">
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex justify-between text-sm text-gray-600">
                                            <span>
                                                {order.items?.length || 0} item(s)
                                            </span>

                                            <span className="font-semibold text-gray-900">
                                                ₹{order.total_amount}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className="space-y-6">

                        {/* Spotlight */}
                        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">

                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        Restaurant Spotlight
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Start with the best restaurants.
                                    </p>
                                </div>

                                <Link
                                    to="/restaurants"
                                    className="text-sm font-semibold text-orange-600"
                                >
                                    Explore
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {spotlightRestaurants.map((restaurant) => (
                                    <Link
                                        key={restaurant.id}
                                        to={`/restaurants/${restaurant.id}`}
                                        className="flex items-center gap-4 rounded-2xl border border-gray-100 p-3 hover:bg-orange-50"
                                    >
                                        <div className="h-16 w-16 overflow-hidden rounded-2xl bg-gray-100">
                                            {restaurant.image_url ? (
                                                <img
                                                    src={restaurant.image_url}
                                                    alt={restaurant.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-2xl">
                                                    🍽️
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <div className="font-semibold">
                                                {restaurant.name}
                                            </div>

                                            <div className="text-sm text-gray-500">
                                                {restaurant.location || restaurant.address}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                        </div>
                        {/* Recommended Restaurants */}
                        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        ⭐ Recommended Restaurants
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Based on your order history and preferences.
                                    </p>
                                </div>

                                <Link
                                    to="/restaurants"
                                    className="text-sm font-semibold text-orange-600"
                                >
                                    View All
                                </Link>
                            </div>

                            {suggestedRestaurants.length === 0 ? (
                                <EmptyState
                                    icon="✨"
                                    title="No recommendations yet"
                                    description="Order from restaurants to receive personalized suggestions."
                                />
                            ) : (
                                <div className="grid gap-4">
                                    {suggestedRestaurants.map((restaurant) => (
                                        <RestaurantCard
                                            key={restaurant.id || restaurant.restaurant_id}
                                            restaurant={restaurant}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recommended Menu */}
                        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        🍕 Recommended Menu
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Dishes we think you'll enjoy.
                                    </p>
                                </div>
                            </div>

                            {suggestedMenu.length === 0 ? (
                                <EmptyState
                                    icon="🍕"
                                    title="No menu recommendations"
                                    description="We'll recommend dishes after a few orders."
                                />
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {suggestedMenu
                                        .filter((item) => item && item.id)
                                        .map((item) => (
                                            <MenuCard
                                                key={item.id}
                                                item={item.menu_item || item}
                                            />
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Popular Restaurants */}
                        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                            <div className="mb-5">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    🔥 Popular Restaurants
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Trending restaurants across the platform.
                                </p>
                            </div>

                            <div className="grid gap-4">
                                {topRestaurants.map((restaurant) => (
                                    <RestaurantCard
                                        key={restaurant.id}
                                        restaurant={restaurant}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Current Cart
                            </h2>

                            <p className="text-sm text-gray-500">
                                Resume checkout without leaving the dashboard.
                            </p>
                        </div>

                        <Link
                            to="/cart"
                            className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                            Open Cart
                        </Link>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <div className="rounded-2xl bg-orange-50 p-4 text-orange-900">
                            <div className="mb-2 inline-flex rounded-xl bg-white p-2 text-orange-600">
                                <HiShoppingCart className="h-5 w-5" />
                            </div>

                            <div className="text-sm font-medium">
                                Items in Cart
                            </div>

                            <div className="mt-1 text-3xl font-bold">
                                {stats.cartItems}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-blue-50 p-4 text-blue-900">
                            <div className="mb-2 inline-flex rounded-xl bg-white p-2 text-blue-600">
                                <HiTruck className="h-5 w-5" />
                            </div>

                            <div className="text-sm font-medium">
                                Active Orders
                            </div>

                            <div className="mt-1 text-3xl font-bold">
                                {
                                    orders.filter(
                                        (order) =>
                                            order.status !== "COMPLETED" &&
                                            order.status !== "CANCELLED"
                                    ).length
                                }
                            </div>
                        </div>

                        <div className="rounded-2xl bg-rose-50 p-4 text-rose-900">
                            <div className="mb-2 inline-flex rounded-xl bg-white p-2 text-rose-600">
                                <HiHeart className="h-5 w-5" />
                            </div>

                            <div className="text-sm font-medium">
                                Saved Restaurants
                            </div>

                            <div className="mt-1 text-3xl font-bold">
                                {favorites.length}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-900">
                            <div className="mb-2 inline-flex rounded-xl bg-white p-2 text-emerald-600">
                                <HiSparkles className="h-5 w-5" />
                            </div>

                            <div className="text-sm font-medium">
                                Recommendations
                            </div>

                            <div className="mt-1 text-3xl font-bold">
                                {recommendedRestaurants.length}
                            </div>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    );

};

export default CustomerDashboard;