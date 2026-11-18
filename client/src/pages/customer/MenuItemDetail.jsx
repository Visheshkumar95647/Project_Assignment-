import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { HiArrowLeft, HiShoppingCart } from "react-icons/hi";
import { MdLocalOffer, MdStar } from "react-icons/md";
import toast from "react-hot-toast";

import { getMenuItemByIdApi } from "../../api/menuApi";
import {
  addToCartApi,
  getCartApi,
} from "../../api/cartApi";
import { setCart } from "../../redux/cart/cartSlice";
import Loader from "../../components/Loader/Loader";

const MenuItemDetail = () => {
  const { itemId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    token,
    isAuthenticated,
    user,
  } = useSelector((state) => state.auth);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenuItem();
  }, [itemId]);

  const loadMenuItem = async () => {
    try {
      const data = await getMenuItemByIdApi(itemId);
      setItem(data);
    } catch (error) {
      toast.error(error.message || "Failed to load menu item");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated || user?.role !== "customer") {
      toast.error("Please login as a customer");
      return;
    }

    try {
      await addToCartApi(
        {
          menu_item_id: item.id,
          quantity: 1,
        },
        token
      );

      const cart = await getCartApi(token);

      dispatch(
        setCart({
          items: cart.items || [],
          restaurantId: cart.restaurant_id || null,
        })
      );

      toast.success("Added to cart");
    } catch (error) {
      toast.error(error.message || "Failed to add item");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-orange-600"
      >
        <HiArrowLeft />
        Back
      </button>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="h-72 bg-gray-100">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-6xl">
              🍴
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold">
              {item.name}
            </h1>

            <span className="text-2xl font-bold text-orange-600">
              ₹{item.price}
            </span>
          </div>

          <p className="mt-4 text-gray-500">
            {item.description}
          </p>

          <div className="mt-5 flex gap-2">
            {item.is_special && (
              <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm">
                <MdStar />
                Special
              </span>
            )}

            {item.is_deal_of_day && (
              <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm">
                <MdLocalOffer />
                Deal
              </span>
            )}
          </div>

          <div className="mt-5">
            <span
              className={`rounded-full px-3 py-1 text-sm ${
                item.is_available
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {item.is_available
                ? "Available"
                : "Unavailable"}
            </span>
          </div>

          {item.is_available && (
            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 py-3 text-white transition hover:bg-orange-700"
            >
              <HiShoppingCart />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetail;