/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      colors: {
        blue:        '#1D4ED8',
        'blue-dark': '#1E3A8A',
        'blue-mid':  '#2563EB',
        'blue-light':'#3B82F6',
        'blue-pale': '#EFF6FF',
        'blue-border':'#BFDBFE',
        muted:       '#64748B',
        'muted-2':   '#94A3B8',
        border:      '#E2E8F0',
        surface:     '#FFFFFF',
        'surface-2': '#F8FAFC',
        'surface-3': '#F1F5F9',
        accent:      '#DC2626',
        green:       '#059669',
        gold:        '#B45309',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [{
      marvick: {
        'primary':         '#1D4ED8',
        'primary-content': '#ffffff',
        'secondary':       '#2563EB',
        'secondary-content':'#ffffff',
        'accent':          '#DC2626',
        'neutral':         '#1E293B',
        'base-100':        '#FFFFFF',
        'base-200':        '#F8FAFC',
        'base-300':        '#F1F5F9',
        'base-content':    '#0F172A',
        'info':            '#3B82F6',
        'success':         '#059669',
        'warning':         '#D97706',
        'error':           '#DC2626',
      },
    }],
  },
};
