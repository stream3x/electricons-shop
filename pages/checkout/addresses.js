import React, { useContext, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import theme from '../../src/theme';
import { Store } from '../../src/utils/Store';
import CheckoutLayout from '../../src/layout/CheckoutLayout';
import CheckoutStepper from '../../src/components/CheckoutStepper';
import AddressCard from '../../src/assets/AddressCard';
import RadioGroup from '@mui/material/RadioGroup';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import RemoveIcon from '@mui/icons-material/Remove';

export default function Addresses() {
  const router = useRouter();
  const [addNewAddress, setAddNewAddress] = useState(false);
  const { state, dispatch } = useContext(Store);
  const { cart: { personalInfo, addresses, cartItems} } = state;
  const [error, setError] = React.useState(false);
  const [addressIndex, setAddressIndex] = useState(0);
  const [userInfo, setUserInfo] = useState([]);
  const [errors, setErrors] = useState({
    address: false,
    city: false,
    country: false,
    postalcode: false,
    phone: false
  });
  const pattern = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
  const [checked, setChecked] = useState(false);
  const [forInvoice, setForInvoice] = useState(Number(Cookies.get('forInvoice')) && Cookies.get('forInvoice') !== NaN ? Number(Cookies.get('forInvoice')) : 0);

  const handleNext = () => {
    Cookies.set('forInvoice', forInvoice);
    router.push('/checkout/shipping');
  };

  const handleTop = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    );

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
      });
    }
  };

  const handleChange = (event) => {
    setChecked(() => event.target.checked);
    if(!checked) {
      setForInvoice(() => Number(event.target.value));
      Cookies.set('forInvoice', Number(event.target.value));
      console.log('check');
    }else {
      setForInvoice(() => 0);
      Cookies.set('forInvoice', 0);
    }
  };  

  const handleChangeInvoice = (event) => {
    setForInvoice(() => Number(event.target.value));
    Cookies.set('forInvoice', Number(event.target.value));
  };

  const userInf0 = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const emptyPersonalInfo = personalInfo && Object.keys(personalInfo).length === 0;
  const emptyAddresses = addresses?.length === 0;
  const emptyCartItems = Object.keys(cartItems).length === 0;

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get('/api/users');
        const user = await data.find(items => items._id === userInf0._id);
        setUserInfo(user);
        dispatch({ type: 'ADDRESSES', payload: [...user.addresses] });
        Cookies.set('forInvoice', 0);
      } catch (error) {
        setError(true)
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        address: formOutput.get('address'),
        city: formOutput.get('city'),
        country: formOutput.get('country'),
        postalcode: formOutput.get('postalcode'),
        phone: formOutput.get('phone')
      };
      if(emptyCartItems) {
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'sorry, first you must select product', severity: 'warning'}});
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
        router.push('/');
        return;
      }
      if(formOutput.get('address') === '') {
        setErrors({ ...errors, address: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'please fill address', severity: 'warning'}});
        return;
      }
      if(formOutput.get('city') === '') {
        setErrors({ ...errors, city: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'city is required field', severity: 'warning'}});
        return;
      }
      if(!pattern.test(formData.phone)) {
        setErrors({ ...errors, phone: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the phone is not valid', severity: 'error'}});
        return;
      }
      if(formData.phone === '') {
        setErrors({ ...errors, phone: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the phone is required', severity: 'warning'}});
        return;
      }
      if(formOutput.get('country') === '') {
        setErrors({ ...errors, country: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the country is required', severity: 'warning'}});
        return;
      }
      if(formOutput.get('postalcode') === '') {
        setErrors({ ...errors, postalcode: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the postal code is required', severity: 'warning'}});
        return;
      }
      dispatch({ type: 'ADDRESSES', payload: { ...addresses, ...formData } });
      setAddNewAddress(false);
      handleTop(event);
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully added address', severity: 'success' } });
      Cookies.set('forInvoice', forInvoice);
      setErrors({ 
        ...errors, 
        address: false,
        city: false,
        country: false,
        postalcode: false,
        phone: false
      });
  };

  const handleEdit = (item, index) => {
    setAddressIndex(index);
    Cookies.set('forInvoice', JSON.stringify(addresses.length - 1));
    dispatch({ type: 'ADDRESSES_REMOVE', payload: item});
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'now you can edit address', severity: 'warning'}});
    setAddNewAddress(true);
  };
  const handleDelete = (item) => {
    Cookies.set('forInvoice', JSON.stringify(addresses.length - 1));
    dispatch({ type: 'ADDRESSES_REMOVE', payload: item});
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack,message: 'address successfully removed', severity: 'warning'}});
    if(emptyAddresses) {
      setAddNewAddress(true);
    }
  };

  return (
    <CheckoutLayout>
      <CheckoutStepper activeStep={1} />
        <ThemeProvider theme={theme}>
          <Container id='back-to-top-anchor' component="div" maxWidth="xl">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {
                !emptyAddresses ?
                <RadioGroup name="radio-address-picker" value={forInvoice} sx={{width: "100%"}} onChange={handleChangeInvoice}>
                  <Grid container space={2}>
                  {
                    (userInfo?.length !== 0 ? addresses[0] : addresses).map((address, index) => (
                      <Grid sx={{p: 2}} key={index} item xs={12} sm={6} md={4}>
                        <AddressCard index={index} addresses={address} personalInfo={personalInfo} name={userInf0 && userInf0.name} handleEdit={() => handleEdit(address, index)} handleDelete={() => handleDelete(address)} />  
                      </Grid>
                    ))
                  }
                  </Grid>
                </RadioGroup>
                : null
              }
              {
                !emptyAddresses ?
                <Grid container space={2}>
                  <Grid sx={{p: 2, textAlign: 'left'}} item xs={12} sm={6}>
                    <Button onClick={() => setAddNewAddress(!addNewAddress)} size="small" startIcon={!addNewAddress ? <AddIcon /> : <RemoveIcon />}>
                     { addNewAddress ? 'cancel' : 'Add new address'}
                    </Button>
                  </Grid>
                </Grid>
                : null
              }
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
              {
                !addNewAddress && emptyAddresses &&
                <Box>
                {
                  !emptyPersonalInfo &&
                  <React.Fragment>
                    <TextField
                      margin="normal"
                      defaultValue={personalInfo && personalInfo?.name}
                      disabled
                      fullWidth
                      required
                      id="name"
                      label="Name"
                      name="name"
                    />
                    <TextField
                      margin="normal"
                      defaultValue={personalInfo && personalInfo?.email}
                      disabled
                      fullWidth
                      required
                      id="email"
                      label="Email"
                      name="email"
                      error={errors.email}
                    />
                  </React.Fragment>
                }
                  <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="country"
                    label="Country"
                    name="country"
                    error={errors.country}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="city"
                    label="city"
                    name="city"
                    autoComplete="address-level2"
                    error={errors.city}
                  />
                  <TextField
                    margin="normal"
                    type="number"
                    fullWidth
                    required
                    id="postalcode"
                    label="Zip/Postal Code"
                    name="postalcode"
                    autoComplete="postalcode"
                    error={errors.postalcode}
                  />        
                  <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="address"
                    label="Address"
                    name="address"
                    autoComplete="address"
                    error={errors.address}
                  />
                  <TextField
                    margin="normal"
                    type="number"
                    fullWidth
                    required
                    id="phone"
                    label="Phone"
                    name="phone"
                    autoComplete="phone"
                    error={errors.phone}
                  />
                  <FormControlLabel
                    sx={{width: '100%'}}
                    control={
                      <Checkbox
                        value={!emptyAddresses ? addresses.length : forInvoice}
                        defaultChecked
                        checked={checked}
                        color="primary"
                        name="invoice"
                        id="invoice"
                        onChange={handleChange}
                     />
                    }
                    label="Use this address for invoice too"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, '&:hover': { backgroundColor: theme.palette.secondary.main, textDecoration: 'none' } }}
                  >
                    save
                  </Button>
                </Box>
              }
              {
                addNewAddress &&
                <Box>
                  <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="country"
                    label="Country"
                    name="country"
                    error={errors.country}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="city"
                    label="city"
                    name="city"
                    autoComplete="address-level2"
                    error={errors.city}
                  />
                  <TextField
                    margin="normal"
                    type="number"
                    fullWidth
                    required
                    id="postalcode"
                    label="Zip/Postal Code"
                    name="postalcode"
                    autoComplete="postalcode"
                    error={errors.postalcode}
                  />        
                  <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="address"
                    label="Address"
                    name="address"
                    autoComplete="address"
                    error={errors.address}
                  />
                  <TextField
                    margin="normal"
                    type="number"
                    fullWidth
                    required
                    id="phone"
                    label="Phone"
                    name="phone"
                    autoComplete="phone"
                    error={errors.phone}
                  />
                  {
                    !emptyAddresses &&
                    <FormControlLabel
                      sx={{width: '100%'}}
                      control={
                        <Checkbox
                          value={!emptyAddresses ? addresses.length : addresses[addresses.length - 1]}
                          defaultChecked
                          checked={checked}
                          color="primary"
                          name="invoice"
                          id="invoice"
                          onChange={(e) => handleChange(e)}
                      />
                      }
                      label="Use this address for invoice too"
                    />
                  }
                  <Button
                    type='submit'
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, '&:hover': { backgroundColor: theme.palette.secondary.main } }}
                  >
                    save
                  </Button>
                </Box>
              }
              {
                !emptyAddresses && !addNewAddress &&
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, '&:hover': { backgroundColor: theme.palette.secondary.main } }}
                  onClick={handleNext}
                >
                  Continue Next
                </Button>
              }
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
    </CheckoutLayout>
  );
}