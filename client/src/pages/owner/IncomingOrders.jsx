import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

import { getMyRestaurantsApi } from "../../api/restaurantApi";
import {
  getIncomingOrdersApi,
  updateOrderStatusApi,
} from "../../api/orderApi";

import Loader from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";

const IncomingOrders = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      loadOrders();
    }
  }, [selectedRestaurant]);

  const loadRestaurants = async () => {
    try {
      const data = await getMyRestaurantsApi();

      setRestaurants(data || []);

      if (data?.length > 0) {
        setSelectedRestaurant(data[0].id);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const data = await getIncomingOrdersApi(selectedRestaurant);
      setOrders(data || []);
    } catch (error) {
      const msg = (error.message || "").toLowerCase();

      if (msg.includes("not found") || msg.includes("no order")) {
        setOrders([]);
        return;
      }

      toast.error(error.message || "Failed to load orders");
    }
  };

  const getActions = (status) => {
    switch (status) {
      case "Pending":
        return [
          {
            label: "Preparing",
            value: "Preparing",
            color: "bg-blue-600 hover:bg-blue-700",
          },
          {
            label: "Cancel",
            value: "Cancelled",
            color: "bg-red-600 hover:bg-red-700",
          },
        ];

      case "Preparing":
        return [
          {
            label: "Ready",
            value: "Ready",
            color: "bg-green-600 hover:bg-green-700",
          },
          {
            label: "Cancel",
            value: "Cancelled",
            color: "bg-red-600 hover:bg-red-700",
          },
        ];

      case "Ready":
        return [
          {
            label: "Complete",
            value: "Completed",
            color: "bg-purple-600 hover:bg-purple-700",
          },
        ];

      default:
        return [];
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await updateOrderStatusApi(orderId, status);

      toast.success(`Order ${status}`);

      loadOrders();
    } catch (error) {
      toast.error(error.message || "Failed to update order");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (restaurants.length === 0) {
    return (
      <EmptyState
        title="No Restaurants Found"
        description="Create a restaurant first."
      />
    );
  }
  return (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <button
      onClick={() => window.history.back()}
      className="flex items-center gap-2 text-orange-600 mb-6"
    >
      <FaArrowLeft />
      Back
    </button>

    <h1 className="text-3xl font-bold mb-8">
      Incoming Orders
    </h1>

    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <label className="block font-medium mb-4">
        Select Restaurant
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((restaurant) => (
          <button
            key={restaurant.id}
            onClick={() => setSelectedRestaurant(restaurant.id)}
            className={`p-4 rounded-lg border text-left ${
              selectedRestaurant === restaurant.id
                ? "border-orange-600 bg-orange-50"
                : "border-gray-200 hover:border-orange-300"
            }`}
          >
            <p className="font-semibold">
              {restaurant.name}
            </p>
          </button>
        ))}
      </div>
    </div>

    {orders.length === 0 ? (
      <EmptyState
        title="No Orders"
        description="No incoming orders."
      />
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {orders.map((order) => {
          const actions = getActions(order.status);

          return (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow p-6"
            >

              {/* Header */}

              <div className="flex justify-between items-center mb-4">

                <div>
                  <h2 className="text-lg font-semibold">
                    Order #{order.id}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold
                  ${
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "Preparing"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "Ready"
                      ? "bg-purple-100 text-purple-700"
                      : order.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </span>

              </div>

              {/* Customer */}

              <div className="bg-gray-50 rounded-lg p-3 mb-4">

                <p className="font-semibold">
                  {order.customer_name}
                </p>

                <p className="text-sm text-gray-500">
                  {order.customer_email}
                </p>

                {order.customer_phone && (
                  <p className="text-sm text-gray-500">
                    {order.customer_phone}
                  </p>
                )}

              </div>

              {/* Items */}

              <div className="mb-4">

                <h3 className="font-semibold mb-2">
                  Items
                </h3>

                <div className="space-y-2">

                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.menu_item_name} × {item.quantity}
                      </span>

                      <span>
                        ₹{item.subtotal}
                      </span>
                    </div>
                  ))}

                </div>

              </div>

                            {/* Total */}

              <div className="border-t pt-4">

                <div className="flex justify-between mb-4">

                  <span className="font-semibold">
                    Total
                  </span>

                  <span className="font-bold text-lg text-orange-600">
                    ₹{order.total_amount}
                  </span>

                </div>

                {/* Action Buttons */}

                {actions.length > 0 ? (

                  <div className="grid grid-cols-2 gap-3">

                    {actions.map((action) => (

                      <button
                        key={action.value}
                        onClick={() =>
                          handleUpdateStatus(order.id, action.value)
                        }
                        className={`${action.color} text-white py-2 rounded-lg font-semibold transition`}
                      >
                        {action.label}
                      </button>

                    ))}

                  </div>

                ) : (

                  <div
                    className={`text-center py-3 rounded-lg font-semibold ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status === "Completed"
                      ? "✅ Order Completed"
                      : "❌ Order Cancelled"}
                  </div>

                )}

              </div>

            </div>
          );
        })}

      </div>

    )}

  </div>
);

};

export default IncomingOrders;