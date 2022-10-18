import React from 'react'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Header from './Header'

export default function Layout({ children }) {
 
  return (
    <React.Fragment>
    <CssBaseline />
      <Header />
      <Container fixed>
        <Box component="main" sx={{ border: '1px dashed grey', height: '100vh', mt: '8.5em' }}>
          {children}
        </Box>
      </Container>
    </React.Fragment>
  )
}
