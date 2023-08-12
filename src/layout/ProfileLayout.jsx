import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InfoIcon from '@mui/icons-material/Info';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { Grid } from '@mui/material';
import Link from '../Link';
import { useRouter } from 'next/router';

export default function ProfileLayout({ children }) {
  const router = useRouter();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <List sx={{'& a': {textDecoration: 'none'}}} component="nav" aria-label="main mailbox folders">
          <Link href="/profile/info" passHref>
            <ListItemButton
              selected={router.pathname === "/profile/info"}
            >
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="Info" />
            </ListItemButton>
          </Link>
          <Divider />
          <Link href="/profile/addresses" passHref>
            <ListItemButton
              selected={router.pathname === "/profile/addresses"}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Addresses" />
            </ListItemButton>
          </Link>
          <Divider />
          <Link href="/profile/wishlist" passHref>
            <ListItemButton
              selected={router.pathname === "/profile/wishlist"}
            >
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>
              <ListItemText primary="Wishlist" />
            </ListItemButton>
          </Link>
          <Divider />
          <Link href="/profile/order-history" passHref>
            <ListItemButton
              selected={router.asPath === "/profile/order-history"}
            >
              <ListItemIcon>
                <ShoppingBasketIcon />
              </ListItemIcon>
              <ListItemText primary="Order History" />
            </ListItemButton>
          </Link>
        </List>
      </Grid>
      <Grid item xs={12} md={9}>
        {children}
      </Grid>
    </Grid>
  );
}