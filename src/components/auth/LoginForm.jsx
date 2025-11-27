import React from 'react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from './AuthLayout'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      // Provide user-friendly error messages
      if (err.message.includes('invalid-credential')) {
        setError('Invalid email or password')
      } else if (err.message.includes('user-not-found')) {
        setError('No account found with this email')
      } else if (err.message.includes('wrong-password')) {
        setError('Incorrect password')
      } else if (err.message.includes('too-many-requests')) {
        setError('Too many failed attempts. Please try again later')
      } else {
        setError('Failed to log in: ' + err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to access your cosmic profiles"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white text-sm font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <Link
          to="/reset-password"
          className="block text-purple-200 text-sm hover:text-white transition-colors"
        >
          Forgot Password?
        </Link>
        <div className="text-purple-200 text-sm">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-white font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
