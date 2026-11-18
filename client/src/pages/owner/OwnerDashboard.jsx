import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiClipboardList, HiPlus, HiSparkles } from "react-icons/hi";
import { MdCategory, MdReceiptLong, MdStorefront } from "react-icons/md";

import { getMyRestaurantsApi } from "../../api/restaurantApi";
import { getOwnerOrdersApi } from "../../api/orderApi";
import Loader from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";

const OwnerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [restaurantData, orderData] = await Promise.all([
          getMyRestaurantsApi().catch(() => []),
          getOwnerOrdersApi().catch(() => []),
        ]);

        setRestaurants(restaurantData || []);
        setOrders(orderData || []);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const categoryCount = restaurants.reduce(
    (sum, restaurant) => sum + (restaurant.categories?.length || 0),
    0
  );
  const menuCount = restaurants.reduce(
    (sum, restaurant) => sum + (restaurant.menu_items?.length || 0),
    0
  );
  const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
  const activeOrders = orders.filter(
    (order) => !["DELIVERED", "CANCELLED"].includes(order.status)
  ).length;
  const recentOrders = orders.slice(0, 4);
  const featuredRestaurants = restaurants.slice(0, 4);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff7ed,_#ffffff_35%,_#f8fafc)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[30px] bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-500 px-6 py-8 text-white shadow-xl sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.95fr] lg:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-50">
                <HiSparkles className="h-4 w-4" />
                Owner Dashboard
              </div>
              <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
                Run your restaurant operations from one focused workspace.
              </h1>
              <p className="mt-4 max-w-2xl text-sm text-orange-50/90 sm:text-base">
                Check order pressure, manage restaurants, and jump directly into
                categories or menus without switching between screens.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/owner/restaurants"
                  className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-orange-700 transition hover:translate-y-[-1px]"
                >
                  Manage Restaurants
                </Link>
                <Link
                  to="/orders/incoming"
                  className="rounded-xl border border-white/30 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Review Incoming Orders
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <div className="mb-3 inline-flex rounded-xl bg-white p-3 text-orange-700">
                  <MdStorefront className="h-5 w-5" />
                </div>
                <div className="text-sm text-orange-50/90">Restaurants</div>
                <div className="mt-1 text-3xl font-bold">{restaurants.length}</div>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <div className="mb-3 inline-flex rounded-xl bg-white p-3 text-orange-700">
                  <MdReceiptLong className="h-5 w-5" />
                </div>
                <div className="text-sm text-orange-50/90">Active Orders</div>
                <div className="mt-1 text-3xl font-bold">{activeOrders}</div>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <div className="mb-3 inline-flex rounded-xl bg-white p-3 text-orange-700">
                  <MdCategory className="h-5 w-5" />
                </div>
                <div className="text-sm text-orange-50/90">Categories</div>
                <div className="mt-1 text-3xl font-bold">{categoryCount}</div>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <div className="mb-3 inline-flex rounded-xl bg-white p-3 text-orange-700">
                  <HiClipboardList className="h-5 w-5" />
                </div>
                <div className="text-sm text-orange-50/90">Menu Items</div>
                <div className="mt-1 text-3xl font-bold">{menuCount}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Restaurant Overview</h2>
                <p className="text-sm text-gray-500">Your current managed locations.</p>
              </div>
              <Link
                to="/owner/restaurants"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white"
              >
                <HiPlus className="h-4 w-4" />
                Manage
              </Link>
            </div>

            {featuredRestaurants.length === 0 ? (
              <EmptyState
                icon="🍽️"
                title="No restaurants yet"
                description="Create your first restaurant to start managing menus and orders."
              />
            ) : (
              <div className="space-y-4">
                {featuredRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="rounded-2xl border border-gray-100 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-2xl bg-gray-100">
                        {restaurant.image_url ? (
                          <img
                            src={restaurant.image_url}
                            alt={restaurant.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl text-gray-300">
                            🍽️
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold text-gray-900">{restaurant.name}</div>
                        <div className="mt-1 text-sm text-gray-500">
                          {restaurant.location || restaurant.address}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <Link
                        to={`/owner/restaurants/${restaurant.id}/categories`}
                        className="rounded-xl bg-purple-50 px-4 py-2 text-center text-sm font-semibold text-purple-700"
                      >
                        Categories
                      </Link>
                      <Link
                        to={`/owner/restaurants/${restaurant.id}/menu`}
                        className="rounded-xl bg-emerald-50 px-4 py-2 text-center text-sm font-semibold text-emerald-700"
                      >
                        Menu
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Order Pulse</h2>
              <p className="mt-1 text-sm text-gray-500">How your incoming queue looks right now.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-orange-50 p-4">
                  <div className="text-sm font-medium text-orange-800">Pending</div>
                  <div className="mt-1 text-3xl font-bold text-orange-900">{pendingOrders}</div>
                </div>
                <div className="rounded-2xl bg-blue-50 p-4">
                  <div className="text-sm font-medium text-blue-800">Total Active</div>
                  <div className="mt-1 text-3xl font-bold text-blue-900">{activeOrders}</div>
                </div>
              </div>
              <Link
                to="/orders/incoming"
                className="mt-5 inline-flex rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Open Incoming Orders
              </Link>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Latest Orders</h2>
                  <p className="text-sm text-gray-500">Most recent activity across your restaurants.</p>
                </div>
                <Link to="/orders/incoming" className="text-sm font-semibold text-orange-600">
                  View queue
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <EmptyState
                  icon="📦"
                  title="No incoming orders"
                  description="New customer orders will show up here."
                />
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="rounded-2xl bg-gray-50 px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-gray-900">Order #{order.id}</div>
                          <div className="mt-1 text-sm text-gray-500">
                            Restaurant #{order.restaurant_id}
                          </div>
                        </div>
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
                          {order.status}
                        </span>
                      </div>
                      <div className="mt-3 text-sm text-gray-600">₹{order.total_amount}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OwnerDashboard;