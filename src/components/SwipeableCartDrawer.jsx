import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloseIcon from '@mui/icons-material/Close';
import { Badge, Grid, IconButton, Typography, useMediaQuery } from '@mui/material';
import theme from '../theme';
import CartIcon from '@mui/icons-material/ShoppingCartOutlined';
import Link from '../Link';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';

export default function SwipeableCartDrawer() {
  const [drawerState, setDrawerState] = React.useState({
    right: false
  });
  const match = useMediaQuery('(max-width: 600px)');
  const { state, dispatch } = React.useContext(Store);
  const { cart, cart: {shipping} } = state;

  function removeItemHandler(item) {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item});
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item removed successfully', severity: 'warning' } });
  }

  const subTotal = cart.cartItems.length !== 0 ? cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0) : 0;
  const shippingCost = shipping.shippingMethod !== 'store' ? (shipping.shippingMethod === 'dhl' ? 50 * 1.8 : Cookies.get('shipping') ? JSON.parse(Cookies.get('shipping')) : '') : 0;
  let taxCost;
  let taxCount;



  if(cart.cartItems.length !== 0 && cart.cartItems.length < 3) {
    taxCost = '33.33%';
    taxCount = 1.3333;
  }else {
    taxCost = '12%';
    taxCount = 1.12;
  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDrawerState({ ...drawerState, [anchor]: open });
  };

  const list = (anchor) => (
    <React.Fragment>
      <Box
        sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300, flexGrow: 2 }}
        role="presentation"
      >
        <Box sx={{display: 'flex', alignItems: 'center', p: 1}}>
          <IconButton onClick={toggleDrawer(anchor, false)}>
            <CloseIcon />
          </IconButton>
          <Typography gutterBottom variant="h6" component="h6" color="secondary" sx={{flex: 1, alignItems: 'center', mb: 0, textAlign: 'center'}}>
            Shoping Cart
          </Typography>
          <Typography gutterBottom variant="h6" component="h6" color="secondary.lightGrey" sx={{textAlign: 'center', mb: 0, px: 1}}>
            {cart.cartItems.length}
          </Typography>
        </Box>
        <Divider />
      {
        cart.cartItems.length === 0 ?
        <Box sx={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', height: '100%'}}>
          <Box sx={{width: '100%'}}>
            <Box
              component="img"
              sx={{
                height: 'auto',
                display: 'block',
                maxWidth: 400,
                overflow: 'hidden',
                width: 'auto',
                margin: 'auto'
              }}
              src="/images/empty_cart.png"
              alt="cart is empty"
            />
            <Typography gutterBottom variant="h6" component="h6" color="secondary.lightGrey" sx={{textAlign: 'center', mb: 0, px: 1}}>
              Cart is Empty
            </Typography>
          </Box>
        </Box>
        : 
        <List sx={{ overflowY: 'auto'}}>
          {cart.cartItems.length !== 0 && cart.cartItems.map((item, index) => (
            <React.Fragment key={item._id}>
              <ListItem sx={{pt: 1}} disablePadding>
                <Grid container space={2}>
                  <Grid item xs={3} sx={{display: 'flex', alignItems: 'center'}}>
                    <Box
                      component="img"
                      sx={{
                        height: 50,
                        display: 'block',
                        maxWidth: 400,
                        overflow: 'hidden',
                        width: 'auto',
                        margin: 'auto'
                      }}
                      src={item.images[0].image}
                      alt="cart is empty"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom variant="p" component="h5" align="left" color="secondary" sx={{flex: 1}}>
                      {item.title}
                    </Typography>
                    <Typography gutterBottom variant="caption" component="p" align="left" color="secondary" sx={{flex: 1}}>
                      QTY: {item.quantity}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="h6" align="left" color="primary" sx={{flex: 1}}>
                      {'$'}{item.price} <Typography color="secondary.light" component="del" >{'$'}{item.oldPrice}</Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={3} sx={{ display: 'flex' }}>
                    <IconButton onClick={() => removeItemHandler(item)} sx={{ margin: 'auto' }}>
                      <DeleteForeverIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      }
      </Box>
      {
        cart.cartItems.length !== 0 &&
        <React.Fragment>
          <Box>
            <List sx={{ flexGrow: 1, p: 2, '& hr:last-child': {display: 'none'}, '& .label-3 span': {fontWeight: 600} }}>
              {['Subtotal', 'Shipping', 'Tax', 'Total'].map((text, index) => (
                <React.Fragment key={text}>
                  <ListItem disablePadding>
                      <ListItemText className={`label-${index}`} sx={{textAlign: 'left'}} primary={text} />
                      {
                        text[index] === text[0] &&
                        <ListItemText sx={{textAlign: 'right'}} primary={`$${subTotal}`} />
                      }
                      {
                        text[index] === text[1] &&
                        <ListItemText sx={{textAlign: 'right'}} primary={shippingCost ? shippingCost === 0 ? 'free' : `$${shippingCost}` : '_'} />
                      }
                      {
                        text[index] === text[2] &&
                        <ListItemText sx={{textAlign: 'right'}} primary={`${taxCost}`} />
                      }
                      {
                        text[index] === text[3] &&
                        <ListItemText sx={{textAlign: 'right', '& .MuiTypography-root': {fontWeight: 600}}} primary={`$${((subTotal + shippingCost) * taxCount).toFixed(2)}`} />
                      }
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Box>
          <Box sx={{ display: 'flex', flexGrow: 0, width: '100%', '& a': {flex: 1, textDecoration: 'none'} }}>
            <Link sx={{ '&:hover p': {color: 'secondary.main'}, p: 2, backgroundColor: 'primary.main', color: 'primary.contrastText', display: 'flex', flexGrow: 1, textAlign: 'center' }} href="/cart" onClick={toggleDrawer(anchor, false)} passHref>
              <Typography sx={{ display: 'block', height: '100%', margin: 'auto' }} component="p">View Cart</Typography>
            </Link>
            <Link sx={{ '&:hover p': {color: 'primary.main'}, p: 2, backgroundColor: 'secondary.main', color: 'primary.contrastText', flex: 1, textAlign: 'center', display: 'flex' }} href="/checkout/personal-info" onClick={toggleDrawer(anchor, false)} passHref>
              <Typography sx={{ display: 'block', height: '100%', margin: 'auto' }} component="p">Checkout</Typography>
            </Link>
          </Box>
        </React.Fragment>
      }
    </React.Fragment>
  );

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
        {
          match ?
          <Badge onClick={toggleDrawer(anchor, true)} sx={{ 'span': {top:'50%', right:'-50%'} }} badgeContent={cart.cartItems.length > 0 ? cart.cartItems.length : "0"} color="secondary">
            <CartIcon color="secondary"/>
          </Badge>
          :
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={toggleDrawer(anchor, true)}
            color="inherit"
            sx={{ backgroundColor: theme.palette.badge.bgd, ml: 2 }}
          >
            <Badge sx={{ 'span': {top:'-20%', right:'-50%'} }} badgeContent={cart.cartItems.length > 0 ? cart.cartItems.length : "0"} color="secondary">
              <CartIcon color="secondary"/>
            </Badge>
          </IconButton>
        }
          <SwipeableDrawer
            anchor={anchor}
            open={drawerState[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
