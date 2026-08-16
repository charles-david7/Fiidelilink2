import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#639922', light: '#7ab52a', dark: '#4a7018' },
    secondary: { main: '#0D1B2A', light: '#1a2d45', dark: '#060d14' },
    success: { main: '#059669' },
    warning: { main: '#D97706' },
    error: { main: '#DC2626' },
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
    text: { primary: '#2C2C2A', secondary: '#5F5E5A' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '8px 20px' },
        containedPrimary: { boxShadow: 'none', '&:hover': { boxShadow: '0 4px 12px rgba(99,153,34,0.3)' } },
      }
    },
    MuiCard: {
      styleOverrides: { root: { boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)', borderRadius: 12 } }
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 6 } } },
  }
});