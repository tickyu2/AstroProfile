import React from 'react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from './AuthLayout'

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signup, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match')
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters')
    }

    if (!formData.displayName.trim()) {
      return setError('Please enter your name')
    }

    try {
      setError('')
      setLoading(true)
      await signup(formData.email, formData.password, formData.displayName)
      navigate('/dashboard')
    } catch (err) {
      // Provide user-friendly error messages
      if (err.message.includes('email-already-in-use')) {
        setError('An account with this email already exists')
      } else if (err.message.includes('invalid-email')) {
        setError('Invalid email address')
      } else if (err.message.includes('weak-password')) {
        setError('Password is too weak. Use at least 6 characters')
      } else {
        setError('Failed to create account: ' + err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setError('')
      setGoogleLoading(true)
      const user = await signInWithGoogle()
      if (user) {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Failed to sign in with Google: ' + err.message)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join AstroProfile to explore cosmic connections"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white text-sm font-semibold mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Your Name"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="your@email.com"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="••••••••"
            disabled={loading}
          />
          <p className="text-xs text-purple-200 mt-1">
            At least 6 characters
          </p>
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-white/20"></div>
        <span className="px-4 text-white/50 text-sm">or</span>
        <div className="flex-1 border-t border-white/20"></div>
      </div>

      {/* Google Sign-In Button */}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading || googleLoading}
        className="w-full bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {googleLoading ? 'Signing up...' : 'Continue with Google'}
      </button>

      <div className="mt-6 text-center">
        <div className="text-purple-200 text-sm">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-white font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
