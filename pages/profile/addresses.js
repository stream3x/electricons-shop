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
import AddressCard from '../../src/assets/AddressCard';
import RadioGroup from '@mui/material/RadioGroup';
import AddIcon from '@mui/icons-material/Add';
import ProfileLayout from '../../src/layout/ProfileLayout';
import axios from 'axios';

export default function ProfileAddresses() {
  const router = useRouter();
  const [addNewAddress, setAddNewAddress] = useState(false);
  const { state, dispatch } = useContext(Store);
  const { cart: { personalInfo, addresses, cartItems} } = state;
  const [userInfo, setUserInfo] = useState([]);
  const [error, setError] = React.useState(false);
  const [errors, setErrors] = useState({
    address: false,
    city: false,
    country: false,
    postalcode: false,
    phone: false
  });
  const pattern = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;

  const userInf0 = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  const emptyAddresses = userInfo?.addresses && userInfo?.addresses === 0;
  const emptyUserInfo = userInfo && userInfo === null && Object.keys(userInfo).length === 0;
  const emptyCartItems = Object.keys(cartItems).length === 0;

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get('/api/users');
        setUserInfo(data.filter(items => items._id === userInf0._id));
      } catch (error) {
        setError(true)
      }
    }
    fetchData();
  }, []);
console.log(addresses, userInfo, userInf0);
  

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
      const newAddress = [formData].concat(userInfo);
      console.log(JSON.stringify(newAddress));
      {
        addresses.length === 0 ?
        dispatch({ type: 'ADDRESSES', payload: { ...addresses, ...newAddress } })
        :
        dispatch({ type: 'ADDRESSES', payload: { ...addresses, ...formData } })
      }
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully added address', severity: 'success' } });
      Cookies.set('addresses', JSON.stringify(newAddress));
      setAddNewAddress(false);
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
    dispatch({ type: 'ADDRESSES_REMOVE', payload: item});
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'now you can edit address', severity: 'warning'}});
    Cookies.remove('addresses');
    setAddNewAddress(true);
  };
  const handleDelete = (item) => {
    dispatch({ type: 'ADDRESSES_REMOVE', payload: item});
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack,message: 'address successfully removed', severity: 'warning'}});
    if(emptyAddresses) {
      setAddNewAddress(true);
      Cookies.remove('addresses');
    }
  };

  return (
    <ProfileLayout>
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
              <Grid container space={2}>
              {
                !emptyAddresses ? (addresses.length !== 0 ? addresses : userInfo).map((address, index) => (
                  <Grid sx={{p: 2}} key={index} item xs={12} sm={6} md={4}>
                    <AddressCard index={''} addresses={address} personalInfo={personalInfo} name={userInfo && userInfo[0]?.name} handleEdit={() => handleEdit(address)} handleDelete={() => handleDelete(address)} />  
                  </Grid>
                ))
                : null
              }
              </Grid>
            }
            {
              !emptyAddresses &&
              <Grid container space={2}>
                <Grid sx={{p: 2, textAlign: 'left'}} item xs={12} sm={6}>
                  <Button onClick={() => setAddNewAddress(true)} size="small" startIcon={<AddIcon />}>
                    Add new address
                  </Button>
                </Grid>
              </Grid>
            }
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
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
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, '&:hover': { backgroundColor: theme.palette.secondary.main } }}
                >
                  save
                </Button>
              </Box>
            }
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </ProfileLayout>
  );
}