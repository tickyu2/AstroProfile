import { useState } from 'react'

export default function InputForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        sex: '',
        birthDate: '',
        birthTime: '',
        birthCity: '',
        birthCountry: '',
        mbti: ''
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
        if (!formData.sex) newErrors.sex = 'Please select sex'
        if (!formData.birthDate) newErrors.birthDate = 'Birth date is required'
        if (!formData.birthCity.trim()) newErrors.birthCity = 'Birth city is required'
        if (!formData.birthCountry.trim()) newErrors.birthCountry = 'Birth country is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            onSubmit(formData)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        ✨ Discover Your AstroProfile ✨
                    </h1>
                    <p className="text-purple-200">
                        Enter your birth information to reveal your cosmic blueprint
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white text-sm font-semibold mb-2">
                                First Name *
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                placeholder="Enter first name"
                            />
                            {errors.firstName && (
                                <p className="text-red-300 text-sm mt-1">{errors.firstName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-white text-sm font-semibold mb-2">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                placeholder="Enter last name"
                            />
                            {errors.lastName && (
                                <p className="text-red-300 text-sm mt-1">{errors.lastName}</p>
                            )}
                        </div>
                    </div>

                    {/* Sex Selection */}
                    <div>
                        <label className="block text-white text-sm font-semibold mb-2">
                            Sex *
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sex"
                                    value="male"
                                    checked={formData.sex === 'male'}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-purple-400"
                                />
                                <span className="text-white">Male</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sex"
                                    value="female"
                                    checked={formData.sex === 'female'}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-purple-400"
                                />
                                <span className="text-white">Female</span>
                            </label>
                        </div>
                        {errors.sex && (
                            <p className="text-red-300 text-sm mt-1">{errors.sex}</p>
                        )}
                    </div>

                    {/* Birth Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white text-sm font-semibold mb-2">
                                Birth Date *
                            </label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                            {errors.birthDate && (
                                <p className="text-red-300 text-sm mt-1">{errors.birthDate}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-white text-sm font-semibold mb-2">
                                Birth Time (Optional)
                            </label>
                            <input
                                type="time"
                                name="birthTime"
                                value={formData.birthTime}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                            <p className="text-purple-200 text-xs mt-1">
                                More accurate with exact time
                            </p>
                        </div>
                    </div>

                    {/* Birth Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white text-sm font-semibold mb-2">
                                Birth City *
                            </label>
                            <input
                                type="text"
                                name="birthCity"
                                value={formData.birthCity}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                placeholder="e.g., Rawalpindi"
                            />
                            {errors.birthCity && (
                                <p className="text-red-300 text-sm mt-1">{errors.birthCity}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-white text-sm font-semibold mb-2">
                                Birth Country *
                            </label>
                            <input
                                type="text"
                                name="birthCountry"
                                value={formData.birthCountry}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                placeholder="e.g., Pakistan"
                            />
                            {errors.birthCountry && (
                                <p className="text-red-300 text-sm mt-1">{errors.birthCountry}</p>
                            )}
                        </div>
                    </div>

                    {/* MBTI (Optional) */}
                    <div>
                        <label className="block text-white text-sm font-semibold mb-2">
                            MBTI Type (Optional)
                        </label>
                        <select
                            name="mbti"
                            value={formData.mbti}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="">Select if known</option>
                            <option value="INTJ">INTJ</option>
                            <option value="INTP">INTP</option>
                            <option value="ENTJ">ENTJ</option>
                            <option value="ENTP">ENTP</option>
                            <option value="INFJ">INFJ</option>
                            <option value="INFP">INFP</option>
                            <option value="ENFJ">ENFJ</option>
                            <option value="ENFP">ENFP</option>
                            <option value="ISTJ">ISTJ</option>
                            <option value="ISFJ">ISFJ</option>
                            <option value="ESTJ">ESTJ</option>
                            <option value="ESFJ">ESFJ</option>
                            <option value="ISTP">ISTP</option>
                            <option value="ISFP">ISFP</option>
                            <option value="ESTP">ESTP</option>
                            <option value="ESFP">ESFP</option>
                        </select>
                        <p className="text-purple-200 text-xs mt-1">
                            For more comprehensive analysis
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Reveal My Cosmic Blueprint ✨
                    </button>

                </form>

            </div>
        </div>
    )
}