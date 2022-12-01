import { useEffect, useContext } from 'react';
import { Box, Button, Typography } from '@mui/material'
import { styled, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import { Store } from '../../src/utils/Store';
import Link from '../../src/Link';
import theme from '../../src/theme';
import OrderItems from '../../src/components/OrderItems';
import CheckoutLayout from '../../src/components/CheckoutLayout';
import PaymentInstruction from '../../src/components/PaymentInstruction';
import dynamic from 'next/dynamic';
import axios from 'axios';

export async function getServerSideProps({ params }) {
  return { props : { params } };
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  }));

function Order({ params }) {
  const orderId = params.id;
  const { state } = useContext(Store);
  const { order, cart: {cartItems, payment} } = state;

  useEffect(() => {

    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`
          }
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'SNACK_MESSAGE', payload: getError(error) });
      }
    };

    if(!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  
    return () => {
      console.log('unmount');
    };

  }, []);
  

  return (
    <CheckoutLayout>
      <ThemeProvider theme={theme}>
        <Box sx={{ my: 4 }}>
          <Grid container space={2}>
            <Grid xs={12}>
              <Item elevation={0}>
                <OrderItems />
              </Item>
            </Grid>
            <Grid xs={12}>
            {
              payment.paymentMethod === "Pay by Check" && cartItems.length !== 0 &&
              <Item elevation={0}>
                <PaymentInstruction />
              </Item>
              }
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </CheckoutLayout>
  )
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });