import { ThemeProvider } from '@emotion/react';
import { Box, Container, CssBaseline, Typography } from '@mui/material';
import React from 'react';
import theme from '../src/theme';

export default function OnSale() {
  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ my: 4 }}>
          <Typography>Products on sale</Typography>
        </Box>
    </ThemeProvider>
  )
}
