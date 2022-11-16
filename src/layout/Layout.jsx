import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Header from './Header'
import Snackbars from '../assets/Snackbars'
import { Store } from '../utils/Store'
import Footer from './Footer'

export default function Layout({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const { state: { snack } } = useContext(Store);

  return (
    <React.Fragment>
    <CssBaseline />
      <Header isVisible={isVisible}/>
      <Container maxWidth="xl">
        <Box component="main" sx={{ border: '1px dashed grey', height: '100%', mt: '8.5em' }}>
          {children}
        </Box>
        <Snackbars snack={snack}/>
      </Container>
      <Footer isVisible={isVisible} setIsVisible={setIsVisible}/>
    </React.Fragment>
  )
}
