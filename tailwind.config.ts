import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-geist-sans)", ...fontFamily.sans],
        heading: ["var(--font-inter)", "var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-roboto-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Professional fintech color scheme
        "navy-blue": {
          50: '#e6edf2',
          100: '#c2d1e0',
          200: '#9db5ce',
          300: '#7899bc',
          400: '#5c84af',
          500: '#1C4E80', // Primary color
          600: '#18426d',
          700: '#133557',
          800: '#0e2941',
          900: '#091c2b',
        },
        "light-blue": {
          50: '#f0f9fa',
          100: '#e1f3f5',
          200: '#c3e7eb',
          300: '#a5d8dd',
          400: '#87c9d0',
          500: '#A5D8DD', // Secondary color
          600: '#6fbfc6',
          700: '#55a1a9',
          800: '#3b838c',
          900: '#21656f',
        },
        "profit-green": {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#68d388',
          500: '#68d388', // Success/Growth color
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        "loss-red": {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#EA6A47', // Warning/Loss color
          600: '#dc2626',
          700: '#b91c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      // Enhanced gradient utilities with new color scheme
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1C4E80, #A5D8DD)',
        'gradient-secondary': 'linear-gradient(135deg, #A5D8DD, #1C4E80)',
        'gradient-profit': 'linear-gradient(135deg, #68d388, #1C4E80)',
        'gradient-loss': 'linear-gradient(135deg, #EA6A47, #1C4E80)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
