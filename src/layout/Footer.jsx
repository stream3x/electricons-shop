import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
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
import StayCurrentPortraitIcon from '@mui/icons-material/StayCurrentPortrait';
import MapFooter from '../assets/MapFooter';
import Link from '../Link';
import theme from '../theme';

function Copyright() {
  return (
    <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%'}}>
      <Typography sx={{width: {xs: '100%', sm: 'auto'}, p: 2}} align="center" variant="body2" color="primary.contrastText">
        {'Copyright © '}
        <Link color="primary.main" href="https://electricons.vercel.app/">
          Electricons
        </Link>{' '}{' 2022 - '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
      <Typography sx={{width: {xs: '100%', sm: 'auto'}, p: {xs: 0, sm: 2}}} align="center" variant="body2" color="primary.contrastText">
        Ecommerce Software By{' '}
      <Link color="primary.main" href="https://explodemarket.com/">
        ExplodeMarket™
      </Link>
      </Typography>
    </Box>
  );
}

function ScrollTop(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
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
        sx={{ position: 'fixed', bottom: {xs: 70, sm: 30}, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

const company = [
  {id: '2.1', title: 'Delivery', link: '#'},
  {id: '2.2', title: 'Legal Notice', link: '#'},
  {id: '2.3', title: 'Terms and conditions of use', link: '#'},
  {id: '2.4', title: 'About us', link: '#'},
  {id: '2.5', title: 'Contact us', link: '#'},
];
const account = [
  {id: '3.1', title: 'Personal Info', link: '#'},
  {id: '3.2', title: 'Orders', link: '#'},
  {id: '3.3', title: 'Credit slips', link: '#'},
  {id: '3.4', title: 'Addresses', link: '#'},
  {id: '3.5', title: 'My wishlists', link: '#'}
];
const products = [
  {id: '4.1', title: 'Electricons', link: '/search'},
  {id: '4.2', title: 'Desktop computers', link: '/category/desktop-computers'},
  {id: '4.3', title: 'Laptop computers', link: '/category/laptops'},
  {id: '4.4', title: 'Smartphones', link: '/category/smartphones'},
  {id: '4.5', title: 'Xiaomi Smartphones', link: '/category/smartphones/Xiaomi-Smartphones'}
];

export default function Footer({ storeInfo }) {
  const [isVisible, setIsVisible] = React.useState(false);

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
      component="footer"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <CssBaseline />
      <Container component="div" sx={{ mt: 8, mb: 2 }} maxWidth="xl">
        <Box sx={{p: 0}}>
          <Divider />
        </Box>
        <Grid sx={{m: '0 auto', width: {xs: '100%', sm: 'inherit'}, marginLeft: {xs: 0, sm: 'inherit'} }} container spacing={2}>
          <Grid item xs={12} sx={{paddingLeft: {xs: '0!important', sm: 'inherit'} }}>
            <MapFooter />
          </Grid>
          <Grid item xs={12} sm={3}>
          <Typography variant="p" component="h3" gutterBottom>
            STORE INFORMATION
          </Typography>
          <List
            component="ul"
          >
              <Box>
                <ListItem>
                  <ListItemIcon>
                    <Public />
                  </ListItemIcon>
                  <ListItemText sx={{overflowWrap: 'break-word'}} primary={`${storeInfo && storeInfo.name}, ${storeInfo && storeInfo.country}`} />
                </ListItem>
                <ListItem sx={{ '& a': {textDecoration: 'none', color: theme.palette.secondary.main }, '&:hover a': {textDecoration: 'none', color: theme.palette.secondary.light } }}>
                  <Link sx={{display: 'flex'}} href={`mailto:${storeInfo && storeInfo.email}`} passHref>
                    <ListItemIcon>
                      <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText sx={{overflowWrap: 'break-word'}} primary={`${storeInfo && storeInfo.email}`} />
                  </Link>
                </ListItem>
                <ListItem sx={{ '& a': {textDecoration: 'none', color: theme.palette.secondary.main }, '&:hover a': {textDecoration: 'none', color: theme.palette.secondary.light } }}>
                  <Link sx={{display: 'flex'}} href={`tel:${storeInfo && storeInfo.phone}`} passHref>
                    <ListItemIcon>
                      <StayCurrentPortraitIcon />
                    </ListItemIcon>
                    <ListItemText sx={{overflowWrap: 'break-word'}} primary={`${storeInfo && storeInfo.phone}`} />
                  </Link>
                </ListItem>
                <ListItem sx={{ '& a': {textDecoration: 'none', color: theme.palette.secondary.main }, '&:hover a': {textDecoration: 'none', color: theme.palette.secondary.light } }}>
                  <Link sx={{display: 'flex'}} href={`tel:${storeInfo && storeInfo.phone_two}`} passHref>
                    <ListItemIcon>
                      <LocalPhoneIcon />
                    </ListItemIcon>
                    <ListItemText sx={{overflowWrap: 'break-word'}} primary={`${storeInfo && storeInfo.phone_two}`} />
                  </Link>
                </ListItem>
              </Box>
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
                <ListItem sx={{ '& a': {textDecoration: 'none', color: theme.palette.secondary.main }, '&:hover a': {textDecoration: 'none', color: theme.palette.secondary.light } }} key={company_list.id}>
                  <Link href={company_list.link} passHref>
                    <ListItemText primary={company_list.title} />
                  </Link>
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
                <ListItem sx={{ '& a': {textDecoration: 'none', color: theme.palette.secondary.main }, '&:hover a': {textDecoration: 'none', color: theme.palette.secondary.light } }} key={account.id}>
                  <Link href={account.link} passHref>
                    <ListItemText primary={account.title} />
                  </Link>
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
                <ListItem sx={{ '& a': {textDecoration: 'none', color: theme.palette.secondary.main }, '&:hover a': {textDecoration: 'none', color: theme.palette.secondary.light } }} key={product.id}>
                  <Link href={product.link} passHref>
                    <ListItemText primary={product.title} />
                  </Link>
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
          <Logo logoSrc={storeInfo} sx={{width: 290, height: 60}} viewBox="0 0 306 76"/>
          <Typography color="secondary.lightGrey" sx={{width: '100%', textAlign: "center", pt: 2}} variant="body1" component="p">
          We are a global housewares product design company. We bring thought and creativity to everyday items through original design.
          </Typography>
        </Box>
      </Container>
      <Box
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