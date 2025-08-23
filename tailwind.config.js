/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // Mobile-specific breakpoints
        'mobile-s': '320px',
        'mobile-m': '375px',
        'mobile-l': '425px',
        'tablet': '768px',
        'laptop': '1024px',
        'laptop-l': '1440px',
        'desktop': '2560px',
        // Orientation breakpoints
        'portrait': {'raw': '(orientation: portrait)'},
        'landscape': {'raw': '(orientation: landscape)'},
        // Device-specific breakpoints
        'iphone-se': '375px',
        'iphone-12': '390px',
        'iphone-14': '393px',
        'iphone-15': '393px',
        'iphone-15-pro': '393px',
        'iphone-15-pro-max': '430px',
        'pixel-5': '393px',
        'pixel-6': '412px',
        'pixel-7': '412px',
        'galaxy-s8': '360px',
        'galaxy-s20': '360px',
        'galaxy-s21': '384px',
        'galaxy-s22': '384px',
        'galaxy-s23': '384px',
        'galaxy-s24': '384px',
        'ipad': '768px',
        'ipad-pro': '1024px',
        'ipad-air': '820px',
        'surface-pro': '912px',
        'surface-laptop': '1280px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    // Custom plugin for mobile-first utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.safe-area-top': {
          paddingTop: 'env(safe-area-inset-top, 0)',
        },
        '.safe-area-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom, 0)',
        },
        '.safe-area-left': {
          paddingLeft: 'env(safe-area-inset-left, 0)',
        },
        '.safe-area-right': {
          paddingRight: 'env(safe-area-inset-right, 0)',
        },
        '.container-mobile': {
          width: '100%',
          maxWidth: '100%',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          marginLeft: 'auto',
          marginRight: 'auto',
        },
        '.flex-mobile': {
          display: 'flex',
          flexDirection: 'column',
        },
        '.shadow-mobile': {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-mobile': {
          fontSize: '0.875rem',
          lineHeight: '1.5',
        },
        '.space-mobile': {
          marginTop: '1rem',
          marginBottom: '1rem',
        },
        '.nav-mobile': {
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          backgroundColor: 'white',
          borderTop: '1px solid #e5e7eb',
          zIndex: '50',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
        },
        '.sidebar-mobile': {
          position: 'fixed',
          top: '0',
          left: '-100%',
          width: '100%',
          height: '100vh',
          backgroundColor: 'white',
          zIndex: '100',
          transition: 'left 0.3s ease',
          overflowY: 'auto',
        },
        '.overlay-mobile': {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: '99',
          opacity: '0',
          visibility: 'hidden',
          transition: 'all 0.3s ease',
        },
      }
      
      // Add responsive variants for larger screens
      Object.keys(theme('screens')).forEach(screen => {
        if (screen !== 'xs' && screen !== 'mobile-s') {
          newUtilities[`.${screen}\\:container-mobile`] = {
            maxWidth: '1200px',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          }
          newUtilities[`.${screen}\\:flex-mobile`] = {
            flexDirection: 'row',
          }
          newUtilities[`.${screen}\\:shadow-mobile`] = {
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }
          newUtilities[`.${screen}\\:text-mobile`] = {
            fontSize: '1rem',
          }
          newUtilities[`.${screen}\\:space-mobile`] = {
            marginTop: '1.5rem',
            marginBottom: '1.5rem',
          }
          newUtilities[`.${screen}\\:nav-mobile`] = {
            position: 'static',
            borderTop: 'none',
            paddingTop: '0',
            paddingBottom: '0',
          }
          newUtilities[`.${screen}\\:sidebar-mobile`] = {
            position: 'static',
            width: 'auto',
            height: 'auto',
            left: '0',
            overflowY: 'visible',
          }
          newUtilities[`.${screen}\\:overlay-mobile`] = {
            display: 'none',
          }
        }
      })
      
      addUtilities(newUtilities)
    }
  ],
}
