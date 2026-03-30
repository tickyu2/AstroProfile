/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                element: {
                    wood: {
                        light: '#8bd17c',
                        DEFAULT: '#4caf50',
                        dark: '#2e7d32',
                    },
                    fire: {
                        light: '#ff8a65',
                        DEFAULT: '#ff5722',
                        dark: '#d84315',
                    },
                    earth: {
                        light: '#d7b894',
                        DEFAULT: '#a9825a',
                        dark: '#6f4f28',
                    },
                    metal: {
                        light: '#cfd8dc',
                        DEFAULT: '#90a4ae',
                        dark: '#546e7a',
                    },
                    water: {
                        light: '#4fc3f7',
                        DEFAULT: '#0288d1',
                        dark: '#01579b',
                    },
                },
            },
            keyframes: {
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(5px) scale(0.95)' },
                    '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
                }
            },
            animation: {
                slideDown: 'slideDown 0.3s ease-out',
                fadeIn: 'fadeIn 0.15s ease-out'
            }
        },
    },
    plugins: [],
}