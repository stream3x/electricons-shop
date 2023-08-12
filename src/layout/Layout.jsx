import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Header from './Header';
import Snackbars from '../assets/Snackbars';
import Footer from './Footer';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mui/material';

export default function Layout({ children, storeInfo }) {
  const router = useRouter();
  const matches = useMediaQuery('(min-width: 1200px)');
  const isNotBlog = router.pathname !== '/blog';
  const isNotPost = router.pathname !== '/blog/post/[slug]';
  const isNotCat = router.pathname !== '/blog/category/[[...slug]]';
  const mainStore = storeInfo.filter(store => store.name === "Electricons store");
  const isDashboard = router.pathname === '/dashboard/[id]';

  if(isDashboard) {
    return (
      <Box component="main">
        {children}
        <Snackbars />
      </Box>
    )
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Header storeInfo={mainStore[0]} />
      <Container maxWidth="xl">
        <Box component="main" sx={{ height: '100%', mt: {xs: isNotPost && isNotBlog && isNotCat ? '8rem' : matches ? '5rem' : '2rem', sm: isNotPost && isNotBlog && isNotCat ? '10rem' : '2rem'} }}>
          {children}
        </Box>
        <Snackbars />
      </Container>
      <Footer storeInfo={mainStore[0]} />
    </React.Fragment>
  )
}
