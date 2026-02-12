// =============================================================================
// GOOGLE MAPS API CONFIGURATION
// =============================================================================
// Used for: Places Autocomplete, Hospital Search, Address Lookup
//
// Set VITE_GOOGLE_MAPS_API_KEY in .env.local
//
// API RESTRICTIONS (Applied in Google Console):
//   HTTP Referrers: localhost:5173/*, localhost:5174/*,
//                   astroprofile-391e6.web.app/*
//   API Restrictions: Places API, Places API (New)
// =============================================================================

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
