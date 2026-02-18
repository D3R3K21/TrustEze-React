import { createTheme } from '@mui/material/styles';
import { colors } from './colors';

/**
 * MUI theme for the horizontal filter bar, matching the horizontal-filter-component design.
 * Use via ThemeProvider wrapping SearchFilters so buttons, inputs, and chips match the reference.
 */
export const filterBarTheme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      dark: colors.primaryHover,
      contrastText: '#ffffff',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "inherit",
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#b0a090',
          '&.Mui-checked': {
            color: colors.primary,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});
