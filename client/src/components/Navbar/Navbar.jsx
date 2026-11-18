import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { HiMenu, HiX, HiShoppingCart, HiUser } from 'react-icons/hi'
import { logout } from '../../redux/auth/authSlice'
import { clearCart } from '../../redux/cart/cartSlice'
import toast from 'react-hot-toast'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const cartItems = useSelector((state) => state.cart.items)
  const [menuOpen, setMenuOpen] = useState(false)

  const homePath = user?.role === 'owner' ? '/owner/dashboard' : '/dashboard'

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    toast.success('Logged out')
    navigate('/login')
    setMenuOpen(false)
  }

  const customerLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/restaurants', label: 'Restaurants' },
    { to: '/recommendations', label: 'Recommendations' },
    { to: '/favorites', label: 'Favorites' },
    { to: '/orders', label: 'Orders' },
    { to: '/preferences', label: 'Preferences' },
  ]

  const ownerLinks = [
    { to: '/owner/dashboard', label: 'Dashboard' },
    { to: '/owner/restaurants', label: 'My Restaurants' },
    { to: '/orders/incoming', label: 'Incoming Orders' },
  ]

  const links = isAuthenticated
    ? user?.role === 'owner'
      ? ownerLinks
      : customerLinks
    : []

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? homePath : '/login'} className="text-xl font-bold text-primary-600">
            FoodOrder
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-gray-600 hover:text-primary-600 font-medium transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'customer' && (
                  <Link to="/cart" className="relative text-gray-600 hover:text-primary-600">
                    <HiShoppingCart className="w-6 h-6" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}
                <Link to="/profile" className="text-gray-600 hover:text-primary-600">
                  <HiUser className="w-6 h-6" />
                </Link>
                <span className="text-sm text-gray-500">
                  {user?.name}
                  <span className="ml-1 text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded capitalize">
                    {user?.role}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-primary-600 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-gray-700 hover:text-primary-600 font-medium"
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              {user?.role === 'customer' && (
                <Link
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <HiShoppingCart className="w-5 h-5" />
                  Cart {totalItems > 0 && `(${totalItems})`}
                </Link>
              )}
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-700">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm text-red-600 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-sm text-gray-700 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block text-sm text-primary-600 font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
