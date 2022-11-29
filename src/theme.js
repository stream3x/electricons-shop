import { createTheme } from '@mui/material/styles';
import { red, grey, cyan, yellow } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: cyan[500],
      contrastText: grey[50],
      borderColor: cyan[500],
      white: '#fff'
    },
    secondary: {
      main: grey[900],
      lightGrey: grey[500],
      borderColor: grey[300]
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
      bgd: grey[300]
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
