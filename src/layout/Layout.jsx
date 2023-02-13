import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Header from './Header';
import Snackbars from '../assets/Snackbars';
import Footer from './Footer';

export default function Layout({ children, storeInfo }) {

  return (
    <React.Fragment>
    <CssBaseline />
      <Header storeInfo={storeInfo[0]} />
      <Container maxWidth="xl">
        <Box component="main" sx={{ height: '100%', mt: '10rem' }}>
          {children}
        </Box>
        <Snackbars />
      </Container>
      <Footer storeInfo={storeInfo[0]} />
    </React.Fragment>
  )
}
