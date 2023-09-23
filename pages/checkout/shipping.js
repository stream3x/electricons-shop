import React, { useContext, useState, useEffect } from 'react';
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
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import theme from '../../src/theme';
import { Store } from '../../src/utils/Store';
import CheckoutLayout from '../../src/layout/CheckoutLayout';
import CheckoutStepper from '../../src/components/CheckoutStepper';
import { FormControl, InputLabel, useMediaQuery } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import FormHelperText from '@mui/material/FormHelperText';
import { styled } from '@mui/material/styles';

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.default,
  border: 'thin solid lightGrey',
  borderLeft: '3px solid black',
}));

export default function Shipping() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { snack, cart, cart: {cartItems, addresses} } = state;
  const [value, setValue] = useState('Post Express');
  const [city, setCity] = useState('');
  const [store, setStore] = useState('');
  const [errors, setErrors] = useState({
    city: false,
    store: false
  });
  const [comment, setComment] = useState('');
  const matches = useMediaQuery('(min-width: 600px)');

  const handleChangeCity = (event) => {
    setCity(event.target.value);
  };

  const handleAddComment = (event) => {
    setComment(event.target.value);
  };

  const handleChangeStore = (event) => {
    setStore(event.target.value);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };
 
  const shippingCost = 5;
  const emptyShipping = cart.shipping && Object.keys(cart.shipping).length === 0;
  const emptyCartItems = Object.keys(cartItems).length === 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        shippingMethod: formOutput.get('shipping-method'),
        shippingAddress: formOutput.get('shipping-method') !== 'Electricons Store' ? addresses[Cookies.get('forInvoice')].address : 'null',
        shippingCity: formOutput.get('shipping-method') !== 'Electricons Store' ? addresses[Cookies.get('forInvoice')].city : formOutput.get('shiping-city'),
        store: formOutput.get('shipping-method') !== 'Electricons Store' ? 'null' : formOutput.get('shiping-store'),
        comment: formOutput.get('shiping-comment') !== null ? formOutput.get('shiping-comment') : ''
      };
      if(emptyCartItems) {
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'sorry, first you must select product', severity: 'warning'}});
        router.push('/');
        return;
      }
      if(formData.shippingMethod === 'Electricons Store' && city === '') {
        setErrors({ ...errors, city: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'please select city', severity: 'warning'}});
        return;
      }
      if(formData.store === '' && formData.shippingMethod === 'Electricons Store') {
        setErrors({ ...errors, store: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'please select store', severity: 'warning'}});
        return;
      }
      dispatch({ type: 'SHIPPING', payload: formData });
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully added shipping', severity: 'success'}});
      Cookies.set('shipping', JSON.stringify(formData));
      router.push('/checkout/payment');
  };

  useEffect(() => {
    !emptyShipping ? setValue(cart.shipping.shippingMethod) : setValue('Post Express');
    !emptyShipping ? setCity(cart.shipping.shippingCity) : setCity('');
    !emptyShipping ? setStore(cart.shipping.store) : setStore('');
  }, [cart.shipping]);

  return (
    <CheckoutLayout>
      <CheckoutStepper activeStep={2} />
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
                        aria-labelledby="controlled-radio-buttons-group"
                        name="shipping-method"
                        value={value}
                        onChange={handleChange}
                        >
                          <LabelButton sx={{width: { xs: '100%', sm: 'auto'}, my: .5, display: 'flex', justifyContent: 'space-between', p: 1.5}}>
                            <FormControlLabel sx={{'& span': {fontSize: {xs: '12px', sm: '1rem'}}, textAlign: 'left' }} color="secondary" value="Post Express" control={<Radio />} label="POST Express" />
                            <Typography align="left" component="span" variant={!matches ? "caption" : "body2"}>
                              Delivery in 2 - 3 days!
                            </Typography>
                            <Typography component="span" variant="body">
                              {shippingCost ? `$${shippingCost}` : 'Free'}
                            </Typography>
                          </LabelButton>
                          <LabelButton sx={{width: { xs: '100%', sm: 'auto'}, my: .5, display: 'flex', justifyContent: 'space-between', p: 1.5}}>
                            <FormControlLabel sx={{'& span': {fontSize: {xs: '12px', sm: '1rem'}}, textAlign: 'left' }} value="DHL" control={<Radio />} label="DHL" />
                            <Typography align="left" component="span" variant={!matches ? "caption" : "body2"}>
                              Delivery in 2 - 5 days!
                            </Typography>
                            <Typography component="span" variant="body">
                              {shippingCost ? `$${shippingCost * 1.8}` : 'Free'}
                            </Typography>
                          </LabelButton>
                          <LabelButton sx={{width: { xs: '100%', sm: 'auto'}, my: .5, display: 'flex', justifyContent: 'space-between', p: 1.5}}>
                            <FormControlLabel sx={{'& span': {fontSize: {xs: '12px', sm: '1rem'}}, textAlign: 'left' }} value="Electricons Store" control={<Radio />} label="Electricons Store" />
                            <Typography align="left" component="span" variant={!matches ? "caption" : "body2"}>
                              Pick up in-store
                            </Typography>
                            <Typography component="span" variant="body">
                              Free
                            </Typography>
                          </LabelButton>
                        </RadioGroup>
                      </FormControl>
                      {
                        value === 'Electricons Store' &&
                        <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                          <FormControl sx={{ m: 1, minWidth: 80 }}>
                            <InputLabel id="select-label-city">City</InputLabel>
                            <Select
                              name="shiping-city"
                              labelId="select-label-city"
                              id="select-autowidth"
                              value={city}
                              onChange={handleChangeCity}
                              autoWidth
                              label="City"
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              <MenuItem value="Москва">Москва</MenuItem>
                              <MenuItem value="London">London</MenuItem>
                              <MenuItem value="Paris">Paris</MenuItem>
                            </Select>
                            {
                              errors.city && 
                              <FormHelperText error>{snack.city ? snack.city : 'please select city'}</FormHelperText>
                            }
                          </FormControl>
                          {
                            city === "Москва" &&
                            <FormControl sx={{ m: 1, minWidth: 80 }}>
                              <InputLabel id="select-label-store">Store</InputLabel>
                              <Select
                                name="shiping-store"
                                labelId="select-label-store"
                                id="simple-select-store"
                                value={store}
                                onChange={handleChangeStore}
                                autoWidth
                                label="Store"
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value="Електриконс пр. Ленина, 30А, Балашиха">Електриконс пр. Ленина, 30А, Балашиха</MenuItem>
                                <MenuItem value="Електриконс Тверская улица, 12">Електриконс Тверская улица, 12</MenuItem>
                                <MenuItem value="Талалихина ул. 41 строение 4">Талалихина ул. 41 строение 4</MenuItem>
                              </Select>
                              {
                                errors.store && 
                                <FormHelperText error>{snack.store ? snack.store : 'please select store'}</FormHelperText>
                              }
                            </FormControl>
                          }
                          {
                            city === "London" &&
                            <FormControl sx={{ m: 1, minWidth: 80 }}>
                              <InputLabel id="select-label-store">Store</InputLabel>
                              <Select
                                name="shiping-store"
                                labelId="select-label-store"
                                id="simple-select-store"
                                value={store}
                                onChange={handleChangeStore}
                                autoWidth
                                label="Store"
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value="Electricons Staines Rd, Hounslow TW4 5DS">Electricons Staines Rd</MenuItem>
                                <MenuItem value="Electricons Prince Ave, Westcliff-on-Sea, Southend-on-Sea SS0 0JP">Prince Ave, Westcliff-on-Sea</MenuItem>
                                <MenuItem value="Electricons Windsor Rd, Englefield Green, Windsor SL4 2JL">Windsor Rd, Englefield Green</MenuItem>
                              </Select>
                            </FormControl>
                          }
                          {
                            city === "Paris" &&
                            <FormControl sx={{ m: 1, minWidth: 80 }}>
                              <InputLabel id="select-label-store">Store</InputLabel>
                              <Select
                                name="shiping-store"
                                labelId="select-label-store"
                                id="simple-select-store"
                                value={store}
                                onChange={handleChangeStore}
                                autoWidth
                                label="Store"
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value="Electricons 701 Av. du Général Leclerc, 92100 Boulogne-Billancourt">Electricons 701 Av. du Général Leclerc</MenuItem>
                                <MenuItem value="Electricons Rue André Citroën, 78140 Vélizy-Villacoublay">Electricons Rue André Citroën</MenuItem>
                                <MenuItem value="Electricons 6 ALLEE BUISSONNIERE">Electricons 6 ALLEE BUISSONNIERE</MenuItem>
                              </Select>
                            </FormControl>
                          }
                        </Box>
                      }
                  </Grid>
                  <Grid item xs={12}>
                    <Typography align="left">
                    If you would like to add a comment about your order, please write it in the field below.
                    </Typography>
                    <TextareaAutosize
                      value={cart.shipping && cart.shipping.comment ? cart.shipping.comment : comment}
                      onChange={handleAddComment}
                      disabled={cart.shipping && cart.shipping.comment}
                      name="shiping-comment"
                      maxRows={10}
                      minRows={4}
                      aria-label="empty textarea"
                      style={{ width: '100%', resize: 'vertical', padding: '8px' }}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, '&:hover': {backgroundColor: theme.palette.secondary.main} }}
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