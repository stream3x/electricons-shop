import * as React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import Layout from '../src/layout/Layout';
import '../src/globals.css';
import { StoreProvider } from '../src/utils/Store';
import { Analytics } from '@vercel/analytics/react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useRouter } from 'next/router';
import DashboardLayout from '../src/layout/DashboardLayout';
import Loader from '../src/layout/Loader';
import { Box } from '@mui/material';
import { styled, keyframes } from '@mui/system';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const slideIn = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const scaleAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
`;

const LoaderAnimation = styled(Box)(({ theme, loading }) => ({
  backgroundColor: 'white',
  position: 'fixed',
  top: 0,
  width: '100%',
  height: '100vh',
  zIndex: 9999,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  animation: loading ? `${slideIn} 500ms cubic-bezier(0.4, 0, 0.2, 1)` : `${slideOut} 500ms cubic-bezier(0.4, 0, 0.2, 1)`,
  '& svg': {
    transform: 'scale(1)',
    animation: `${scaleAnimation} 300ms cubic-bezier(0.4, 0, 0.2, 1)`,
    animationDelay: '100ms',
  },
}));

export default function MyApp(props) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [slideOut, setSlideOut] = React.useState(false);
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const exceptRouter = router.pathname !== '/blog' && router.pathname !== '/blog/post/[slug]' && router.pathname !== '/blog/category/[[...slug]]' && router.pathname !== '/search' && router.pathname !== '/login';

  const isBackoffice = router.pathname.replace(/\/\w+$/,'/') === '/backoffice/[id]/' || router.pathname === '/backoffice';
  const isBackofficeProfile = router.pathname === '/backoffice/profile/[id]'

  React.useEffect(() => {
    let loadingTimeout;

    const handleStart = () => {
      clearTimeout(loadingTimeout); // Poništava postojeći timeout
      setLoading(true);
      setSlideOut(true);
    };

    const handleComplete = () => {
      // Postavlja loading na false nakon kratkog kašnjenja (500 ms)
        loadingTimeout = setTimeout(() => {
          setLoading(false);
        }, 500);
        setSlideOut(false);
    };

    const handleError = () => {
      // Ako se pojavi greška, takođe postavlja loading na false
      setLoading(false);
      setSlideOut(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      clearTimeout(loadingTimeout); // Očisti timeout prilikom unmounting-a
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
    };
  }, [router]);

  return (
    <React.Fragment>
      {
        !isBackoffice && exceptRouter && loading &&
        <LoaderAnimation loading={slideOut}>
          <Loader />
        </LoaderAnimation>
      }
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <StoreProvider>
            <PayPalScriptProvider deferLoading={true}>
              {
                isBackoffice || isBackofficeProfile ?
                <DashboardLayout>
                  <Component {...pageProps} />
                  <Analytics />
                </DashboardLayout>
                :
                <Layout>
                  <Component {...pageProps} />
                  <Analytics />
                </Layout>
              }
            </PayPalScriptProvider>
          </StoreProvider>
        </ThemeProvider>
      </CacheProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
