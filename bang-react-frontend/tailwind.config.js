module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
        keyframes: {
            wiggle: {
                '0%, 100%': {
                    transform: 'rotate(-8deg)'
                },
                '50%': {
                    transform: 'rotate(8deg)'
                },
            }
        },
        animation: {
            wiggle: 'wiggle 1s ease-in-out infinite',
        }
    },
  },

  plugins: [
  ]
}
