import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Header from './Header';
import Snackbars from '../assets/Snackbars';
import Footer from './Footer';
import Logo from '../assets/Logo';
import Backdrop from '@mui/material/Backdrop';

export default function Layout({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(() => false);
    }, 3000);
    setLoading(() => true);
    return () => {
      clearTimeout();
    };
  }, []);

  return (
    <React.Fragment>
    <CssBaseline />
    {
      loading ?
      <Backdrop
        sx={{ bgcolor: '#fff', zIndex: 200, m: 'auto', display: 'flex', flexWrap: 'wrap' }}
        open={loading}
      >
        <Logo sx={{width: {sm: 590, xs: 306}, height: {sm: 160, xs: 76}}} viewBox="0 0 306 76" />
      </Backdrop>
      :
      <React.Fragment>
        <Header isVisible={isVisible}/>
        <Container maxWidth="xl">
          <Box component="main" sx={{ height: '100%', mt: '10rem' }}>
            {children}
          </Box>
          <Snackbars />
        </Container>
        <Footer isVisible={isVisible} setIsVisible={setIsVisible}/>
      </React.Fragment>
    }
    </React.Fragment>
  )
}
