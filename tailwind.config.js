/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
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