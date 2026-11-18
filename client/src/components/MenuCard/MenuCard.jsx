import { useDispatch, useSelector } from "react-redux";
import { HiShoppingCart } from "react-icons/hi";
import { MdLocalOffer, MdStar } from "react-icons/md";
import toast from "react-hot-toast";

import { addToCartApi, getCartApi } from "../../api/cartApi";
import { setCart } from "../../redux/cart/cartSlice";

const MenuCard = ({ item }) => {
    const dispatch = useDispatch();

    const { token, isAuthenticated, user } = useSelector(
        (state) => state.auth
    );

    const handleAddToCart = async () => {
        if (!isAuthenticated || user?.role !== "customer") {
            toast.error("Please log in as a customer.");
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

            toast.success(`${item.name} added to cart`);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div
            className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col ${!item.is_available ? "opacity-60" : ""
                }`}
        >
            <div className="relative h-40 bg-gray-100 overflow-hidden">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">
                        🍴
                    </div>
                )}

                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.is_special && (
                        <span className="flex items-center gap-1 bg-yellow-400 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                            <MdStar className="w-3 h-3" />
                            Special
                        </span>
                    )}

                    {item.is_deal_of_day && (
                        <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                            <MdLocalOffer className="w-3 h-3" />
                            Deal
                        </span>
                    )}
                </div>

                {!item.is_available && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                            Unavailable
                        </span>
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                    {item.name}
                </h3>

                <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-1">
                    {item.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-base font-bold text-primary-600">
                        ₹{Number(item.price).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>

                    {item.is_available && (
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
                        >
                            <HiShoppingCart className="w-4 h-4" />
                            Add
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuCard;