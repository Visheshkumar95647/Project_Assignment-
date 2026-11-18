// NOTE:
// This file is a complete starter for the redesigned Orders page.
// It keeps the same APIs and routes while adding:
// - Active Orders tab
// - Order History tab
// - History filters
// - Modern cards
//
// Replace your existing Orders.jsx with this file and adjust styling if needed.

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaClipboardList,
  FaHistory,
  FaEye,
} from "react-icons/fa";
import toast from "react-hot-toast";

import {
  getOrdersApi,
  getOrderHistoryApi,
} from "../../api/orderApi";

import Loader from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-700",
  Preparing: "bg-purple-100 text-purple-700",
  Ready: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function Orders() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activeOrders, setActiveOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  const [selectedTab, setSelectedTab] = useState("active");
  const [historyFilter, setHistoryFilter] = useState("All");

  const loadOrders = async () => {
    try {
      const [active, history] = await Promise.all([
        getOrdersApi(),
        getOrderHistoryApi(),
      ]);

      setActiveOrders(active || []);
      setHistoryOrders(history || []);
    } catch (e) {
      toast.error(e.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredHistory = useMemo(() => {
    if (historyFilter === "All") return historyOrders;
    return historyOrders.filter((o) => o.status === historyFilter);
  }, [historyOrders, historyFilter]);

  const list = selectedTab === "active" ? activeOrders : filteredHistory;

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-orange-600 font-medium"
        >
          <FaArrowLeft />
          Home
        </button>

        <div className="mt-6 mb-8">
          <h1 className="text-4xl font-bold">My Orders</h1>
          <p className="text-gray-500 mt-2">
            Manage your active and previous orders
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-2 flex mb-8">

          <button
            onClick={() => setSelectedTab("active")}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold ${
              selectedTab === "active"
                ? "bg-orange-600 text-white"
                : "text-gray-700"
            }`}
          >
            <FaClipboardList />
            Active Orders ({activeOrders.length})
          </button>

          <button
            onClick={() => setSelectedTab("history")}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold ${
              selectedTab === "history"
                ? "bg-orange-600 text-white"
                : "text-gray-700"
            }`}
          >
            <FaHistory />
            Order History ({historyOrders.length})
          </button>

        </div>

        {selectedTab === "history" && (
          <div className="flex gap-3 mb-6">
            {["All","Completed","Cancelled"].map(s=>(
              <button
                key={s}
                onClick={()=>setHistoryFilter(s)}
                className={`px-5 py-2 rounded-full ${
                  historyFilter===s
                  ? "bg-orange-600 text-white"
                  : "bg-white border"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {list.length===0 ? (
          <EmptyState
            title={selectedTab==="active"?"No Active Orders":"No Order History"}
            description="Nothing to display."
            buttonText="Browse Restaurants"
            onButtonClick={()=>navigate("/restaurants")}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {list.map(order=>(
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow hover:shadow-xl border overflow-hidden"
              >
                <div className="bg-orange-50 p-5 flex justify-between">
                  <div>
                    <h2 className="font-bold text-xl">Order #{order.id}</h2>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <span className={`px-4 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                <div className="p-5">

                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-gray-500 text-sm">Items</p>
                      <p className="font-bold">{order.items?.length || 0}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-gray-500 text-sm">Total</p>
                      <p className="text-2xl font-bold text-orange-600">
                        ₹{Number(order.total_amount).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    {order.items?.slice(0,3).map(item=>(
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>{item.menu_item_name}</span>
                        <span>x {item.quantity}</span>
                      </div>
                    ))}

                    {order.items?.length>3 && (
                      <p className="text-xs text-gray-500">
                        + {order.items.length-3} more items
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">

                    <button
                      onClick={()=>navigate(`/orders/${order.id}`)}
                      className="bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      <FaEye />
                      View Details
                    </button>

                    {selectedTab==="history" && order.status==="Completed" && (
                      <button
                        onClick={()=>navigate("/restaurants")}
                        className="border-2 border-orange-600 text-orange-600 py-3 rounded-xl font-semibold"
                      >
                        Order Again
                      </button>
                    )}

                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
