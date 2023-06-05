import { Box, Button, Typography } from '@mui/material'
import { styled, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import { useContext } from 'react';
import { Store } from '../../src/utils/Store';
import theme from '../../src/theme';
import OrderItems from '../../src/components/OrderItems';
import CheckoutLayout from '../../src/layout/CheckoutLayout';
import CheckoutStepper from '../../src/components/CheckoutStepper';
import PaymentInstruction from '../../src/components/PaymentInstruction';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  }));

  export default function Placeorder() {
  const { state } = useContext(Store);
  const { cart: {cartItems, payment} } = state;
  
  return (
    <CheckoutLayout>
      <CheckoutStepper activeStep={4} />
      <ThemeProvider theme={theme}>
        <Box sx={{ my: 4 }}>
          <Grid container space={2}>
            <Grid xs={12}>
              <Item elevation={0}>
                <OrderItems order_items={cartItems} />
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