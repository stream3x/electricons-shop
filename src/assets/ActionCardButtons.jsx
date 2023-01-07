import React from 'react';
import { Box, IconButton } from '@mui/material';
import Wishlist from '@mui/icons-material/FavoriteBorderOutlined';
import CompareIcon from '@mui/icons-material/RepeatOutlined';
import CartIcon from '@mui/icons-material/ShoppingCartOutlined';
import theme from '../theme';
import { maxWidth } from '@mui/system';

export default function ActionCardButtons(props) {
  const { view } = props;
  let BoxWidth;
  let iconSize;
  if(view === 'list') {
    BoxWidth = '50%';
    iconSize = "small";
  }else {
    BoxWidth = '100%';
    iconSize = "small";
  }

  return (
    <Box className='card-buttons' sx={{ display: 'flex', justifyContent: 'center', minWidth: BoxWidth }}>
      <IconButton size={iconSize} sx={{backgroundColor: theme.palette.secondary.main, '&:hover': {backgroundColor: theme.palette.primary.main} }}>
        <CompareIcon fontSize={iconSize} color='white'/>
      </IconButton>
      <IconButton
        size={iconSize}
        color="primary"
        sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': {backgroundColor: theme.palette.primary.main}, ml: 2 }}
      >
        <Wishlist fontSize={iconSize} color="white"/>
      </IconButton>
      <IconButton
        size={iconSize}
        color="primary.white"
        sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': {backgroundColor: theme.palette.primary.main}, ml: 2 }}
      >
        <CartIcon fontSize={iconSize} color="white"/>
      </IconButton>
    </Box>
  )
}
