import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Header from './Header';
import Snackbars from '../assets/Snackbars';
import Footer from './Footer';

export default function Layout({ children, storeInfo }) {
  const mainStore = storeInfo.filter(store => store._id === '647456d0ef1a547ad11c0429');

  return (
    <React.Fragment>
    <CssBaseline />
      <Header storeInfo={mainStore[0]} />
      <Container maxWidth="xl">
        <Box component="main" sx={{ height: '100%', mt: {xs: '8rem', sm: '10rem'} }}>
          {children}
        </Box>
        <Snackbars />
      </Container>
      <Footer storeInfo={mainStore[0]} />
    </React.Fragment>
  )
}
