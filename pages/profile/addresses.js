import React, { useContext, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import Cookies from 'js-cookie';
import theme from '../../src/theme';
import { Store } from '../../src/utils/Store';
import AddressCard from '../../src/assets/AddressCard';
import AddIcon from '@mui/icons-material/Add';
import ProfileLayout from '../../src/layout/ProfileLayout';
import axios from 'axios';
import RemoveIcon from '@mui/icons-material/Remove';
import styled from '@emotion/styled';
import { IconButton, Typography } from '@mui/material';
import Tooltips from '@mui/material/Tooltip';
import RefreshIcon from '@mui/icons-material/Refresh';

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.white,
  border: 'thin solid lightGrey',
  borderLeft: '5px solid black',
}));

export default function ProfileAddresses() {
  const [addNewAddress, setAddNewAddress] = useState(false);
  const { state, dispatch } = useContext(Store);
  const { cart: { personalInfo, addresses} } = state;
  const [userInfo, setUserInfo] = useState([]);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [refresh, setRefresh] = React.useState(false);
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [addressId, setAddressId] = useState('');
  const [addressIndex, setAddressIndex] = useState(0);
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
  const emptyUserInfo = userInf0 && Object.keys(userInf0).length === 0;

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
  }, [isSubmit]);

  function handleRefresh() {
    setRefresh(true);
    setIsSubmit(true);
  }

  React.useEffect(() => {
    setErrors({ 
      ...errors, 
      address: false,
      city: false,
      country: false,
      postalcode: false,
      phone: false
    });
    setError(false);
  }, [refresh])

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmit(false);
    try {
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        name: userInf0?.name,
        email: userInf0?.email,
        birthday: userInf0?.birthday,
        company: userInf0?.company,
        vatNumber: userInf0?.vatNumber,
        addresses: [
          {
            address: formOutput.get('address'),
            city: formOutput.get('city'),
            country: formOutput.get('country'),
            postalcode: formOutput.get('postalcode'),
            phone: formOutput.get('phone')
          }
        ]
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
      if(!pattern.test(formOutput.get('phone'))) {
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

      const { data } = await axios.put('/api/users/upload', formData);
      setIsSubmit(true);
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully added address', severity: 'success' } });
      Cookies.set('addresses', JSON.stringify(formData));
      setAddNewAddress(false);
      setErrors({ 
        ...errors, 
        address: false,
        city: false,
        country: false,
        postalcode: false,
        phone: false
      });
    } catch (error) {
      console.log(error.code);
      setError(true);
      setErrorMessage(error.code);
    }
      
  };

  const handleEditAddress = async (event) => {
    event.preventDefault();
    setIsSubmit(false);
    try {
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        email: userInf0.email,
        addressId: addressId,
        addresses: [
          {
            address: formOutput.get('address'),
            city: formOutput.get('city'),
            country: formOutput.get('country'),
            postalcode: formOutput.get('postalcode'),
            phone: formOutput.get('phone')
          }
        ]
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
      if(!pattern.test(formOutput.get('phone'))) {
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
      const { data } = await axios.put(`/api/users/edit_address`, formData);
      setIsSubmit(true);
      setAddressId('');
      setIsEdit(false);
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully added address', severity: 'success' } });
      Cookies.set('addresses', JSON.stringify(formData));
      setAddNewAddress(false);
      setErrors({ 
        ...errors, 
        address: false,
        city: false,
        country: false,
        postalcode: false,
        phone: false
      });
    } catch (error) {
      console.log(error.code);
      setError(true);
      setErrorMessage(error.code);
    }
      
  };

  useEffect(() => {
    if (emptyUserInfo) {
      setError(true);
      setErrorMessage('Please add addres for easy purchase');
      setAddNewAddress(true)
    }
  }, [])

  const handleNewAddress = () => {
    setIsEdit(false);
    setAddNewAddress(!addNewAddress)
  }
  
  const handleEdit = (item, index) => {
    setAddressId(item._id);
    setIsEdit(true);
    setAddressIndex(index);
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'now you can edit address', severity: 'warning'}});
    setAddNewAddress(true);
  };
  
  const handleDelete = async (item) => {
    const formData = {
      email: userInf0.email,
      addressId: item._id
    }
    const { data } = await axios.delete(`/api/users/delete_address`, {data: formData});
    setIsSubmit(true);
    setAddressId('');
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack,message: 'address successfully removed', severity: 'warning'}});
    if(emptyAddresses) {
      setAddNewAddress(true);
    }
  };

  return (
    <ProfileLayout>
      <ThemeProvider theme={theme}>
        <Container component="div" maxWidth="xl">
          <CssBaseline />
          {
            error &&
            <LabelButton sx={{width: '100%', my: 5, p: 2}}>
              <Typography sx={{m: 0, p: 1, fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h5" component="h1" gutterBottom>
                {errorMessage}
                <Tooltips title='Refresh'>
                  <IconButton onClick={handleRefresh} aria-label="delete">
                    <RefreshIcon />
                  </IconButton>
                </Tooltips>
              </Typography>
            </LabelButton>
          }
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
                userInfo[0]?.addresses?.map((address, index) => (
                  <Grid sx={{p: 2}} key={index} item xs={12} sm={6} md={4}>
                    <AddressCard index={''} addresses={address} personalInfo={personalInfo} name={userInfo && userInfo[0]?.name} handleEdit={() => handleEdit(address, index)} handleDelete={() => handleDelete(address)} />  
                  </Grid>
                ))
              }
              </Grid>
            }
            {
              !emptyAddresses &&
              <Grid container space={2}>
                <Grid sx={{p: 2, textAlign: 'left'}} item xs={12} sm={6}>
                  <Button onClick={handleNewAddress} size="small" startIcon={!addNewAddress ? <AddIcon /> : <RemoveIcon />}>
                  { addNewAddress ? 'cancel' : 'Add new address'}
                  </Button>
                </Grid>
              </Grid>
            }
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            {
              !isEdit && addNewAddress &&
              <Box>
                <TextField
                  margin="normal"
                  fullWidth
                  defaultValue={userInfo[0]?.addresses ? userInfo[0]?.addresses[0]?.country : ''}
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
                  defaultValue={userInfo[0]?.addresses ? userInfo[0]?.addresses[0]?.city : ''}
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
                  defaultValue={userInfo[0]?.addresses ? userInfo[0]?.addresses[0]?.postalcode : ''}
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
                  defaultValue={userInfo[0]?.addresses ? userInfo[0]?.addresses[0]?.address : ''}
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
                  defaultValue={userInfo[0]?.addresses ? userInfo[0]?.addresses[0]?.phone : ''}
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
            {
              emptyUserInfo &&
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
            {
              isEdit &&
              <Box component="form" onSubmit={handleEditAddress} noValidate sx={{ mt: 1, width: '100%' }}>
              {
                addNewAddress &&
                <Box>
                  <TextField
                    margin="normal"
                    fullWidth
                    defaultValue={userInfo[0]?.addresses ? userInfo[0]?.addresses[addressIndex]?.country : ''}
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
                    defaultValue={userInfo[0]?.addresses ? userInfo[0]?.addresses[addressIndex]?.city : ''}
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
                    defaultValue={userInfo[0]?.addresses ? userInfo[0]?.addresses[addressIndex]?.postalcode : ''}
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
                    defaultValue={userInfo[0]?.addresses ? userInfo[0]?.addresses[addressIndex]?.address : ''}
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
                    defaultValue={userInfo[0]?.addresses ? userInfo[0]?.addresses[addressIndex]?.phone : ''}
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
              {
                emptyUserInfo &&
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
            }
          </Box>
        </Container>
      </ThemeProvider>
    </ProfileLayout>
  );
}