import React, { useContext, useState } from 'react';
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
import { FormControl, InputLabel } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import FormHelperText from '@mui/material/FormHelperText';

export default function Shipping() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo, snack, cart: {cartItems, personalInfo, addresses, shipping} } = state;
  const [value, setValue] = React.useState('postexpress');
  const [city, setCity] = React.useState('');
  const [store, setStore] = React.useState('');
  const [errors, setErrors] = useState({
    city: false,
    store: false
  });

  const handleChangeCity = (event) => {
    setCity(event.target.value);
  };

  const handleChangeStore = (event) => {
    setStore(event.target.value);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };
 
  const shippingCost = 50;
  const emptyPersonalInfo = Object.keys(personalInfo).length === 0;
  const emptyUserInfo = userInfo === null;
  const emptyshipping = Object.keys(shipping).length === 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        shipingMethod: formOutput.get('shiping-method'),
        shippingCity: formOutput.get('shiping-city'),
        store: formOutput.get('shiping-store'),
        comment: formOutput.get('shiping-comment')
      };
      if(formData.shippingCity === '') {
        setErrors({ ...errors, city: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'please select city', severity: 'warning'}});
        return;
      }
      if(formData.store === '') {
        setErrors({ ...errors, store: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'please select store', severity: 'warning'}});
        return;
      }
      console.log(formData)
      // dispatch({ type: 'SHIPPING', payload: formData});
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully added shipping', severity: 'success'}});
      // Cookies.set('shipping', JSON.stringify(formData));
      if(cartItems.length !== 0) {
        router.push('/checkout/payment');
      }else {
        router.push('/');
      }
  };
  
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
                        name="shiping-method"
                        value={value}
                        onChange={handleChange}
                        >
                          <Box sx={{backgroundColor: theme.palette.secondary.borderColor, px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', my: 1}}>
                          <FormControlLabel sx={{width: '200px'}} color="secondary" value="postexpress" control={<Radio />} label="POST Express" />
                          <Typography>
                            Delivery next day!
                          </Typography>
                          <Typography>
                            {shippingCost ? `$${shippingCost}` : 'Free'}
                          </Typography>
                          </Box>
                          <Box sx={{backgroundColor: theme.palette.secondary.borderColor, px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', my: 1}}>
                            <FormControlLabel sx={{width: '200px'}} value="dhl" control={<Radio />} label="DHL" />
                            <Typography align="left">
                              Delivery in 2 days!
                            </Typography>
                            <Typography>
                              {shippingCost ? `$${shippingCost}` : 'Free'}
                            </Typography>
                          </Box>
                          <Box sx={{backgroundColor: theme.palette.secondary.borderColor, px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', my: 1}}>
                            <FormControlLabel sx={{width: '200px'}} value="store" control={<Radio />} label="Electricons Store" />
                            <Typography>
                              Pick up in-store
                            </Typography>
                            <Typography>
                              {'Free'}
                            </Typography>
                          </Box>
                        </RadioGroup>
                      </FormControl>
                      {
                        value === 'store' &&
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
                              <MenuItem value={10}>Moscow</MenuItem>
                              <MenuItem value={21}>London</MenuItem>
                              <MenuItem value={22}>Paris</MenuItem>
                            </Select>
                            {
                              errors.city && 
                              <FormHelperText error>{snack.city ? snack.city : 'please select city'}</FormHelperText>
                            }
                          </FormControl>
                          {
                            city === 10 &&
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
                                <MenuItem value={10}>Electricons Balasiha</MenuItem>
                                <MenuItem value={21}>Electricons 2</MenuItem>
                                <MenuItem value={22}>Electricons 3</MenuItem>
                              </Select>
                              {
                                errors.store && 
                                <FormHelperText error>{snack.store ? snack.store : 'please select store'}</FormHelperText>
                              }
                            </FormControl>
                          }
                          {
                            city === 21 &&
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
                                <MenuItem value={10}>Electricons 4</MenuItem>
                                <MenuItem value={21}>Electricons Pickadily</MenuItem>
                                <MenuItem value={22}>Electricons 5</MenuItem>
                              </Select>
                            </FormControl>
                          }
                          {
                            city === 22 &&
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
                                <MenuItem value={10}>Electricons 6</MenuItem>
                                <MenuItem value={21}>Electricons Louvre</MenuItem>
                                <MenuItem value={22}>Electricons 8</MenuItem>
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
                      name="shiping-comment"
                      maxRows={10}
                      minRows={4}
                      aria-label="empty textarea"
                      style={{ width: '100%', resize: 'vertical' }}
                    />
                  </Grid>
                </Grid>
            {
              emptyshipping ?
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Continue
                </Button>
                :
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
            }
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </CheckoutLayout>
  );
}