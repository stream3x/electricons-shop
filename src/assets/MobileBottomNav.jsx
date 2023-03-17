import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import Wishlist from '@mui/icons-material/FavoriteBorderOutlined';
import CompareIcon from '@mui/icons-material/RepeatOutlined';
import SwipeableCartDrawer from '../components/SwipeableCartDrawer';
import { Store } from '../utils/Store';
import { Badge } from '@mui/material';
import Link from '../Link';

export default function MobileBottomNav({ isVisible }) {
  const ref = React.useRef(null);
  const { state, dispatch } = React.useContext(Store);
  const { cart, comparasion:{compareItems} } = state;

  return (
    <Box sx={{ display: {xs: 'block', sm: 'none'}, pb: 7 }} ref={ref}>
      <CssBaseline />
      <Paper sx={{ transform: isVisible ? 'translateY(0px)' : 'translateY(50px)', transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms', zIndex: 2, position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
        >
          <Link sx={{width: '100%', height: '100%'}} href={'/compare'}>
            <BottomNavigationAction label="Comparasion" icon={<Badge sx={{ 'span': {top:'50%', right:'-50%'} }} badgeContent={compareItems.length > 0 ? compareItems.length : "0"} color="secondary"><CompareIcon /></Badge> } />
          </Link>
          <BottomNavigationAction label="Wishlist" icon={<Wishlist />} />
          <BottomNavigationAction label="Cart" icon={<SwipeableCartDrawer cart={cart}/>} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}