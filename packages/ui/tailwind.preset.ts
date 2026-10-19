import type { Config } from 'tailwindcss';
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        obsidian: '#090A0F',
        surface: '#12141D',
        ink: '#F8FAFC',
        electric: '#6366F1',
        success: '#10B981',
        danger: '#F43F5E',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: { float: 'float 6s ease-in-out infinite' },
    },
  },
  plugins: [],
} satisfies Config;
