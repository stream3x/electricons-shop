import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Header from './Header';
import Snackbars from '../assets/Snackbars';
import Footer from './Footer';
import Backdrop from '@mui/material/Backdrop';
import axios from 'axios';
import LogoStatic from '../assets/LogoStatic';

export default function Layout({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [storeInfo, setStoreInfo] = React.useState([]);

  useEffect(() => {
    fetchStoreInfo();
    setTimeout(() => {
      setLoading(() => false);
    }, 3000);
    return () => {
      clearTimeout();
      setLoading(() => true);
    };
  }, []);

  async function fetchStoreInfo() {
    const { data } = await axios.get('https://electricons.vercel.app/api/store_info');
      setStoreInfo(data);
  }

  return (
    <React.Fragment>
    <CssBaseline />
    {
      loading ?
      <Backdrop
        sx={{ bgcolor: '#fff', zIndex: 200, m: 'auto', display: 'flex', flexWrap: 'wrap' }}
        open={loading}
      >
        <LogoStatic sx={{width: {sm: 590, xs: 306}, height: {sm: 160, xs: 76}}} viewBox="0 0 306 76"/>
      </Backdrop>
      :
      <React.Fragment>
        <Header storeInfo={storeInfo[0]} isVisible={isVisible}/>
        <Container maxWidth="xl">
          <Box component="main" sx={{ height: '100%', mt: '10rem' }}>
            {children}
          </Box>
          <Snackbars />
        </Container>
        <Footer storeInfo={storeInfo[0]} isVisible={isVisible} setIsVisible={setIsVisible}/>
      </React.Fragment>
    }
    </React.Fragment>
  )
}
