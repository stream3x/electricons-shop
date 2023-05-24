import React from 'react';
import { Box, IconButton } from '@mui/material';
import Wishlist from '@mui/icons-material/FavoriteBorderOutlined';
import CompareIcon from '@mui/icons-material/RepeatOutlined';
import CartIcon from '@mui/icons-material/ShoppingCartOutlined';
import theme from '../theme';
import { Store } from '../utils/Store';
import axios from 'axios';

export default function ActionCardButtons(props) {
  const { view, product } = props;
  const { state, dispatch } = React.useContext(Store);
  const { cart: {cartItems} } = state;

  let BoxWidth;
  let iconSize;
  if(view === 'list') {
    BoxWidth = '50%';
    iconSize = "small";
  }else {
    BoxWidth = '100%';
    iconSize = "small";
  }

  async function addToCartHandler() {
    
    const { data } = await axios.get(`/api/products/${product._id}`)
    if(data.inStock <= 0) {
      dispatch({ type: 'CART_ADD_ITEM', payload: { ...state.snack, message: 'Sorry Product is out of stock', severity: 'success'}});
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: 1}});
    if(cartItems.find(i => i._id === product._id)) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item already added', severity: 'warning' } });
      return;
    }
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item successfully added', severity: 'success' } });

  }

  async function addToComparasion() {
    const { data } = await axios.get(`/api/products/${product._id}`);
    dispatch({ type: 'COMPARE_ADD_ITEM', payload: { ...product, data }});
    if(state.comparation && state.comparation.compareItems.find(i => i._id === data._id)) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item already added', severity: 'warning' } });
      setLoading(false);
      return;
    }
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item successfully added', severity: 'success' } });
  }

  async function addToWishlist() {
    const { data } = await axios.get(`/api/products/${product._id}`);
    dispatch({ type: 'WISHLIST_ADD_ITEM', payload: { ...product, data }});
    if(state.wishlist && state.wishlist.wishItems.find(i => i._id === data._id)) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item already added', severity: 'warning' } });
      setLoading(false);
      return;
    }
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item successfully added', severity: 'success' } });
  }

  return (
    <Box className='card-buttons' sx={{ display: 'flex', justifyContent: 'center', minWidth: BoxWidth }}>
      <IconButton onClick={addToComparasion} size={iconSize} sx={{backgroundColor: theme.palette.secondary.main, '&:hover': {backgroundColor: theme.palette.primary.main} }}>
        <CompareIcon fontSize={iconSize} color='white'/>
      </IconButton>
      <IconButton
        onClick={addToWishlist}
        size={iconSize}
        color="primary"
        sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': {backgroundColor: theme.palette.primary.main}, ml: 2 }}
      >
        <Wishlist fontSize={iconSize} color="white"/>
      </IconButton>
      <IconButton
        onClick={addToCartHandler}
        size={iconSize}
        color="primary.white"
        sx={{ backgroundColor: theme.palette.secondary.main, '&:hover': {backgroundColor: theme.palette.primary.main}, ml: 2 }}
      >
        <CartIcon fontSize={iconSize} color="white"/>
      </IconButton>
    </Box>
  )
}
