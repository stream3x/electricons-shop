import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import Link from '../../src/Link';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import theme from '../../src/theme';
import { Store } from '../../src/utils/Store';
import CheckoutLayout from '../../src/components/CheckoutLayout';
import CheckoutStepper from '../../src/components/CheckoutStepper';
import { FormControl } from '@mui/material';

export default function Payment() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart: {cartItems, personalInfo, addresses, shipping, payment} } = state;
  const [value, setValue] = React.useState('dina-card');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    payment ? setValue(payment.paymentMethod) : setValue('dina-card')
  }, [payment]);
  

  const emptyPersonalInfo = Object.keys(personalInfo).length === 0;
  const emptyAddresses = Object.keys(addresses).length === 0;
  const emptyShipping = Object.keys(shipping).length === 0;
  const emptyCartItems = Object.keys(cartItems).length === 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        paymentMethod: formOutput.get('payment-method')
      };
      if(emptyCartItems) {
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'sorry you must first select product', severity: 'warning'}});
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
      dispatch({ type: 'PAYMENT', payload: formData});
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully added payment method', severity: 'success'}});
      Cookies.set('payment', JSON.stringify(formData));
      router.push('/checkout/placeorder');
  };  

  return (
    <CheckoutLayout>
      <CheckoutStepper activeStep={3} />
      <ThemeProvider theme={theme}>
        <Container component="div" maxWidth="xl">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                <Grid container spacing={2}>
                  <Grid align="left" item xs={12}>
                    <FormControl sx={{width: '100%'}}>
                      <RadioGroup
                        aria-labelledby="buttons-group"
                        name="payment-method"
                        value={value}
                        onChange={handleChange}
                        >
                          <Box sx={{backgroundColor: theme.palette.secondary.borderColor, px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', my: 1}}>
                          <FormControlLabel sx={{width: '200px'}} color="secondary" value="paycheck" control={<Radio />} label="Pay by Check" />
                          </Box>
                          <Box sx={{backgroundColor: theme.palette.secondary.borderColor, px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', my: 1}}>
                          <FormControlLabel sx={{width: '200px'}} color="secondary" value="master-card" control={<Radio />} label="Pay by Master Card" />
                          </Box>
                          <Box sx={{backgroundColor: theme.palette.secondary.borderColor, px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', my: 1}}>
                          <FormControlLabel sx={{width: '200px'}} color="secondary" value="dina-card" control={<Radio />} label="Pay by Dina Card" />
                          </Box>
                          <Box sx={{backgroundColor: theme.palette.secondary.borderColor, px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', my: 1}}>
                            <FormControlLabel sx={{width: '200px'}} value="paypal" control={<Radio />} label="PayPal" />
                          </Box>
                        </RadioGroup>
                      </FormControl>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Continue
                </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </CheckoutLayout>
  );
}