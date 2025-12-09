import React from 'react'

export default function ProfileTitle({ profile }) {
    return (
        <div className="text-center mb-8 fade-in">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 mb-2">
                ✨ {profile.firstName} {profile.lastName}'s Cosmic Blueprint ✨
            </h1>
            <p className="text-white/60 text-lg">
                The mathematical blueprint of your life path and purpose
            </p>
        </div>
    )
}
