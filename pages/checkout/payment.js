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
import { styled } from '@mui/material/styles';

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.default,
  border: 'thin solid lightGrey',
  borderLeft: '3px solid black',
}));

export default function Payment() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart: {payment} } = state;
  const [value, setValue] = useState('');

  const emptyPayment = payment && Object.keys(payment).length === 0;

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    !emptyPayment ? setValue(payment.paymentMethod) : setValue(() => 'Dina Card')
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        paymentMethod: formOutput.get('payment-method')
      };
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
                          <LabelButton sx={{width: { xs: '100%', sm: 'auto'}, my: .5, display: 'flex', justifyContent: 'space-between', p: 1.5}}>
                          <FormControlLabel sx={{width: '200px'}} color="secondary" value="Pay by Check" control={<Radio />} label="Pay by Check" />
                          </LabelButton>
                          <LabelButton sx={{width: { xs: '100%', sm: 'auto'}, my: .5, display: 'flex', justifyContent: 'space-between', p: 1.5}}>
                          <FormControlLabel sx={{width: '200px'}} color="secondary" value="Master Card" control={<Radio />} label="Pay by Master Card" />
                          </LabelButton>
                          <LabelButton sx={{width: { xs: '100%', sm: 'auto'}, my: .5, display: 'flex', justifyContent: 'space-between', p: 1.5}}>
                          <FormControlLabel sx={{width: '200px'}} color="secondary" value="Dina Card" control={<Radio />} label="Pay by Dina Card" />
                          </LabelButton>
                          <LabelButton sx={{width: { xs: '100%', sm: 'auto'}, my: .5, display: 'flex', justifyContent: 'space-between', p: 1.5}}>
                            <FormControlLabel sx={{width: '200px'}} value="PayPal" control={<Radio />} label="PayPal" />
                          </LabelButton>
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