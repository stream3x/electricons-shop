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
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Addresses() {
  const router = useRouter();
  const [checkedPolicy, setCheckedPolicy] = React.useState(false);
  const [checkedNewsletter, setCheckedNewsletter] = React.useState(false);
  const { state, dispatch } = useContext(Store);
  const { userInfo, snack, cart: {cartItems, personalInfo} } = state;
  const [willLogin, setWillLogin] = useState(false);
  const [willRegister, setWillRegister] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    firstName: false,
    lastName: false,
    email: false,
    password: false
  });
  const [confirmPassword, setConfirmPassword] = useState({
    showPassword: false,
    confirmError: false
  });
  const pattern= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  const emptyPersonalInfo = Object.keys(personalInfo).length === 0;
  const emptyUserInfo = userInfo === null;

  function orderLoginHandler() {
    setWillLogin(true);
  }

  function orderGestHandler() {
    setWillLogin(false);
  }

  const handleClickShowPassword = () => {
    setConfirmPassword({
      showPassword: !confirmPassword.showPassword,
    });
  };

  const hasRegister = (formPassword) => {
    if(formPassword === '') {
      setWillRegister(() => false);
      return;
    }
    if(formPassword !== '') {
      setWillRegister(() => true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        name: formOutput.get('first-name').concat(' ').concat(formOutput.get('last-name')),
        email: formOutput.get('email'),
        birthday: formOutput.get('birthday'),
        newsletter: formOutput.get('newsletter') !== null ? formOutput.get('newsletter') : ''
      };
      setConfirmPassword({
        confirmError: false,
      });
      if(formOutput.get('first-name') === '') {
        setErrors({ ...errors, firstName: true });
        return;
      }
      if(formOutput.get('last-name') === '') {
        setErrors({ ...errors, lastName: true });
        return;
      }
      if(!pattern.test(formData.email)) {
        setErrors({ ...errors, email: true });
        return;
      }
      setErrors({ ...errors, firstName: false, lastName: false, email: false });
      dispatch({ type: 'PERSONAL_INFO', payload: formData});
      Cookies.set('personalInfo', JSON.stringify(formData));
      if(cartItems.length !== 0) {
        router.push('/checkout/addresses');
      }else {
        router.push('/');
      }
      console.log('submit', formData);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        name: formOutput.get('first-name').concat(' ').concat(formOutput.get('last-name')),
        email: formOutput.get('email'),
        password: formOutput.get('password'),
        birthday: formOutput.get('birthday'),
        newsletter: formOutput.get('newsletter') !== null ? formOutput.get('newsletter') : ''
      };
      if(formData.password !== formOutput.get('password-confirmed')) {
        setConfirmPassword({
          confirmError: !confirmPassword.confirmError,
        });
        return;
      }
      setConfirmPassword({
        confirmError: false,
      });
      const { data } = await axios.post('/api/users/register', formData);
      dispatch({ type: 'USER_LOGIN', payload: data});
      dispatch({ type: 'SUCCESS_REGISTER', payload: { ...state.snack, message: 'successfully register', severity: 'success'}});
      Cookies.set('userInfo', JSON.stringify(data));
      if(cartItems.length !== 0) {
        router.push('/checkout/addresses');
      }else {
        router.push('/');
      }
      console.log('success register', formData);
    } catch (error) {
      console.log(error.response ? error.response.data : error);
      dispatch({ type: 'USER_LOGIN', payload: { ...state.snack, message: error ? error.response.data.message : error, severity: error.response.data.severity }});
    }
   
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrors({ ...errors, email: false, password: false });
    try {
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        email: formOutput.get('email'),
        password: formOutput.get('password'),
      };
      const { data } = await axios.post('/api/users/login', formData);
      dispatch({ type: 'USER_LOGIN', payload: data});
      dispatch({ type: 'SUCCESS_LOGIN', payload: { ...state.snack, message: 'successfully logedin', severity: 'success'}});
      Cookies.set('userInfo', JSON.stringify(data));
      setWillLogin(false);
      if(cartItems.length !== 0) {
        router.push('/checkout/addresses');
      }else {
        router.push('/');
      }
    } catch (error) {
      if(error.response.data.type === 'all') {
        setErrors({ ...errors, email: error.response.data.type === 'all', password: error.response.data.type === 'all' })
      }else {
        setErrors({ ...errors, email: error.response.data.type === 'email', password: error.response.data.type === 'password' })
      }
      dispatch({ type: 'USER_LOGIN', payload: { ...state.snack, message: error ? error.response.data.message : error, severity: error.response.data.severity }});
    }
  };

  const handleEdit = (e) => {
    dispatch({ type: 'USER_LOGOUT'});
    dispatch({ type: 'GUEST_REMOVE'});
    Cookies.remove('userInfo');
    Cookies.remove('perosnalInfo');
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
            !willLogin &&
            <Box component="form" onSubmit={willRegister ?handleRegister : handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
              <Box sx={{  display: 'flex', justifyContent: 'space-between', '& .MuiTextField-root': { width: '100%' } }}>
              {
                emptyPersonalInfo ?
                <TextField
                  margin="normal"
                  defaultValue={!emptyUserInfo ? userInfo.name : ''}
                  disabled={!emptyUserInfo && true}
                  fullWidth
                  required
                  id="first-name"
                  label={!emptyUserInfo ? "Name" : "First name"}
                  name="first-name"
                  autoComplete="name"
                  error={errors.firstName}
                  sx={{ mr: !emptyUserInfo ? 0 : 1 }}
                />
                : 
                <TextField
                  margin="normal"
                  defaultValue={!emptyPersonalInfo ? personalInfo.name : ''}
                  disabled={!emptyPersonalInfo && true}
                  fullWidth
                  required
                  id="first-name"
                  label={!emptyPersonalInfo ? "Name" : "First Name"}
                  name="first-name"
                  autoComplete="name"
                  error={errors.firstName}
                  sx={{ mr: !emptyPersonalInfo ? 0 : 1 }}
                />
              }
                {
                  emptyPersonalInfo && emptyUserInfo &&
                    <TextField
                      margin="normal"
                      fullWidth
                      required
                      name="last-name"
                      label="Last name"
                      type="text"
                      id="last-name"
                      autoComplete="family-name"
                      error={errors.lastName}
                      sx={{ ml: 1 }}
                    />
                }
                
              </Box>
              {
                !emptyPersonalInfo ?
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
              : 
              <TextField
                margin="normal"
                defaultValue={!emptyUserInfo ? userInfo.email : ''}
                disabled={!emptyUserInfo && true}
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={errors.email}
              />
              }
              {
                errors.email && 
                <FormHelperText error>{snack.message ? snack.message : 'email is not valid'}</FormHelperText>
              }
              {
                !emptyPersonalInfo ?
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
                : 
                <TextField
                  margin="normal"
                  type="date"
                  openTo="day"
                  defaultValue={!emptyUserInfo ? userInfo.birthday : "09/29/1984"}
                  disabled={!emptyUserInfo ? true : false}
                  fullWidth
                  id="date"
                  label="Birthday (optional)"
                  name="birthday"
                  autoComplete="birthday"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              }
              {
                emptyUserInfo && emptyPersonalInfo &&
                <Typography sx={{pt: 3, pb: 2}} align="left" variant='h6' component="p">
                  Create an account (optional)
                  <Typography variant='caption' component="p">And save time on your next order!</Typography>
                </Typography>
              }
              {
                emptyUserInfo && emptyPersonalInfo &&
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="password"
                      label="Password (optional)"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      onChange={(e) => hasRegister(e.target.value)}
                    />
                    {
                      confirmPassword.confirmError &&
                      <FormHelperText sx={{color: 'red'}} id="error-text">Passwords don't match</FormHelperText>
                    }
                  </Grid>
                  <Grid item xs={12}>
                  <FormControl sx={{ width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                    <OutlinedInput
                      fullWidth
                      name="password-confirmed"
                      label="Confirm Password"
                      type={confirmPassword.showPassword ? 'text' : 'password'}
                      id="password-confirm"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {confirmPassword.showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {
                      confirmPassword.confirmError &&
                      <FormHelperText sx={{color: 'red'}} id="error-text">Passwords don't match</FormHelperText>
                    }
                  </FormControl>
                  </Grid>
                  <Grid align="left" item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={checkedNewsletter !== undefined ? "newsletter" : ''}
                        color="primary"
                        name="newsletter"
                        id="newsletter"
                        onChange={(e) => setCheckedNewsletter(e.target.checked)}
                     />
                    }
                    label="Sign up for our newsletter
                    You may unsubscribe at any moment."
                  />
                  </Grid>
                  <Grid align="left" item xs={12} sx={{ display: 'flex' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                        value="policy"
                        color="primary"
                        required
                        onChange={(e) => setCheckedPolicy(e.target.checked)}
                        />
                      }
                      label='I agree to the terms and conditions and the privacy policy'
                    />
                    <FormHelperText sx={{color: 'red'}}>*</FormHelperText>
                  </Grid>
                </Grid>
              }
              {
                emptyUserInfo && emptyPersonalInfo ?
                <Button
                  disabled={!checkedPolicy}
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
          }
          {
            willLogin &&
            <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={errors.email}
              />
              {
                errors.email && 
                <FormHelperText error>{snack.message}</FormHelperText>
              }
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={errors.password}
              />
              {
                errors.password && 
                <FormHelperText error>{snack.message}</FormHelperText>
              }
              <Grid align="left" item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
              <Grid container>
                <Grid align="left" item xs>
                  <Link href='/forgot-password' variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          }
          </Box>
        </Container>
      </ThemeProvider>
    </CheckoutLayout>
  );
}