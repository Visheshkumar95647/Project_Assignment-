import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { resetPasswordApi } from '../../api/authApi'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await resetPasswordApi({
        reset_token: data.reset_token,
        new_password: data.new_password,
      })
      toast.success('Password reset successfully!')
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-gray-500 text-sm mb-6">Enter your reset token and new password.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reset Token</label>
            <input
              type="text"
              {...register('reset_token', { required: 'Reset token is required' })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-mono"
              placeholder="Paste your reset token"
            />
            {errors.reset_token && (
              <p className="mt-1 text-xs text-red-500">{errors.reset_token.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              {...register('new_password', {
                required: 'New password is required',
                minLength: { value: 6, message: 'Min 6 characters' },
              })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              placeholder="••••••••"
            />
            {errors.new_password && (
              <p className="mt-1 text-xs text-red-500">{errors.new_password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              {...register('confirm_password', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === watch('new_password') || 'Passwords do not match',
              })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              placeholder="••••••••"
            />
            {errors.confirm_password && (
              <p className="mt-1 text-xs text-red-500">{errors.confirm_password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ResetPassword
