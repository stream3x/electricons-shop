import React, { useState, useEffect, useContext, useRef } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '../../src/Link';
import ReplyIcon from '@mui/icons-material/Reply';
import theme from '../../src/theme';
import CheckIcon from '@mui/icons-material/Check';
import Fab from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';
import CartIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Guest from '../../models/Guest';
import db from '../../src/utils/db';
import { Card, CardContent, Divider, Grid, Paper } from '@mui/material';
import styled from '@emotion/styled';
import CartTotal from '../../src/components/CartTotal';
import OrderItems from '../../src/components/OrderItems';
import { usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { PayPalButtons } from '@paypal/react-paypal-js';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const PaymentButton = styled(LoadingButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.palette.addToCartButtonShape.borderRadius,
  marginTop: 15,
  padding: '.5em 2em',
  '&:hover': {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.secondary.main,
  }
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.white,
  border: 'thin solid lightGrey',
  borderLeft: '5px solid black',
}));

function GuestOrder(props) {
  const { order_number, order_id, order_address, order_user_name, paid, delivered, order_items, order_country, order_city, order_postalcode, order_phone, shippingMethod, shippingCost, taxCost, total, payment_method } = props;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = useRef();
  const router = useRouter();
  const [{isPending}, paypalDispatch] = usePayPalScriptReducer();

  const buttonSx = {
    ...(success && {
      bgcolor: theme.palette.success,
    }),
  };

  useEffect(() => {
    handleButtonClick();
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
  };

  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: total.toFixed(2) }
        }
      ]
    }).then((orderID) => {
      return orderID;
    });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function(details) {
      try {
        const {data} = await axios.put(`/api/guest/${order._id}/pay`, details, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        dispatch({type: 'SNACK_MESSAGE', payload: {...state.snack, message: 'paid successfuly', severity: 'success'}});
      } catch (error) {
        dispatch({type: 'SNACK_MESSAGE', payload: {...state.snack, message: error ? error.response.data : error , severity: 'error'}});
      }
    })
  }

  function onError(error) {
    dispatch({type: 'SNACK_MESSAGE', payload: {...state.snack, message: error ? error.response.data : error , severity: 'error'}});
  }

  useEffect(() => {
    const loadPayPalScript = async () => {
      const {data: clientId} = await axios.get('/api/keys/paypal', {
        headers: {
          "Content-Type": "application/json"
        }
      });
      paypalDispatch({type: 'resetOptions', value: {
        'client-id': clientId,
        currency: 'USD'
      },
    });
      paypalDispatch({type: 'setLoadingStatus', value: 'pending'});
    }
    loadPayPalScript();
  
  }, [order_id])

  return (
      <Box sx={{ my: 5, '& a': {textDecoration: 'none' }, '&:hover a': {textDecoration: 'none' } }}>
        <LabelButton sx={{width: '100%', my: 5, p: 2}}>
          <Box sx={{ m: 1, position: 'relative' }}>
            <Fab
              aria-label="save"
              color="primary"
              sx={buttonSx}
              onClick={handleButtonClick}
            >
              {success ? <CheckIcon /> : <CartIcon />}
            </Fab>
            {loading && (
              <CircularProgress
                size={68}
                sx={{
                  color: theme.palette.success,
                  position: 'absolute',
                  top: -6,
                  left: -6,
                  zIndex: 1,
                }}
              />
            )}
            </Box>
          <Typography sx={{m: 0, p: 1, fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h5" component="h1" gutterBottom>
            Thank you. Your order has been created.
          </Typography>
        </LabelButton>
        <Grid container space={2}>
          <Grid xs={12} lg={8}>
            <Item elevation={0}>
              <Card variant="outlined">
                <CardContent>
                  <OrderItems order_items={order_items}/>
                </CardContent>
              </Card>
            </Item>
          </Grid>
          <Grid xs={12} lg={4}>
            <Item elevation={0}>
              <CartTotal
               paid={paid}
               delivered={delivered}
               order_items={order_items}
               shippingMethod={shippingMethod}
               shippingPrice={shippingCost}
               taxToPaid={taxCost}
               payment_method={payment_method}
               />
            </Item>
            <Item elevation={0}>
            {
              !paid ?
              <PaymentButton fullWidth loading={isPending} loadingPosition="start">Pay Order</PaymentButton>
              :
              payment_method === 'PayPal' ?
              <PayPalButtons
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
              ></PayPalButtons>
              : 
              <PaymentButton fullWidth loading={isPending} loadingPosition="start">Pay By Dina Card</PaymentButton>
            }
            </Item>
          </Grid>
        </Grid>
        <Grid container space={2}>
          <Grid xs={12} lg={6}>
            <Item elevation={0}>
              <Box sx={{ minWidth: 275 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography sx={{textAlign: 'left', pb: 1}} variant="h5" component="h3">
                      Payment{bull}Info
                    </Typography>
                    <Divider />
                    <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }} color="secondary" gutterBottom>
                      <Typography component="span">Order number:</Typography>
                      <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">{order_number}</Typography>
                    </Typography>
                    <Divider />
                    <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
                    <Typography component="span">Order ID:</Typography>
                      <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">{order_id}</Typography>
                    </Typography>
                    <Divider />
                    <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
                      <Typography align="left" component="span">Name of account owner: </Typography>
                      <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">
                        Electricons Phd
                      </Typography>
                    </Typography>
                    <Divider />
                    <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
                      <Typography align="left" component="span">Aaccount number: </Typography>
                      <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">
                        980-555062201787-58
                      </Typography>
                    </Typography>
                    <Divider />
                    <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
                      <Typography align="left" component="span">Model: </Typography>
                      <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">
                        {order_number}
                      </Typography>
                    </Typography>
                    <Divider />
                    <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
                      <Typography align="left" component="span">Bank name: </Typography>
                      <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">
                        Banka Postanska Stedionica
                      </Typography>
                    </Typography>
                    <Divider />
                    <Typography align="left" sx={{pt: 2}} color="secondary" gutterBottom>
                      <Typography align="left" sx={{ fontSize: 14 }} variant="h6" component="span">
                        Your order will be sent as soon as we receive payment.
                      </Typography>
                      <Typography align="left" sx={{ fontSize: 14 }} variant="h6" component="p">
                      The deadline for payment is 5 days from the creation of the order.
                      </Typography>
                      <Typography align="left" sx={{ fontSize: 14 }} variant="body" component="p">
                      If you have questions, comments or concerns, please contact our expert customer support team.
                      </Typography>
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Item>
          </Grid>
          <Grid xs={12} lg={6}>
            <Item elevation={0}>
              <Box sx={{ minWidth: 275 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography sx={{textAlign: 'left', pb: 1}} variant="h5" component="h3">
                      Customer{bull}Info
                    </Typography>
                    <Divider />
                    <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }} color="secondary" gutterBottom>
                      <Typography component="span">Name:</Typography>
                      <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">{order_user_name}</Typography>
                    </Typography>
                    <Divider />
                    <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
                    <Typography component="span">Address:</Typography>
                      <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">
                        {order_address}
                      </Typography>
                    </Typography>
                    <Divider />
                    <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
                    <Typography component="span">City:</Typography>
                      <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">
                        {order_city}
                      </Typography>
                    </Typography>
                    <Divider />
                    <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
                    <Typography component="span">Postal Code:</Typography>
                      <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">
                        {order_postalcode}
                      </Typography>
                    </Typography>
                    <Divider />
                    <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
                    <Typography component="span">Country:</Typography>
                      <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">{order_country}</Typography>
                    </Typography>
                    <Divider />
                    <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
                    <Typography component="span">Phone:</Typography>
                      <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">{order_phone}</Typography>
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Item>
          </Grid>
        </Grid>
        <Item elevation={0} sx={{display: 'flex'}}>
          <Link href="/" passHref>
            <Button sx={{'&:hover': {backgroundColor: theme.palette.secondary.main}}} size="large" variant="contained" startIcon={<ReplyIcon />}>
              back to shop
            </Button>
          </Link>
        </Item>
      </Box>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;
  await db.connect();
  const guest_order = await Guest.findById(id);
  await db.disconnect();

  function replacer(key, value) {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from([...value]),
      };
    } else {
      return value;
    }
  }

  function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  const org_value = JSON.stringify(guest_order.orderItems, replacer);
  const newValue = JSON.parse(org_value, reviver);

  return {
    props: {
      order_id: guest_order._id.toString(),
      order_address: guest_order.addresses.address.toString(),
      order_country: guest_order.addresses.country.toString(),
      order_city: guest_order.addresses.city.toString(),
      order_postalcode: guest_order.addresses.postalcode.toString(),
      order_phone: guest_order.addresses.phone.toString(),
      order_user_name: guest_order.personalInfo.name.toString(),
      order_number: guest_order.orderNumber,
      payment_method: guest_order.payment.paymentMethod.toString(),
      order_items: newValue,
      paid: guest_order && guest_order.isPaid.toString(),
      delivered: guest_order && guest_order.isDelevered ? guest_order.isDelevered.toString() : null,
      shippingMethod: guest_order && guest_order.shipping.shippingMethod,
      shippingCost: guest_order && guest_order.shippingCost,
      taxCost: guest_order && guest_order.taxCost,
      total: guest_order && guest_order.total
    },
  };
}

export default dynamic(() => Promise.resolve(GuestOrder), { ssr: false });