import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '../../src/Link';
import ReplyIcon from '@mui/icons-material/Reply';
import theme from '../../src/theme';


export default function GuestOrder() {
  return (
      <Box sx={{ my: 5, '& a': {textDecoration: 'none' }, '&:hover a': {textDecoration: 'none' } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Guest Order page
        </Typography>
        <Link href="/" passHref>
          <Button sx={{'&:hover': {backgroundColor: theme.palette.secondary.main}}} size="large" variant="contained" startIcon={<ReplyIcon />}>
            back to shop
          </Button>
        </Link>
      </Box>
  );
}
