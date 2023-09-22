import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Header from './Header';
import Snackbars from '../assets/Snackbars';
import Footer from './Footer';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mui/material';
import Link from '../Link';
import Image from 'next/image';

export default function Layout({ children }) {
  const router = useRouter();
  const matches = useMediaQuery('(min-width: 1200px)');
  const isNotBlog = router.pathname !== '/blog';
  const isNotPost = router.pathname !== '/blog/post/[slug]';
  const isNotCat = router.pathname !== '/blog/category/[[...slug]]';
  const isLogin = router.pathname === '/login' || router.pathname === '/signin';

  if(isLogin) {
    return (
      <Box sx={{pb: 5, background: 'linear-gradient(360deg, rgb(238, 242, 246) 1.09%, rgb(255, 255, 255) 100%)', minHeight: '100vh'}}>
        <Box sx={{py: 5, display: 'flex', justifyContent: {xs: 'center', md: 'left'}}}>
          <Link href="/blog?counter=10">
            <Image
              width= {matches ? 280 : 300}
              height= {matches ? 50 : 60}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              src='/logo/electricons_logo.svg'
              alt="logo"
              quality={100}
              loading="eager"
            />
          </Link>
        </Box>
        <Box component="main">
          {children}
          <Snackbars />
        </Box>
      </Box>

    )
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Header />
      <Container maxWidth="xl">
        <Box component="main" sx={{ height: '100%', mt: {xs: isNotPost && isNotBlog && isNotCat ? '5rem' : matches ? '5rem' : '2rem', sm: isNotPost && isNotBlog && isNotCat ? '10rem' : '2rem'} }}>
          {children}
        </Box>
        <Snackbars />
      </Container>
      <Footer />
    </React.Fragment>
  )
}
