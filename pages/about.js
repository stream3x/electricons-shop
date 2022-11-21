import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import Copyright from '../src/Copyright';

export default function About() {
  return (
      <Box sx={{ my: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About example
        </Typography>
        <Link href="/" passHref noLinkStyle>
          <Button variant="contained" href="/">
            Go to the main page
          </Button>
        </Link>
      </Box>
  );
}
