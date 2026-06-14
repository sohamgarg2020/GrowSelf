/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        accent: '#FF4D00',
        'accent-dim': '#CC3D00',
        'surface': '#1A1A1A',
        'surface-2': '#242424',
        'border': '#2A2A2A',
        'text-primary': '#FFFFFF',
        'text-secondary': '#9CA3AF',
        'text-muted': '#6B7280',
        'bg-primary': '#0A0A0A',
        'bg-secondary': '#111111',
        'success': '#22C55E',
        'warning': '#F59E0B',
        'error': '#EF4444',
      },
    },
  },
  plugins: [],
};
