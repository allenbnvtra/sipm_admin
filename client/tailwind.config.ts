/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '500px',
      sm: '600px',
      md: '960px',
      lg: '1180px',
      xl: '1280px',
      xxl: '1400px',
      xxxl: '1800px',
    },
    extend: {
      fontSize: {
        xs: ['12px', '15px'],
        sm: ['13px', '21px'],
        md: ['13.7px', '17px'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          '.scrollbar-hide': {
            'scrollbar-width': 'none' /* Firefox */,
            '-ms-overflow-style': 'none' /* IE and Edge */,
            '&::-webkit-scrollbar': {
              display: 'none' /* Chrome, Safari, and Edge */,
            },
          },
        },
        ['responsive', 'hover']
      );
    },
  ],
};
