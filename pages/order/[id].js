import React, { useState, useEffect, useContext, useRef, useReducer } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '../../src/Link';
import ReplyIcon from '@mui/icons-material/Reply';
import theme from '../../src/theme';
import styled from '@emotion/styled';
import CheckIcon from '@mui/icons-material/Check';
import Fab from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';
import CartIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Store } from '../../src/utils/Store';
import dynamic from 'next/dynamic';
import { usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Card, CardContent, Divider, Grid, Paper } from '@mui/material';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { LoadingButton } from '@mui/lab';
import OrderItems from '../../src/components/OrderItems';
import CartTotal from '../../src/components/CartTotal';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.white,
  border: 'thin solid lightGrey',
  borderLeft: '5px solid black',
}));

function reducer(state, action) {
  switch(action.type){
    case 'FETCH_REQUEST': return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS': return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL': return { ...state, loading: false, error: action.payload };
    default: return { ...state };
  }
}

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

function Order(props) {
  const { params } = props;
  const orderId = params.id;
  const userInf0 = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const { state: { personalInfo } } = useContext(Store);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [isPayPal, setIsPayPal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = useRef();
  const router = useRouter();
  const modelNumber = `${new Date().getFullYear()}-${userInf0?._id.substr(userInf0._id.length - 6)}`;

  const buttonSx = {
    ...(success && {
      bgcolor: theme.palette.success,
    }),
  };

  const [{loading, error, order}, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: ''
  });
  const {addresses, shipping, payment} = order;

  useEffect(() => {
    handleButtonClick();
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = () => {
    if (!loader) {
      setSuccess(false);
      setLoader(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoader(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if(!userInf0) {
      return router.push('/login');
    }
    const fetchOrder = async () => {
      try {
        dispatch({type: 'FETCH_REQUEST'});
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        dispatch({type: 'FETCH_SUCCESS', payload: data});
      } catch (error) {
        dispatch({type: 'FETCH_FAIL', payload: error});
      }
    };

    if(!order || (order && order._id !== orderId)) {
      fetchOrder();
    }else {
      const loadPayPalScript = async () => {
        const {data: clientId} = await axios.get('/api/keys/paypal', {
          headers: {
            "Content-Type": "application/json",
            autorization: `Bearer ${userInf0.token}`
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
    }
  
    return () => {
      console.log('return something in order');
      
    };
  }, [order]);

  useEffect(() => {
    paidType();
  }, [order])

  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: order.total.toFixed(2) }
        }
      ]
    }).then((orderID) => {
      return orderID;
    });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function(details) {
      try {
        dispatch({ type: 'PAY_REQIEST'});
        const { data } = await axios.put(`/api/guest/${order._id}/pay`, details, {
          headers: {
            "Content-Type": "application/json",
            autorization: `Bearer ${userInf0.token}`
          }
        })
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        dispatch({type: 'SNACK_MESSAGE', payload: {...state.snack, message: 'paid successfuly', severity: 'success'}});
      } catch (error) {
        dispatch({ type: 'PAY_FAIL', payload: { message: 'Payment fiald' } });
        dispatch({type: 'SNACK_MESSAGE', payload: {...state.snack, message: error ? error.response.data : error , severity: 'error'}});
      }
    })
  }

  function onError(error) {
    dispatch({type: 'SNACK_MESSAGE', payload: {...state.snack, message: error ? error.response.data : error , severity: 'error'}});
  }

  async function paidType() {
    const {payment} = await order;
    setIsPayPal(payment === "PayPal");
  }

  return (
    <Box sx={{ my: 5, '& a': {textDecoration: 'none' }, '&:hover a': {textDecoration: 'none' } }}>
    {
      error &&
      <LabelButton sx={{width: '100%', my: 5, p: 2, borderLeft: '5px solid red!important'}}>
          <Typography color="error" sx={{m: 0, p: 1, fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h5" component="h1" gutterBottom>
            {`${error}`}
          </Typography>
      </LabelButton>
    }
    {
      loading && loader ?
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
            </Box>
            <Typography sx={{m: 0, p: 1, fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h5" component="h1" gutterBottom>
              Thank you. Your order has been created.
            </Typography>
        </LabelButton>
      : (
        <React.Fragment>
            <LabelButton sx={{width: '100%', my: 5, p: 2}}>
              <Box sx={{ m: 1, position: 'relative' }}>
                <Fab
                  aria-label="save"
                  color="primary"
                  sx={buttonSx}
                  onClick={handleButtonClick}
                >
                  {<CartIcon />}
                </Fab>
                {
                  !success &&
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
                }
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
                    <OrderItems order_items={order.orderItems}/>
                  </CardContent>
                </Card>
              </Item>
            </Grid>
            <Grid xs={12} lg={4}>
              <Item elevation={0}>
                <CartTotal
                order_items={order.orderItems}
                paid={order.isPaid}
                delivered={order.isDelevered}
                shippingMethod={order.shippingMethod}
                shippingPrice={order.shippingMethod}
                taxToPaid={order.tax}
                payment_method={order.paymantMethod}
                 />
              </Item>
              <Item elevation={0}>
              {
                order.isPaid ?
                <PaymentButton fullWidth loading={isPending} loadingPosition="start">Pay Order</PaymentButton>
                :
                isPayPal ?
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
                        <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">{order.orderNumber}</Typography>
                      </Typography>
                      <Divider />
                      <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
                      <Typography component="span">Order ID:</Typography>
                        <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">{order._id}</Typography>
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
                          {modelNumber}
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
                        <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">{userInf0.name}</Typography>
                      </Typography>
                      <Divider />
                      <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
                      <Typography component="span">Address:</Typography>
                        <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">
                          {addresses && addresses.address}
                        </Typography>
                      </Typography>
                      <Divider />
                      <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
                      <Typography component="span">City:</Typography>
                        <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">
                        {addresses && addresses.city}
                        </Typography>
                      </Typography>
                      <Divider />
                      <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
                      <Typography component="span">Postal Code:</Typography>
                        <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">
                        {addresses && addresses.postalcode}
                        </Typography>
                      </Typography>
                      <Divider />
                      <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
                      <Typography component="span">Country:</Typography>
                        <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">{addresses && addresses.country}</Typography>
                      </Typography>
                      <Divider />
                      <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
                      <Typography component="span">Phone:</Typography>
                        <Typography sx={{fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h6" component="span">{addresses && addresses.phone}</Typography>
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Item>
            </Grid>
          </Grid>
        </React.Fragment>
        )
      }

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

export async function getServerSideProps({params}) {
  return { props: { params }};
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });