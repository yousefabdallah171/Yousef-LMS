/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--color-surface)',
        'surface-low': 'var(--color-surface-low)',
        'surface-high': 'var(--color-surface-high)',
        'surface-highest': 'var(--color-surface-highest)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        foreground: 'var(--color-foreground)',
        muted: 'var(--color-muted)',
        ghost: 'var(--color-ghost-border)'
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        lg: '12px'
      },
      boxShadow: {
        ambient: '0 24px 64px rgba(6, 12, 24, 0.32)',
        glow: '0 0 0 1px rgba(125, 92, 255, 0.16), 0 20px 60px rgba(109, 40, 217, 0.18)'
      },
      backdropBlur: {
        glass: '12px'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
