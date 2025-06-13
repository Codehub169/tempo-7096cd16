import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    primary: '#ff8fab',      // Main pink from HTML previews
    secondary: '#fddde6',    // Light pink from HTML previews
    accent: '#84d2f6',       // Light blue accent from HTML previews
    text: '#6d6d6d',         // Main text color from HTML previews
    heading: '#3a3a3a',      // Heading color from HTML previews
    background: '#fdf6f8',   // Main page background from HTML previews (e.g., index.html body)
    white: '#ffffff',        // Standard white
    border: '#e0e0e0',       // Border color (e.g., shop filters, inputs)
    lightBg: '#f0f8ff',      // Lighter background for specific sections (e.g., auth pages, confirmation)
    success: '#a9def9',      // Success indication color (e.g., product added, confirmation icon)
    shadow: 'rgba(255, 143, 171, 0.15)', // Default shadow color
    // Additional shades if needed, e.g., for hover states
    primaryDarker: '#e07d9a', // A darker shade of primary for hover
    accentDarker: '#6cbde9',  // A darker shade of accent for hover
  },
};

const fonts = {
  heading: `'Poppins', sans-serif`,
  body: `'Inter', sans-serif`,
};

const styles = {
  global: (props) => ({
    body: {
      fontFamily: 'body',
      color: 'brand.text',
      bg: 'brand.background',
      lineHeight: '1.6',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    'h1, h2, h3, h4, h5, h6': {
      fontFamily: 'heading',
      color: 'brand.heading',
      fontWeight: '600', // Default heading weight
    },
    a: {
      color: 'brand.primary',
      _hover: {
        textDecoration: 'none', // As per modern UX and some previews
        color: 'brand.accent', 
      },
    },
  }),
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: '600',
      borderRadius: '50px', // Consistent with HTML previews (e.g., hero button, auth buttons)
      fontFamily: 'heading', // Use Poppins for buttons as per design system hierarchy
      transition: 'all 0.3s ease',
    },
    variants: {
      solid: (props) => ({
        bg: 'brand.primary',
        color: 'brand.white',
        boxShadow: '0 5px 15px var(--chakra-colors-brand-shadow)',
        _hover: {
          bg: 'brand.accent',
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 25px rgba(132, 210, 246, 0.3)', // Accent shadow
        },
        _active: {
          bg: 'brand.accentDarker',
          transform: 'translateY(-1px)',
          boxShadow: '0 5px 15px rgba(132, 210, 246, 0.2)',
        },
      }),
      outline: (props) => ({
        borderColor: 'brand.primary',
        color: 'brand.primary',
        _hover: {
          bg: 'brand.secondary',
          borderColor: 'brand.accent',
          color: 'brand.accent',
        },
      }),
      gradient: (props) => ({
        bgGradient: 'linear(to-r, brand.primary, brand.accent)',
        color: 'brand.white',
        boxShadow: '0 5px 15px var(--chakra-colors-brand-shadow)',
        _hover: {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 20px rgba(132, 210, 246, 0.5)',
        },
        _active: {
            transform: 'translateY(-1px)',
        }
      }),
    },
  },
  Input: {
    baseStyle: {
      field: {
        borderColor: 'brand.border',
        borderRadius: '10px', // Rounded inputs from checkout/auth previews
        bg: '#f9f9f9', // Light background for inputs from previews
        transition: 'all 0.3s ease',
        _hover: {
          borderColor: 'brand.primary',
        },
      },
    },
    variants: {
      outline: {
        field: {
          _focus: {
            borderColor: 'brand.accent',
            boxShadow: `0 0 0 3px var(--chakra-colors-brand-accent)`,
            bg: 'brand.white',
          },
        },
      },
      auth: { // Added auth variant
        field: {
          borderRadius: '15px',
          bg: 'brand.lightBg', // Lighter background for auth forms
          borderColor: 'brand.border',
          boxShadow: 'sm',
          _hover: {
            borderColor: 'brand.primary',
          },
          _focus: {
            borderColor: 'brand.accent',
            boxShadow: `0 0 0 2px var(--chakra-colors-brand-accent)`,
            bg: 'brand.white',
          },
        },
      },
    },
    defaultProps: {
      focusBorderColor: 'brand.accent', // Ensure focus uses accent color
    },
  },
};

export const theme = extendTheme({
  colors,
  fonts,
  styles,
  components,
});
