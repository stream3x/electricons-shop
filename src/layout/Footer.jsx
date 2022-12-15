import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Logo from '../assets/Logo';
import { Divider, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MobileBottomNav from '../assets/MobileBottomNav';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';
import DraftsIcon from '@mui/icons-material/Drafts';
import Public from '@mui/icons-material/Public';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

function Copyright() {
  return (
    <Typography align="center" variant="body2" color="primary.contrastText">
      {'Copyright © '}
      <Link color="primary.main" href="https://electricons.vercel.app/">
        Electricons
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
      {' - '}
      {' Ecommerce Software By ExplodeMarket™ '}
    </Typography>
  );
}

function ScrollTop(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 50,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    );

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: {xs: 70, sm: 16}, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

const store_information = [
  {title: 'Elecetricons store, Serbia', icon: <Public />},
  {title: 'electricons@explodemarket.com', icon: <DraftsIcon />},
  {title: '(+381) 555 333', icon: <LocalPhoneIcon />}
];
const company = [
  {title: 'Delivery'},
  {title: 'Legal Notice'},
  {title: 'Terms and conditions of use'},
  {title: 'About us'},
  {title: 'Contact us'},
];
const account = [
  {title: 'Personal Info'},
  {title: 'Orders'},
  {title: 'Credit slips'},
  {title: 'Addresses'},
  {title: 'My wishlists'}
];
const products = [
  {title: 'Electricons'},
  {title: 'Desktop computers'},
  {title: 'Laptop computers'},
  {title: 'Mobile'},
  {title: 'Tablets'}
];

export default function Footer({ isVisible, setIsVisible }) {

  function toggleVisibility() {
    const visibleBtn = window.scrollY;
    visibleBtn > 50 ? setIsVisible(() => true) : setIsVisible(() => false);
  }

  React.useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <CssBaseline />
      <Container component="div" sx={{ mt: 8, mb: 2 }} maxWidth="xl">
        <Grid sx={{m: '0 auto'}} container spacing={2}>
          <Grid item xs={12} sm={3}>
          <Typography variant="p" component="h3" gutterBottom>
            STORE INFORMATION
          </Typography>
          <List
            component="ul"
          >
            {
              store_information.map(info => (
                <ListItem key={info}>
                  <ListItemIcon>
                    {info.icon}
                  </ListItemIcon>
                  <ListItemText sx={{overflowWrap: 'break-word'}} primary={info.title} />
                </ListItem>
              ))
            }
            </List>
          </Grid>
          <Grid item xs={12} sm={3}>
          <Typography variant="p" component="h3" gutterBottom>
            OUR COMPANY
          </Typography>
          <List
            component="ul"
          >
            {
              company.map(company_list => (
                <ListItem key={company_list}>
                  <ListItemText primary={company_list.title} />
                </ListItem>
              ))
            }
            </List>
          </Grid>
          <Grid item xs={12} sm={3}>
          <Typography variant="p" component="h3" gutterBottom>
            YOUR ACCOUNT
          </Typography>
          <List
            component="ul"
          >
            {
              account.map(account => (
                <ListItem key={account}>
                  <ListItemText primary={account.title} />
                </ListItem>
              ))
            }
            </List>
          </Grid>
          <Grid item xs={12} sm={3}>
          <Typography variant="p" component="h3" gutterBottom>
            PRODUCTS
          </Typography>
          <List
            component="ul"
          >
            {
              products.map(product => (
                <ListItem key={product}>
                  <ListItemText primary={product.title} />
                </ListItem>
              ))
            }
            </List>
          </Grid>
        </Grid>
        <Box sx={{p: 5}}>
          <Divider />
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
          <Logo sx={{width: 290, height: 60}} viewBox="0 0 306 76"/>
          <Typography sx={{width: '100%', textAlign: "center"}} variant="body1">We are a global housewares product design company. We bring thought and creativity to everyday items through original design.</Typography>
        </Box>
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? theme.palette.secondary.lightGrey
              : theme.palette.secondary.main,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Copyright />
          </Box>
        </Container>
      </Box>
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
      <MobileBottomNav isVisible={isVisible}/>
    </Box>
  );
}