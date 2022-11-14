import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Logo from '../assets/Logo';
import { Divider, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {'Copyright © '}
      <Link color="inherit" href="https://electricons.vercel.app/">
        Electricons
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <CssBaseline />
      <Container component="div" sx={{ mt: 8, mb: 2 }} maxWidth="xl">
        <Grid sx={{m: '0 auto'}} container spacing={2}>
          <Grid item xs={12} sm={3}>
          <Typography variant="h6" component="h2" gutterBottom>
            STORE INFORMATION
          </Typography>
          <List
            component="ul"
          >
            <ListItem>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Sent mail" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Sent mail" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Sent mail" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Sent mail" />
            </ListItem>
          </List>
          </Grid>
          <Grid item xs={12} sm={3}>
          <Typography variant="h6" component="h2" gutterBottom>
            OUR COMPANY
          </Typography>
          <List
            component="ul"
          >
            <ListItem>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Sent mail" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Sent mail" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Sent mail" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Sent mail" />
            </ListItem>
          </List>
          </Grid>
          <Grid item xs={12} sm={3}>
          <Typography variant="h6" component="h2" gutterBottom>
          YOUR ACCOUNT
          </Typography>
            <List
              component="ul"
            >
              <ListItem>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Sent mail" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Sent mail" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Sent mail" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Sent mail" />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={3}>
          <Typography variant="h6" component="h2" gutterBottom>
          PRODUCTS
          </Typography>
            <List
              component="ul"
            >
              <ListItem>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Sent mail" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Sent mail" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Sent mail" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Sent mail" />
              </ListItem>
            </List>
          </Grid>
        </Grid>
        <Box sx={{p: 5}}>
          <Divider />
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
          <Logo sx={{width: 290, height: 60}} viewBox="0 0 306 76"/>
          <Typography sx={{width: '100%', textAlign: "center"}} variant="body1">We are a global housewares product design company. We bring thought and creativity to everyday items through original design.</Typography>
        </Box>
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Copyright />
            <Typography variant="body1">
            - Ecommerce Software By ExplodeMarket™
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}