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
import { onError } from '../../src/utils/error';
import dynamic from 'next/dynamic';
import { usePayPalScriptReducer } from '@paypal/react-paypal-js';

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

function Order({params}) {
  const orderId = params.id;
  const [{isPending}, paypalDispatch] = usePayPalScriptReducer();
  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = useRef();
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

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
    if (!loading) {
      setSuccess(false);
      setLoader(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoader(false);
      }, 2000);
    }
  };

  useEffect(() => {
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

    if(!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }else {
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
    }
  
    return () => {
      console.log('return something in order');
    };

  }, [order]);
  
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
            {loader && (
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
            Thank you. Your order has been received.
          </Typography>
        </LabelButton>
        <Box sx={{m: 2}}>
          <Typography sx={{m: 0, p: 1}} variant="h5" component="h1" gutterBottom>
            Order {order._id}
          </Typography>
          <Typography sx={{m: 0, p: 1}} variant="h5" component="p" gutterBottom>
            {addresses && addresses.address}
          </Typography>
          <Typography sx={{m: 0, p: 1}} variant="h5" component="p" gutterBottom>
            {shipping && shipping.shippingAddress}
          </Typography>
          <Typography sx={{m: 0, p: 1}} variant="h5" component="p" gutterBottom>
            {payment && payment.paymentMethod}
          </Typography>
        </Box>
        <Link href="/" passHref>
          <Button sx={{'&:hover': {backgroundColor: theme.palette.secondary.main}}} size="large" variant="contained" startIcon={<ReplyIcon />}>
            back to shop
          </Button>
        </Link>
      </Box>
  );
}

export async function getServerSideProps({params}) {
  return { props: { params }};
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });