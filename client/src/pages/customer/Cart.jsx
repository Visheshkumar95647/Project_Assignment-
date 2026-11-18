import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaMinus,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import toast from "react-hot-toast";

import {
  getCartApi,
  updateCartItemApi,
  deleteCartItemApi,
} from "../../api/cartApi";

import { createOrderApi } from "../../api/orderApi";

import {
  clearCart,
  setCart,
} from "../../redux/cart/cartSlice";

const TAX_RATE = 0.1;
const DELIVERY_FEE = 50;
const MIN_ORDER = 100;

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { token } = useSelector((state) => state.auth);

  const {
    items,
    restaurantId,
    restaurantName,
  } = useSelector((state) => state.cart);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const tax = Math.round(subtotal * TAX_RATE);

  const total = subtotal + tax + DELIVERY_FEE;

  const refreshCart = async () => {
    const cart = await getCartApi(token);

    dispatch(
      setCart({
        items: cart.items || [],
        restaurantId: cart.restaurant_id || null,
        restaurantName: cart.restaurant_name || "",
      })
    );
  };

  const increaseQuantity = async (item) => {
    try {
      const itemId = item.id || item.menu_item_id;

      await updateCartItemApi(
        itemId,
        {
          quantity: item.quantity + 1,
        },
        token
      );

      await refreshCart();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const decreaseQuantity = async (item) => {
    try {
      const itemId = item.id || item.menu_item_id;

      if (item.quantity === 1) {
        await deleteCartItemApi(
          itemId,
          token
        );

        toast.success("Item removed");
      } else {
        await updateCartItemApi(
          itemId,
          {
            quantity: item.quantity - 1,
          },
          token
        );
      }

      await refreshCart();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRemoveItem = async (menuItemId) => {
    try {
      await deleteCartItemApi(menuItemId, token);

      await refreshCart();

      toast.success("Item removed");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCheckout = async () => {
    if (subtotal < MIN_ORDER) {
      toast.error(
        `Minimum order amount is ₹${MIN_ORDER}`
      );
      return;
    }

    setIsCheckingOut(true);

    try {
      const order = {
        restaurant_id: restaurantId,
        items: items.map((item) => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
        })),
        total_amount: total,
        delivery_fee: DELIVERY_FEE,
        tax,
      };

      const data = await createOrderApi(
        order,
        token
      );

      dispatch(clearCart());

      toast.success("Order placed successfully!");

      navigate(`/orders/${data.id}`);
    } catch (error) {
      toast.error(
        error.message || "Failed to place order"
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <button
            type="button"
            onClick={() => navigate("/restaurants")}
            className="mb-8 flex items-center gap-2 text-orange-600"
          >
            <FaArrowLeft />
            Back to Restaurants
          </button>

          <div className="rounded-lg bg-white p-10 text-center shadow">
            <h1 className="mb-4 text-3xl font-bold">
              Your Cart is Empty
            </h1>

            <p className="mb-6 text-gray-500">
              Add some delicious food to your cart.
            </p>

            <button
              type="button"
              onClick={() => navigate("/restaurants")}
              className="rounded-lg bg-orange-600 px-6 py-3 text-white hover:bg-orange-700"
            >
              Browse Restaurants
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
  <div className="min-h-screen bg-gray-50">
    <div className="mx-auto max-w-6xl px-4 py-10">
      <button
        type="button"
        onClick={() => navigate("/restaurants")}
        className="mb-8 flex items-center gap-2 text-orange-600"
      >
        <FaArrowLeft />
        Back to Restaurants
      </button>

      <h1 className="mb-8 text-3xl font-bold text-gray-800">
        Your Cart
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* Cart Items */}
        <div className="lg:col-span-2">

          <div className="overflow-hidden rounded-lg bg-white shadow">

            {/* Restaurant */}
            <div className="border-b bg-orange-50 p-6">
              <p className="text-sm text-gray-500">
                Ordering From
              </p>

              <h2 className="text-2xl font-bold">
                {restaurantName}
              </h2>
            </div>

            {/* Items */}
            <div className="divide-y">

              {items.map((item) => (

                <div
                  key={item.id || item.menu_item_id}
                  className="flex gap-4 p-6"
                >

                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                  )}

                  <div className="flex-1">

                    <h3 className="text-lg font-semibold">
                      {item.name}
                    </h3>

                    <p className="mt-2 font-bold text-orange-600">
                      ₹{item.price}
                    </p>

                    <div className="mt-5 flex items-center gap-3">

                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item)}
                        disabled={isCheckingOut}
                        className="rounded bg-gray-200 p-2 hover:bg-gray-300 disabled:opacity-50"
                      >
                        <FaMinus />
                      </button>

                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item)}
                        disabled={isCheckingOut}
                        className="rounded bg-gray-200 p-2 hover:bg-gray-300 disabled:opacity-50"
                      >
                        <FaPlus />
                      </button>

                      <span className="ml-auto font-medium">
                        ₹{item.price * item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveItem(item.id || item.menu_item_id)
                        }
                        disabled={isCheckingOut}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* Order Summary */}
        <div>

          <div className="sticky top-24 rounded-lg bg-white p-6 shadow">

            <h2 className="mb-6 text-xl font-bold">
              Order Summary
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between">
                <span>
                  Subtotal ({items.length} items)
                </span>

                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (10%)</span>

                <span>₹{tax}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>

                <span>₹{DELIVERY_FEE}</span>
              </div>

              <hr />

              <div className="flex justify-between text-lg font-bold">

                <span>Total</span>

                <span className="text-orange-600">
                  ₹{total}
                </span>

              </div>

            </div>

            {subtotal < MIN_ORDER && (
              <div className="mt-6 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-700">
                Add ₹{MIN_ORDER - subtotal} more to place your order.
              </div>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut || subtotal < MIN_ORDER}
              className={`mt-6 w-full rounded-lg py-3 font-semibold transition ${
                isCheckingOut || subtotal < MIN_ORDER
                  ? "cursor-not-allowed bg-gray-300 text-gray-600"
                  : "bg-orange-600 text-white hover:bg-orange-700"
              }`}
            >
              {isCheckingOut
                ? "Placing Order..."
                : "Place Order"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/restaurants")}
              className="mt-3 w-full rounded-lg border py-3 font-semibold hover:bg-gray-50"
            >
              Continue Shopping
            </button>

          </div>

        </div>

      </div>

    </div>

  </div>
);
};

export default Cart;