import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Header from './Header'
import Snackbars from '../assets/Snackbars'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import Fab from '@mui/material/Fab'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Fade from '@mui/material/Fade'
import { Store } from '../utils/Store'
import Footer from './Footer'

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
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

export default function Layout({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const { state: { snack } } = useContext(Store);

  function toggleVisibility() {
    const visibleBtn = window.scrollY;
    visibleBtn > 50 ? setIsVisible(() => true) : setIsVisible(() => false);
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);
 
  return (
    <React.Fragment>
    <CssBaseline />
      <Header isVisible={isVisible}/>
      <Container maxWidth="xl">
        <Box component="main" sx={{ border: '1px dashed grey', height: '100%', mt: '8.5em' }}>
          {children}
        </Box>
          <ScrollTop>
            <Fab size="small" aria-label="scroll back to top">
              <KeyboardArrowUpIcon />
            </Fab>
          </ScrollTop>
          <Snackbars snack={snack}/>
      </Container>
      <Footer />
    </React.Fragment>
  )
}
