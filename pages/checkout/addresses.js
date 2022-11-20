import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import Link from '../../src/Link';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import FormHelperText from '@mui/material/FormHelperText';
import { Divider } from '@mui/material';
import theme from '../../src/theme';
import { Store } from '../../src/utils/Store';
import CheckoutLayout from '../../src/components/CheckoutLayout';
import CheckoutStepper from '../../src/components/CheckoutStepper';
import { FormControl, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddressCard from '../../src/assets/AddressCard';
import RadioGroup from '@mui/material/RadioGroup';

export default function Addresses() {
  const router = useRouter();
  const [addNewAddress, setAddNewAddress] = useState(false);
  const { state, dispatch } = useContext(Store);
  const { userInfo, snack, cart: {cartItems, personalInfo, addresses} } = state;
  const [errors, setErrors] = useState({
    address: false,
    city: false,
    country: false,
    postalcode: false,
    phone: false
  });
  const pattern = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
  const [selectedValue, setSelectedValue] = useState('selected-0-address');

  const emptyPersonalInfo = Object.keys(personalInfo).length === 0;
  const emptyAddresses = Object.keys(addresses).length === 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        address: formOutput.get('address'),
        city: formOutput.get('city'),
        country: formOutput.get('country'),
        postalcode: formOutput.get('postalcode'),
        phone: formOutput.get('phone'),
        company: formOutput.get('company'),
        vatNumber: formOutput.get('vat')
      };
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
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully added address', severity: 'success' } });
      setAddNewAddress(false);
      if(cartItems.length !== 0) {
        router.push('/checkout/shipping');
      }else {
        router.push('/');
      }
      setErrors({ 
        ...errors, 
        address: false,
        city: false,
        country: false,
        postalcode: false,
        phone: false
      });
  };

  const handleEdit = (item) => {
    console.log('edit', item)
    dispatch({ type: 'ADDRESSES_REMOVE', payload: item});
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'now you can edit address', severity: 'warning'}});
    setAddNewAddress(true);
  };
  const handleDelete = (item) => {
    console.log('delete', item)
    dispatch({ type: 'ADDRESSES_REMOVE', payload: item});
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'address successfully removed', severity: 'warning'}});
    if(emptyAddresses) {
      setAddNewAddress(true);
    }
  };

  return (
    <CheckoutLayout>
      <CheckoutStepper activeStep={1} />
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
            {
              !emptyAddresses &&
                <RadioGroup name="radio-address-picker" defaultValue={`${addresses[0].address}`} sx={{width: "100%"}}>
                  <Grid container space={2}>
                  {
                    !emptyAddresses ? addresses.map((address, index) => (
                      <Grid sx={{p: 2}} key={index} item xs={12} sm={6} md={4}>
                        <AddressCard index={index} address={address} personalInfo={personalInfo} handleEdit={() => handleEdit(address)} handleDelete={() => handleDelete(address)} />  
                      </Grid>
                    ))
                    : null
                  }
                  </Grid>
                </RadioGroup>
              }
              {
                !emptyAddresses ?
                <Grid container space={2}>
                    <Grid sx={{p: 2}} item xs={3}>
                      <Button onClick={() => setAddNewAddress(true)} size="small" startIcon={<AddIcon />}>
                      Add new address
                      </Button>
                    </Grid>
                </Grid>
                :
                <Grid container space={2}>
                    <Grid sx={{p: 2}} item xs={3}>
                      <Button onClick={() => setAddNewAddress(true)} size="small" startIcon={<AddIcon />}>
                      Add address
                      </Button>
                    </Grid>
                </Grid>
              }
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
              {
                userInfo &&
                <Box>
                  <TextField
                    margin="normal"
                    defaultValue={userInfo ? userInfo.name : ''}
                    disabled={userInfo.name && true}
                    fullWidth
                    required
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    error={errors.name}
                  />      
                  <TextField
                    margin="normal"
                    defaultValue={userInfo.company ? userInfo.company : ''}
                    disabled={userInfo.company && true}
                    fullWidth
                    id="company"
                    label="Company"
                    name="company"
                    autoComplete="company"
                  />                
                  <TextField
                    margin="normal"
                    type="number"
                    defaultValue={userInfo ? userInfo.vatNumber : ''}
                    disabled={userInfo && true}
                    fullWidth
                    id="vat"
                    label="VAT Number (optional)"
                    name="vat"
                  />                
                  <TextField
                    margin="normal"
                    defaultValue={userInfo ? userInfo.email : ''}
                    disabled={userInfo.email && true}
                    fullWidth
                    required
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    error={errors.email}
                  />            
                  <TextField
                    margin="normal"
                    type="date"
                    openTo="day"
                    defaultValue={userInfo ? userInfo.birthday : ''}
                    disabled={userInfo.birthday && true}
                    fullWidth
                    required
                    id="birthday"
                    label="Birthday"
                    name="birthday"
                    autoComplete="birthday"
                    error={errors.birthday}
                  />
                  <TextField
                    margin="normal"
                    defaultValue={userInfo ? userInfo.country : ''}
                    disabled={userInfo.country && true}
                    fullWidth
                    required
                    id="country"
                    label="Country"
                    name="country"
                    autoComplete="country"
                    error={errors.country}
                  />
                  <TextField
                    margin="normal"
                    type="number"
                    defaultValue={userInfo ? userInfo.city : ''}
                    disabled={userInfo.city && true}
                    fullWidth
                    required
                    id="city"
                    label="city"
                    name="city"
                    autoComplete="city"
                    error={errors.city}
                  />
                  <TextField
                    margin="normal"
                    type="number"
                    defaultValue={userInfo ? userInfo.postcode : ''}
                    disabled={userInfo.postcode && true}
                    fullWidth
                    required
                    id="postalcode"
                    label="Zip/Postal Code"
                    name="postalcode"
                    autoComplete="postalcode"
                    error={errors.phone}
                  />        
                  <TextField
                    margin="normal"
                    defaultValue={userInfo ? userInfo.address : ''}
                    disabled={userInfo.address && true}
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
                    defaultValue={userInfo ? userInfo.phone : ''}
                    disabled={userInfo.phone && true}
                    fullWidth
                    required
                    id="phone"
                    label="Phone"
                    name="phone"
                    autoComplete="phone"
                    error={errors.phone}
                  />
                </Box>
              }
              {
                addNewAddress &&
                <Box>
                  <TextField
                    margin="normal"
                    defaultValue={!emptyPersonalInfo ? personalInfo.name : ''}
                    disabled={!emptyPersonalInfo && true}
                    fullWidth
                    required
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    error={errors.name}
                  />
                  <TextField
                    margin="normal"
                    defaultValue={!emptyAddresses ? addresses.company : ""}
                    disabled={addresses.company && true}
                    fullWidth
                    id="company"
                    label="Company (Optional)"
                    name="company"
                  />
                  <TextField
                    margin="normal"
                    type="number"
                    defaultValue={!emptyAddresses ? addresses.vatNumber : ''}
                    disabled={addresses.vatNumber && true}
                    fullWidth
                    id="vat"
                    label="VAT Number (optional)"
                    name="vat"
                  />           
                  <TextField
                    margin="normal"
                    defaultValue={!emptyPersonalInfo ? personalInfo.email : ''}
                    disabled={!emptyPersonalInfo && true}
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    error={errors.email}
                  />
                  <TextField
                    margin="normal"
                    type="date"
                    openTo="day"
                    defaultValue={!emptyPersonalInfo ? personalInfo.birthday : "09/29/1984"}
                    disabled={!emptyPersonalInfo ? true : false}
                    fullWidth
                    id="date"
                    label="Birthday (optional)"
                    name="birthday"
                    autoComplete="birthday"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    defaultValue={!emptyAddresses ? addresses.country : ""}
                    disabled={addresses.country ? true : false}
                    fullWidth
                    id="country"
                    label="Country"
                    name="country"
                    autoComplete="country"
                  />
                  {
                    errors.country && 
                    <FormHelperText error>{snack.country ? snack.country : 'please fill the fields'}</FormHelperText>
                  }
                  <TextField
                    margin="normal"
                    required
                    defaultValue={!emptyAddresses ? addresses.city : ""}
                    disabled={addresses.city ? true : false}
                    fullWidth
                    id="city"
                    label="City"
                    name="city"
                    autoComplete="address-level2"
                  />
                  {
                    errors.city && 
                    <FormHelperText error>{snack.city ? snack.city : 'please fill the fields'}</FormHelperText>
                  }
                  <TextField
                    margin="normal"
                    required
                    type="number"
                    defaultValue={!emptyAddresses ? addresses.postalcode : ""}
                    disabled={addresses.postalcode ? true : false}
                    fullWidth
                    id="postalcode"
                    label="Zip/Postal Code"
                    name="postalcode"
                    autoComplete="postalcode"
                  />
                  {
                    errors.postalcode && 
                    <FormHelperText error>{snack.postalcode ? snack.postalcode : 'please fill the fields'}</FormHelperText>
                  }
                  <TextField
                    margin="normal"
                    type="text"
                    defaultValue={!emptyAddresses ? addresses.address : ""}
                    disabled={addresses.address ? true : false}
                    fullWidth
                    required
                    id="address"
                    label="Address"
                    name="address"
                    autoComplete="address"
                  />
                  {
                    errors.address && 
                    <FormHelperText error>{snack.address ? snack.address : 'please fill the fields'}</FormHelperText>
                  }
                  <TextField
                    margin="normal"
                    type="number"
                    required
                    defaultValue={addresses ? addresses.phone : ""}
                    disabled={addresses.phone ? true : false}
                    fullWidth
                    id="phone"
                    label="Phone"
                    name="phone"
                    autoComplete="phone"
                    InputProps={{
                      inputMode: 'numeric',
                      pattern: '[0-9]*'
                    }}
                  />
                  {
                    errors.phone && 
                    <FormHelperText error>{snack.phone ? snack.phone : 'please fill the fields'}</FormHelperText>
                  }
                </Box>
              }
              {
                addNewAddress &&
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Continue
                  </Button>
              }
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
    </CheckoutLayout>
  );
}