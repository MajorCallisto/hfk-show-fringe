module.exports = {
  theme: {
    extend: {
      animation: {
        'gradient-y': 'gradientY 20s ease infinite',
      },
      keyframes: {
        gradientY: {
          '0%, 100%': {
            backgroundImage: 'linear-gradient(to bottom, #f97316, #ec4899)', // orange to pink
          },
          '50%': {
            backgroundImage: 'linear-gradient(to bottom, #ec4899, #f97316)', // pink to orange
          },
        },
      },
    },
  },
};
