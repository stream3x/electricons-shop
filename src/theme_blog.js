import { createTheme } from '@mui/material/styles';
import { red, green, grey, cyan, yellow, indigo } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: grey[50],
      contrastText: grey[900],
      borderColor: cyan[500],
      white: '#fff'
    },
    secondary: {
      main: grey[50],
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
    },
    warning: {
      main: yellow.A400,
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
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});

export default theme;
