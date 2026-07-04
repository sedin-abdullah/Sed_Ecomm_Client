import type { Config } from 'tailwindcss';

/**
 * Sed_Ecomm design system — premium corporate DTC aesthetic.
 *
 * All brand colors are driven by CSS variables (see src/styles/index.css)
 * holding raw HSL channels (e.g. "222 47% 31%"), consumed here through the
 * `hsl(var(--token) / <alpha-value>)` pattern so Tailwind's opacity utilities
 * (e.g. `bg-brand-500/40`) keep working, and so light/dark themes can swap
 * the underlying values without touching a single class name.
 */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
      },
    },
    extend: {
      colors: {
        brand: {
          50: 'hsl(var(--brand-50) / <alpha-value>)',
          100: 'hsl(var(--brand-100) / <alpha-value>)',
          200: 'hsl(var(--brand-200) / <alpha-value>)',
          300: 'hsl(var(--brand-300) / <alpha-value>)',
          400: 'hsl(var(--brand-400) / <alpha-value>)',
          500: 'hsl(var(--brand-500) / <alpha-value>)',
          600: 'hsl(var(--brand-600) / <alpha-value>)',
          700: 'hsl(var(--brand-700) / <alpha-value>)',
          800: 'hsl(var(--brand-800) / <alpha-value>)',
          900: 'hsl(var(--brand-900) / <alpha-value>)',
          950: 'hsl(var(--brand-950) / <alpha-value>)',
        },
        accent: {
          50: 'hsl(var(--accent-50) / <alpha-value>)',
          100: 'hsl(var(--accent-100) / <alpha-value>)',
          200: 'hsl(var(--accent-200) / <alpha-value>)',
          300: 'hsl(var(--accent-300) / <alpha-value>)',
          400: 'hsl(var(--accent-400) / <alpha-value>)',
          500: 'hsl(var(--accent-500) / <alpha-value>)',
          600: 'hsl(var(--accent-600) / <alpha-value>)',
          700: 'hsl(var(--accent-700) / <alpha-value>)',
          800: 'hsl(var(--accent-800) / <alpha-value>)',
          900: 'hsl(var(--accent-900) / <alpha-value>)',
          950: 'hsl(var(--accent-950) / <alpha-value>)',
        },
        gold: {
          300: 'hsl(var(--gold-300) / <alpha-value>)',
          400: 'hsl(var(--gold-400) / <alpha-value>)',
          500: 'hsl(var(--gold-500) / <alpha-value>)',
          600: 'hsl(var(--gold-600) / <alpha-value>)',
        },
        success: 'hsl(var(--success) / <alpha-value>)',
        warning: 'hsl(var(--warning) / <alpha-value>)',
        danger: 'hsl(var(--danger) / <alpha-value>)',
        info: 'hsl(var(--info) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        'surface-2': 'hsl(var(--surface-2) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        'muted-foreground': 'hsl(var(--muted-foreground) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
      },
      fontFamily: {
        sans: [
          '"Inter var"',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        display: [
          '"Plus Jakarta Sans"',
          '"Inter var"',
          'Inter',
          '-apple-system',
          'sans-serif',
        ],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.1rem' }],
        sm: ['0.875rem', { lineHeight: '1.35rem' }],
        base: ['1rem', { lineHeight: '1.6rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.85rem' }],
        '2xl': ['1.5rem', { lineHeight: '2.1rem', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '2.4rem', letterSpacing: '-0.015em' }],
        '4xl': ['2.375rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '3.4rem', letterSpacing: '-0.025em' }],
        '6xl': ['3.75rem', { lineHeight: '4.1rem', letterSpacing: '-0.03em' }],
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.625rem',
        lg: '0.875rem',
        xl: '1.125rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        soft: '0 1px 2px 0 hsl(var(--shadow-color) / 0.04), 0 1px 3px 0 hsl(var(--shadow-color) / 0.06)',
        elevated:
          '0 4px 10px -2px hsl(var(--shadow-color) / 0.08), 0 12px 24px -8px hsl(var(--shadow-color) / 0.10)',
        premium:
          '0 8px 24px -4px hsl(var(--shadow-color) / 0.12), 0 24px 48px -12px hsl(var(--shadow-color) / 0.16)',
        glow: '0 0 0 1px hsl(243 75% 60% / 0.22), 0 10px 30px -6px hsl(243 75% 60% / 0.45)',
        'inner-soft': 'inset 0 1px 2px 0 hsl(var(--shadow-color) / 0.06)',
      },
      backgroundImage: {
        /* Premium indigo → purple (brand) and cyan → blue (accent). */
        'brand-gradient': 'linear-gradient(135deg, hsl(243 75% 58%) 0%, hsl(258 88% 64%) 100%)',
        'accent-gradient': 'linear-gradient(135deg, hsl(187 85% 53%) 0%, hsl(217 91% 60%) 100%)',
        'hero-radial':
          'radial-gradient(120% 120% at 50% -10%, hsl(243 75% 45% / 0.40) 0%, transparent 60%)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-out': { from: { opacity: '1' }, to: { opacity: '0' } },
        'slide-up-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down-in': {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.45' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'fade-out': 'fade-out 0.2s ease-in',
        'slide-up-in': 'slide-up-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down-in': 'slide-down-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 1.6s infinite linear',
        ripple: 'ripple 0.6s linear',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
