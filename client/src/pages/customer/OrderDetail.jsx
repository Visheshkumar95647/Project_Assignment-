import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

import OrderStatusTracker from "../../components/OrderStatusTracker/OrderStatusTracker";
import { getOrderByIdApi } from "../../api/orderApi";
import Loader from "../../components/Loader/Loader";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
    const interval = setInterval(loadOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const data = await getOrderByIdApi(orderId);
      setOrder(data);
    } catch (error) {
      toast.error(error.message || "Failed to load order");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!order) return null;

  const tax = Number(order.tax || 0);
  const deliveryFee = Number(order.delivery_fee || 0);
  const total = Number(order.total_amount || 0);
  const subtotal = total - tax - deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-orange-600 mb-8 hover:text-orange-700"
        >
          <FaArrowLeft />
          Back to Orders
        </button>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>

          <div className="mt-4">
            <OrderStatusTracker status={order.status} />
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            {order.status?.toLowerCase() === "pending" && (
              <p>📝 Your order has been placed successfully and is waiting for the restaurant to accept it.</p>
            )}
            {order.status?.toLowerCase() === "preparing" && (
              <p>👨‍🍳 Your order has been accepted and is now being prepared.</p>
            )}
            {order.status?.toLowerCase() === "ready" && (
              <p>🍽️ Your order is ready for pickup.</p>
            )}
            {order.status?.toLowerCase() === "completed" && (
              <p>🎉 Your order has been completed. Enjoy your meal!</p>
            )}
            {order.status?.toLowerCase() === "cancelled" && (
              <p>❌ This order has been cancelled.</p>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>

            <div className="divide-y">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-4">
                  <div>
                    <p className="font-semibold text-lg">{item.menu_item_name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-orange-600 text-lg">
                      ₹{item.subtotal}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t pt-6 space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{tax}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>

            <div className="flex justify-between text-xl font-bold border-t pt-4">
              <span>Total</span>
              <span className="text-orange-600">₹{total}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/restaurants")}
            className="w-full mt-8 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition"
          >
            Order More
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
