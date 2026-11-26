/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#087A3E',
          hover: '#056332',
          light: '#E7F5EC',
          border: '#A3D9B8',
          foreground: '#FFFFFF',
        },
        volt: {
          DEFAULT: '#D4F638',
          hover: '#C0E224',
          light: '#F5FDD6',
          dark: '#1C2707',
          border: '#BFE71F',
          foreground: '#090A0F',
        },
        darksidebar: {
          bg: '#0A0D14',
          surface: '#111724',
          border: '#1B2335',
          hover: '#161E2E',
          text: '#94A3B8',
          textHover: '#F8FAFC',
          activeBg: '#182613',
          activeBorder: '#D4F638',
          activeText: '#D4F638',
        },
        background: 'var(--background)',
        surface: {
          DEFAULT: 'var(--surface)',
          hover: 'var(--surface-hover)',
          subtle: 'var(--surface-subtle)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        status: {
          success: '#16A34A',
          'success-bg': '#DCFCE7',
          warning: '#D97706',
          'warning-bg': '#FEF3C7',
          danger: '#DC2626',
          'danger-bg': '#FEE2E2',
          info: '#2563EB',
          'info-bg': '#DBEAFE',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '8px',
      },
      spacing: {
        '4.5': '1.125rem',
        'sidebar': '240px',
        'header': '64px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        volt: '0 0 15px -3px rgba(212, 246, 56, 0.3)',
      },
    },
  },
  plugins: [],
}
