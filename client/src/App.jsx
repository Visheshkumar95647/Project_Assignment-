import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Home from "./pages/customer/Home";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Restaurants from "./pages/customer/Restaurants";
import RestaurantDetail from "./pages/customer/RestaurantDetail";
import RestaurantCategories from "./pages/customer/RestaurantCategories";
import CategoryDetail from "./pages/customer/CategoryDetail";
import RestaurantMenu from "./pages/customer/RestaurantMenu";
import CategoryMenu from "./pages/customer/CategoryMenu";
import MenuItemDetail from "./pages/customer/MenuItemDetail";
import Cart from "./pages/customer/Cart";
import Orders from "./pages/customer/Orders";
import OrderDetail from "./pages/customer/OrderDetail";
import Favorites from "./pages/customer/Favorites";
import Preferences from "./pages/customer/Preferences";
import Recommendations from "./pages/Recommendations";

import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerRestaurants from "./pages/owner/OwnerRestaurants";
import OwnerCategories from "./pages/owner/OwnerCategories";
import OwnerMenu from "./pages/owner/OwnerMenu";
import OwnerCategoryMenu from "./pages/owner/OwnerCategoryMenu";
import IncomingOrders from "./pages/owner/IncomingOrders";

import Profile from "./pages/Profile";

const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const defaultRoute = !isAuthenticated
    ? "/login"
    : user?.role === "owner"
      ? "/owner/dashboard"
      : "/dashboard";

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{ duration: 3000 }}
      />

      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Navigate to={defaultRoute} replace />}
        />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* Customer */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["customer"]} />
          }
        >
          <Route path="/dashboard" element={<CustomerDashboard />} />
          
          <Route
            path="/restaurants"
            element={<Restaurants />}
          />

          <Route
            path="/restaurants/:id"
            element={<RestaurantDetail />}
          />

          <Route
            path="/restaurants/:id/categories"
            element={<RestaurantCategories />}
          />

          <Route
            path="/restaurants/:id/categories/:categoryId"
            element={<CategoryDetail />}
          />

          <Route
            path="/restaurants/:id/categories/:categoryId/menu"
            element={<CategoryMenu />}
          />

          <Route
            path="/restaurants/:id/menu"
            element={<RestaurantMenu />}
          />

          <Route
            path="/menu/:itemId"
            element={<MenuItemDetail />}
          />

          <Route path="/cart" element={<Cart />} />

          <Route path="/orders" element={<Orders />} />

          <Route
            path="/orders/:orderId"
            element={<OrderDetail />}
          />

          <Route
            path="/favorites"
            element={<Favorites />}
          />

          <Route
            path="/preferences"
            element={<Preferences />}
          />

          <Route
            path="/recommendations"
            element={<Recommendations />}
          />
        </Route>

        {/* Owner */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["owner"]} />
          }
        >
          <Route
            path="/owner/dashboard"
            element={<OwnerDashboard />}
          />

          <Route
            path="/owner/restaurants"
            element={<OwnerRestaurants />}
          />

          <Route
            path="/owner/restaurants/:id/categories"
            element={<OwnerCategories />}
          />

          <Route
            path="/owner/restaurants/:id/menu"
            element={<OwnerMenu />}
          />

          <Route
            path="/owner/restaurants/:id/categories/:categoryId/menu"
            element={<OwnerCategoryMenu />}
          />

          <Route
            path="/orders/incoming"
            element={<IncomingOrders />}
          />
        </Route>

        {/* Shared */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["customer", "owner"]}
            />
          }
        >
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Unknown Route */}
        <Route
          path="*"
          element={
            <Navigate
              to={defaultRoute}
              replace
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;