import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin'
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    keyframes: {
      blink: {
        '0%': { opacity: '0' },
        '50%': { opacity: '1' },
        '100%': { opacity: '0' },
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      const newUtilities = {
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#4B5563 #F3F4F6',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#F3F4F6',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#4B5563',
            borderRadius: '20px',
            border: '3px solid #F3F4F6',
          },
        },
        '.scrollbar-hide': {
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-default': {
          scrollbarWidth: 'auto',
          scrollbarColor: '#9CA3AF #E5E7EB',
          '&::-webkit-scrollbar': {
            width: '16px',
            height: '16px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#E5E7EB',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#9CA3AF',
            borderRadius: '20px',
            border: '4px solid #E5E7EB',
          },
        },
        '.scrollbar-custom': {
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--scrollbar-thumb, #4B5563) var(--scrollbar-track, #F3F4F6)',
          '&::-webkit-scrollbar': {
            width: 'var(--scrollbar-width, 8px)',
            height: 'var(--scrollbar-height, 8px)',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'var(--scrollbar-track, #F3F4F6)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'var(--scrollbar-thumb, #4B5563)',
            borderRadius: 'var(--scrollbar-radius, 20px)',
            border: 'var(--scrollbar-border, 3px solid #F3F4F6)',
          },
        },
      }

      addUtilities(newUtilities)
    }),
  ],
};
export default config;
