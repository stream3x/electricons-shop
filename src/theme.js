import { createTheme } from '@mui/material/styles';
import { red, green, grey, cyan, yellow, indigo, purple } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: cyan[500],
      dark: cyan[700],
      contrastText: grey[50],
      borderColor: cyan[500],
      white: '#fff',
      bgdLight: '#f9f9f9'
    },
    secondary: {
      main: grey[900],
      lightGrey: grey[500],
      borderColor: grey[300]
    },
    indigo: {
      main: indigo[900]
    },
    white: {
      main: grey[50],
    },
    shape: {
      borderRadius: 50
    },
    inputButtonShape: {
      borderRadius: '0 50px 50px 0',
    },
    addToCartButtonShape: {
      borderRadius: '50px',
    },
    badge: {
      main: grey[900],
      bgd: grey[300],
      bgdLight: '#F5F5F5'
    },
    success: {
      main: green.A100,
    },
    error: {
      main: red.A400,
      dark: red[700],
    },
    warning: {
      main: yellow.A400,
    },
    dashboard: {
      main: purple[500]
    },
    transitions: {
      duration: {
        leavingScreen: 5000
      }
    }
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      // most basic recommended timing
      standard: 300,
      // this is to be used in complex animations
      complex: 375,
      // recommended when something is entering screen
      enteringScreen: 225,
      // recommended when something is leaving screen
      leavingScreen: 195,
    },
  },
});

export default theme;
