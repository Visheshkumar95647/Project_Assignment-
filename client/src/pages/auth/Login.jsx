import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { loginApi } from "../../api/authApi";
import { getCartApi } from "../../api/cartApi";

import { login } from "../../redux/auth/authSlice";
import { setCart } from "../../redux/cart/cartSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    setLoading(true);

    try {
      const data = await loginApi(formData);

      dispatch(
        login({
          user: {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
          },
          token: data.access_token,
        })
      );

      // Load customer's cart from backend
      if (data.role === "customer") {
        try {
          const cart = await getCartApi(data.access_token);

          dispatch(
            setCart({
              items: cart.items || [],
              restaurantId: cart.restaurant_id || null,
            })
          );
        } catch (error) {
          console.error(error);
        }
      }

      toast.success("Login Successful");

      navigate(
        data.role === "owner"
          ? "/owner/dashboard"
          : "/dashboard"
      );
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold">
          Welcome Back
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          Sign in to continue
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div>
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter email"
              {...register("email", {
                required: "Email is required",
              })}
              className="mt-1 w-full rounded-lg border p-3"
            />

            {errors.email && (
              <p className="text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
              })}
              className="mt-1 w-full rounded-lg border p-3"
            />

            {errors.password && (
              <p className="text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-blue-600"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-5 text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;