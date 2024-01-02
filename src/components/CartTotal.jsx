import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Checkbox, Divider, FormControlLabel, FormHelperText, Grid, Chip, Tooltip } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import Link from '../Link';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import theme from '../theme';
import Cookies from 'js-cookie';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    {"•"}
  </Box>
);

const randomNumber = getRandomInt(1, 999999);

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

const date = new Date().getFullYear();

export default function CartTotal({
  order_items,
  paid,
  delivered,
  shippingMethod,
  shippingPrice,
  taxToPaid,
  payment_method
}) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const userInf0 = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const { snack, cart: {cartItems, personalInfo, shipping, addresses, payment, cupon_discount} } = state;
  const subTotal = order_items ? order_items.reduce((a, c) => a + c.quantity * c.price, 0) : cartItems.reduce((a, c) => a + c.quantity * c.price, 0);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkedPolicy, setCheckedPolicy] = useState(false);
  const [checkedNewsletter, setCheckedNewsletter] = useState(false);
  const [errors, setErrors] = useState({
    policy: false,
  });

  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    
    setOrderNumber(
      `${date}-${randomNumber}`
    )
  }, [date]);
  
  const emptyPersonalInfo = Object.keys(personalInfo).length === 0;
  const emptyUserInfo = userInf0 !== null ? Object.keys(userInf0).length === 0 : true;
  const emptyAddresses = Object.keys(addresses).length === 0;
  const emptyShipping = Object.keys(shipping).length === 0;
  const emptyCartItems = Object.keys(cartItems).length === 0;
  const emptyPayment = payment && Object.keys(payment).length === 0;
  const emptyCupon = cupon_discount && Object.keys(cupon_discount).length === 0;

  const handleLoading = () => {
    setLoading(true);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const shippingCost = shipping.shippingMethod !== 'Electricons Store' ? (shipping.shippingMethod === 'DHL' ? 5 * 2.8 : 5) : 0;
  let taxCost;
  let taxCount;

  if(cartItems?.map(item => item.quantity).reduce((total, number) => total + number, 0) < 3) {
    taxCost = '20%'
    taxCount = 1.3333
  }else {
    taxCost = '12%'
    taxCount = 1.12;
  }

  const total = ((subTotal + (!emptyShipping ? shippingCost : 0)) * (!emptyCupon ? Number(1 - cupon_discount) : 1) * taxCount).toFixed(2);

  const cartItemsWithSlug = cartItems.map((item) => ({
    ...item,
    slug: item.slug,
    hasRated: false // Make sure 'slug' property exists in each cart item
  }));
  const address_invoice = userInf0 && addresses?.length !== 0 && addresses[0][Cookies.get('forInvoice')];

  async function placeOrderHandler() {
    if(emptyCartItems) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'sorry, first you must select product', severity: 'warning'}});
      router.push('/');
      return;
    }
    if(emptyPersonalInfo) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the personal info step has not been completed', severity: 'warning'}});
      router.push('/checkout/personal-info');
      return;
    }
    if(emptyAddresses) {
      if (address_invoice?.address && address_invoice?.city && address_invoice?.phone && address_invoice?.postalcode && address_invoice?.country) {
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the address step has not been completed', severity: 'warning'}});
        router.push('/checkout/addresses');
        return;
      }
    }
    if(emptyShipping) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the shipping method step has not been completed', severity: 'warning'}});
      router.push('/checkout/shipping');
      return;
    }
    if(emptyPayment) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the payment method has not been completed', severity: 'warning'}});
      router.push('/checkout/payment');
      return;
    }
    if(!checkedPolicy) {
      setErrors({ ...errors, policy: true});
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'accept by checking the box', severity: 'error'}});
      return;
    }
    if(!total && !shippingCost && !taxCost && !orderNumber) {
      setErrors({ ...errors, policy: true});
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the order has not been completed', severity: 'error'}});
      return;
    }
    try {
      handleLoading();
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItemsWithSlug,
        personalInfo,
        addresses: addresses[0][Cookies.get('forInvoice') ? JSON.parse(Cookies.get('forInvoice')) : 0],
        shipping,
        payment,
        total,
        shippingCost,
        taxCost,
        orderNumber,
        checkedNewsletter
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      router.push(`/order/${data._id}`);
      setLoading(false);
      dispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'SHIPPING_REMOVE' });
      dispatch({ type: 'PAYMENT', payload: {}});
      Cookies.remove('cartItems');
      Cookies.remove('payment');
      Cookies.remove('forInvoice');
      Cookies.remove('shipping');
    } catch (error) {
      setLoading(false);
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: error.message === '' ? 'Server Error' : error.message, severity: 'error' }});
    }
  }

  async function placeGuestOrderHandler() {
    if(emptyCartItems) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'sorry, first you must select product', severity: 'warning'}});
      dispatch({ type: 'PERSONAL_INFO', payload: {}});
      dispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'ADDRESSES_CLEAR' });
      dispatch({ type: 'SHIPPING_REMOVE' });
      dispatch({ type: 'PAYMENT', payload: {}});
      router.push('/');
      return;
    }
    if(emptyPersonalInfo) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the personal info step has not been completed', severity: 'warning'}});
      router.push('/checkout/personal-info');
      return;
    }
    if(emptyAddresses) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the address step has not been completed', severity: 'warning'}});
      router.push('/checkout/addresses');
      return;
    }
    if(emptyShipping) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the shipping method step has not been completed', severity: 'warning'}});
      router.push('/checkout/shipping');
      return;
    }
    if(emptyPayment) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the payment method has not been completed', severity: 'warning'}});
      router.push('/checkout/payment');
      return;
    }
    if(!checkedPolicy) {
      setErrors({ ...errors, policy: true});
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'accept by checking the box', severity: 'error'}});
      return;
    }
    try {
      handleLoading();
      const { data } = await axios.post('/api/guests', {
        orderItems: cartItemsWithSlug,
        personalInfo,
        addresses: addresses[Cookies.get('forInvoice') ? JSON.parse(Cookies.get('forInvoice')) : 0],
        shipping,
        payment,
        total,
        shippingCost,
        taxCost,
        orderNumber,
        checkedNewsletter
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      router.push(`/order_guest/${data._id}`);
      setLoading(false);
      dispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'PERSONAL_INFO', payload: {}});
      dispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'ADDRESSES_CLEAR' });
      dispatch({ type: 'SHIPPING_REMOVE' });
      dispatch({ type: 'PAYMENT', payload: {}});
      Cookies.remove('cartItems');
      Cookies.remove('payment');
      Cookies.remove('forInvoice');
      Cookies.remove('shipping');
      Cookies.remove('addresses');
    } catch (error) {
      setLoading(false);
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: error.message === '' ? 'Server Error' : error.message, severity: 'error' }});
    }
  }

  return (
    <Box sx={{ minWidth: 275 }}>
    {
      router.pathname !== '/checkout/placeorder' ?
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{textAlign: 'left', pb: 1}} variant="h5" component="h3">
            Cart{bull}Totals
          </Typography>
          <Divider />
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">subtotal: </Typography>
            <Typography variant="h6" component="span">${subTotal}</Typography>
          </Typography>
          {
          shipping.shippingMethod && 
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
              <Typography sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}} component="span">
                <Typography sx={{textAlign: 'left'}} component="span">shipping method: </Typography>
                <Tooltip title={shippingCost > 0 ? shipping.shippingAddress : shipping.store}><Chip color='primary' size='small' sx={{p: .5, ml: 1}} label={shippingCost > 0 ? 'delivery' : 'in store'} /></Tooltip>
              </Typography>
              <Typography sx={{textAlign: 'right'}} variant="h6" component="span">
              {shipping.shippingMethod}
              </Typography>
          </Typography>
          }
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">shipping: </Typography>
            {
              shippingPrice ?
              <Typography variant="h6" component="span">${shippingPrice}</Typography>
              :
              <Typography variant="h6" component="span">{!emptyShipping ? shippingCost === 0 ? 'free' : `$${shippingCost}` : '_'}</Typography>
            }
          </Typography>
          {
            paid &&
            <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
              <Typography component="span">paid status: </Typography>
              <Typography variant="h6" component="span">{paid ? "not paid" : "paid"}</Typography>
            </Typography>
          }
          {
            payment_method &&
            <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
              <Typography component="span">payment method: </Typography>
              <Typography variant="h6" component="span">{payment_method}</Typography>
            </Typography>
          }
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">cupon discount: </Typography>
            {
              !emptyCupon ?
              <Typography variant="h6" component="span">- {cupon_discount * 100}%</Typography>
              :
              <Typography variant="h6" component="span">{'_'}</Typography>
            }
          </Typography>
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">tax: {<Tooltip title="for more than 3 products you get a discount"><Chip color='secondary' size='small' sx={{p: .5, ml: 1}} label='CHEAPSKATE' /></Tooltip>} </Typography>
            {
              taxToPaid ?
              <Typography variant="h6" component="span">{taxToPaid}</Typography>
              :
              <Typography variant="h6" component="span">{subTotal !== 0 ? taxCost : '_'}</Typography>
            }
          </Typography>
          <Divider />
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">Total: </Typography>
              <Typography color="primary" variant="h6" component="span">
              ${total}
              </Typography>
          </Typography>
        </CardContent>
        {
          router.pathname.includes('checkout') &&
          <React.Fragment>
            <CardActions>
              <Button onClick={handleExpandClick} size="small">
                Show Deatalis
              </Button>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              {
                cartItems.map(row => (
                  <Box key={row._id} sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                    <Box sx={{width: '100px'}}>
                      <Box
                        component="img"
                        sx={{
                          height: 70,
                          display: 'block',
                          maxWidth: 100,
                          overflow: 'hidden',
                          width: 'auto',
                          margin: '5px auto'
                        }}
                        src={row.images[1].image}
                        alt={row.title}
                      />
                    </Box>
                    <Link href={`/product/${row.slug}`} passHref>
                      <Typography>{row.title}</Typography>
                    </Link>
                    <Typography sx={{p: 1}}>{`x ${row.quantity}`}</Typography>
                  </Box>
                ))
              }
              </CardContent>
            </Collapse>
          </React.Fragment>
        }
      </Card>
      :
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{textAlign: 'left', pb: 1}} variant="h5" component="h3">
            Order{bull}Details
          </Typography>
          <Divider />
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary.lightGrey" gutterBottom>
            <Typography component="span">order number: </Typography>
            <Typography variant="h6" component="span">{orderNumber}</Typography>
          </Typography>
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary.lightGrey" gutterBottom>
            <Typography component="span">date: </Typography>
            <Typography variant="h6" component="span">{`${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}`}</Typography>
          </Typography>
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary.lightGrey" gutterBottom>
            <Typography component="span">Payment method: </Typography>
            <Typography variant="h6" component="span">{`${!emptyPayment ? payment.paymentMethod : 'not set'}`}</Typography>
          </Typography>
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary.lightGrey" gutterBottom>
            <Typography component="span">Shipping method: </Typography>
            <Tooltip title={`${shipping.shippingAddress}`}><Typography variant="h6" component="span">{shipping.shippingMethod === 'Electricons Store' ? 'pick up in-store' : 'delivery'}</Typography></Tooltip>
          </Typography>
          {
            shipping.shippingMethod === 'Electricons Store' &&
            <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary.lightGrey" gutterBottom>
              <Typography align="left" component="span">Store address: </Typography>
              <Typography align="right" variant="h6" component="span">{`${shipping.store}, ${shipping.shippingCity}`}</Typography>
            </Typography>
          }
          {
            shipping.shippingMethod !== 'Electricons Store' &&
            <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary.lightGrey" gutterBottom>
              <Typography align="left" component="span">Shipping address: </Typography>
              <Typography align="right" variant="h6" component="span">{shipping.shippingMethod === 'Electricons Store' ? shipping.shippingCity + ', ' + shipping.store : shipping.shippingCity + ', ' + shipping.shippingAddress }</Typography>
            </Typography>
          }
          <Divider />
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">subtotal: </Typography>
            <Typography variant="h6" component="span">${subTotal} </Typography>
          </Typography>
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">shipping: </Typography>
            <Typography variant="h6" component="span">{shippingCost ? shippingCost === 0 ? 'free' : `$${shippingCost}` : '_'}</Typography>
          </Typography>
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">tax: {<Tooltip title="for more than 3 products you get a discount"><Chip size='small' color='secondary' sx={{p: .5, ml: 1}} label='CHEAPSKATE' /></Tooltip>} </Typography>
            <Typography variant="h6" component="span">{taxCost ? taxCost : '_'}</Typography>
          </Typography>
          <Divider />
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">Total: </Typography>
            <Typography color="primary" variant="h6" component="span">${total} </Typography>
          </Typography>
        </CardContent>
        <CardActions>
          <Grid container space={2}>
            <Grid align="left" item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    value={checkedNewsletter !== undefined ? "newsletter" : ''}
                    color="primary"
                    name="newsletter"
                    id="newsletter"
                    onChange={(e) => setCheckedNewsletter(e.target.checked)}
                  />
                }
                label="Sign up for our newsletter.
                You may unsubscribe at any moment."
              />
            </Grid>
            <Grid align="left" item xs={12} sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <FormControlLabel
                  sx={{mr: 0}}
                  control={
                  <Checkbox
                  value={checkedPolicy ? "policy" : "not-agree"}
                  color="primary"
                  name="policy"
                  required
                  onChange={(e) => setCheckedPolicy(e.target.checked)}
                  />
                }
                />
                <FormHelperText >
                  <Typography component="span">I agree to the terms and conditions and the privacy policy</Typography>
                  <Typography component="span" color="error"> *</Typography>
                </FormHelperText>
              </Box>
              {
                errors.policy && 
                <Box sx={{width: '100%'}}>
                  <FormHelperText error>{snack.message ? snack.message : 'accept by checking the box'}</FormHelperText>
                </Box>
              }
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, '&:hover': {backgroundColor: theme.palette.secondary.main} }}
                onClick={!emptyUserInfo && !emptyPersonalInfo ? placeOrderHandler : placeGuestOrderHandler}
              >
                Place Order
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    }
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
