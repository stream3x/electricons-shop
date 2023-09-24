import React, { useContext, useEffect, useState } from 'react';
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
import CheckoutLayout from '../../src/layout/CheckoutLayout';
import CheckoutStepper from '../../src/components/CheckoutStepper';
import { FormControl, InputLabel } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function PersonalInfo() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { snack, cart: {cartItems, personalInfo} } = state;
  const [userInfo, setUserInfo] = useState([]);
  const [willLogin, setWillLogin] = useState(false);
  const [willRegister, setWillRegister] = useState(false);
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    birthday: false,
    company: false,
    vatNumber: false,
    address: false,
    city: false,
    country: false,
    postalcode: false,
    phone: false
  });
  const [confirmPassword, setConfirmPassword] = useState({
    showPassword: false,
    confirmError: false
  });
  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const userInf0 = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const emptyPersonalInfo = personalInfo !== null ? Object.keys(personalInfo).length === 0 : true;
  const emptyUserInfo = userInf0 !== null ? Object.keys(userInf0).length === 0 : true;
  const emptyCartItems = Object.keys(cartItems).length === 0;

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get('/api/users');
        const user = await data.filter(items => items._id === userInf0._id);
        setUserInfo(user);
        dispatch({ type: 'PERSONAL_INFO', payload: user[0] });
      } catch (error) {
        setError(true)
      }
    }
    fetchData();
  }, []);

  function orderLoginHandler() {
    setWillLogin(true);
  }

  function orderGestHandler() {
    setWillLogin(false);
  }

  const handleWillRegister = (e) => {
    if(e.target.value === '') {
      setWillRegister(() => false);
    }else {
      setWillRegister(() => true);
    }
  };

  const handleClickShowPassword = () => {
    setConfirmPassword({
      showPassword: !confirmPassword.showPassword,
    });
  };

  const handleNext = () => {
    router.push('/checkout/addresses');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        name: formOutput.get('name'),
        email: formOutput.get('email'),
        birthday: formOutput.get('birthday'),
        company: formOutput.get('company'),
        vatNumber: formOutput.get('vatNumber'),
      };

      setConfirmPassword({
        confirmError: false,
      });

      setErrors({ ...errors, name: false, email: false, birthday: false, password: false, company: false, vatNumber: false });
      if(emptyCartItems) {
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'sorry, first you must select product', severity: 'warning'}});
        router.push('/');
        return;
      }
      if(formOutput.get('name') === '') {
        setErrors({ ...errors, firstName: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'please fill name', severity: 'error'}});
        return;
      }
      if(formOutput.get('vatNumber') !== '' && formOutput.get('vatNumber').length < 9) {
        setErrors({ ...errors, vatNumber: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'can\'t contain less then 9 numbers', severity: 'error'}});
        return;
      }
      if(formOutput.get('vatNumber') !== '' && formOutput.get('vatNumber').length > 9) {
        setErrors({ ...errors, vatNumber: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'can\'t contain more than 9 numbers', severity: 'error'}});
        return;
      }
      if(!pattern.test(formData.email)) {
        setErrors({ ...errors, email: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the email is not valid', severity: 'error'}});
        return;
      }
      if(formData.email === '') {
        setErrors({ ...errors, email: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the email is not valid', severity: 'error'}});
        return;
      }
      dispatch({ type: 'PERSONAL_INFO', payload: formData });
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully added personal info', severity: 'success'}});
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        name: formOutput.get('name'),
        email: formOutput.get('email'),
        password: formOutput.get('password'),
        birthday: formOutput.get('birthday'),
        newsletter: formOutput.get('newsletter') !== null ? formOutput.get('newsletter') : '',
        company: formOutput.get('company'),
        vatNumber: formOutput.get('vatNumber')
      };
      setErrors({ ...errors, name: false, email: false, birthday: false, password: false, company: false, vatNumber: false, address: false, city: false, country: false, postalcode: false, phone: false });
      setConfirmPassword({
        confirmError: false,
      });
      if(emptyCartItems) {
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'sorry, first you must select product', severity: 'warning'}});
        router.push('/');
        return;
      }
      if(formOutput.get('name') === '') {
        setErrors({ ...errors, name: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'please fill name', severity: 'error'}});
        return;
      }
      if(formOutput.get('vatNumber') !== '' && formOutput.get('vatNumber').length < 9) {
        setErrors({ ...errors, vatNumber: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'can\'t contain less then 9 numbers', severity: 'error'}});
        return;
      }
      if(formOutput.get('vatNumber') !== '' && formOutput.get('vatNumber').length > 9) {
        setErrors({ ...errors, vatNumber: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'can\'t contain more then 9 numbers', severity: 'error'}});
        return;
      }
      if(!pattern.test(formData.email)) {
        setErrors({ ...errors, email: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the email is not valid', severity: 'error'}});
        return;
      }
      if(formData.email === '') {
        setErrors({ ...errors, email: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the email is not valid', severity: 'error'}});
        return;
      }
      if(formData.password !== formOutput.get('password-confirmed')) {
        setConfirmPassword({
          confirmError: !confirmPassword.confirmError,
        });
        return;
      }
      if(formData.password === '') {
        setErrors({ ...errors, password: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the password is required', severity: 'error'}});
        return;
      }
      const { data } = await axios.post('/api/users/register', formData);
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully register', severity: 'success'}});
      localStorage.setItem('userInfo', JSON.stringify(data));
      router.push('/checkout/addresses');
    } catch (error) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: error ? error.response.data.message : error, severity: error.response.data.severity }});
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
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully logedin', severity: 'success'}});
      localStorage.setItem('userInfo', JSON.stringify(data));
      setWillLogin(false);
      router.push('/checkout/addresses');
    } catch (error) {
      if(error.response.data.type === 'all') {
        setErrors({ ...errors, email: error.response.data.type === 'all', password: error.response.data.type === 'all' })
      }else {
        setErrors({ ...errors, email: error.response.data.type === 'email', password: error.response.data.type === 'password' })
      }
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: error ? error.response.data.message : error, severity: error.response.data.severity }});
    }
  };

  const handleEdit = (item) => {
      dispatch({ type: 'PERSONAL_REMOVE' });
      Cookies.remove('personalInfo');
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'now you can edit personal info', severity: 'warning'}});
  };

  return (
    <CheckoutLayout>
      <CheckoutStepper activeStep={0} />
      <ThemeProvider theme={theme}>
        <Container component="div" maxWidth="xl">
          <CssBaseline />
          {
            emptyUserInfo && emptyPersonalInfo &&
            <Box sx={{display: 'flex', flexWrap: 'nowrap', mt: 5 }}>
              <Button size="small" onClick={orderGestHandler} sx={{ color: theme.palette.secondary.main }}>
                  Order as a guest
              </Button>
              <Divider variant="middle" orientation="vertical" flexItem />
              <Button size="small" onClick={orderLoginHandler} sx={{ color: theme.palette.main }}>
                  Click here to login
              </Button>
            </Box>
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
          !willLogin && !emptyPersonalInfo &&
          <Box component="form" onSubmit={willRegister ? handleRegister : handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              defaultValue={personalInfo ? personalInfo.name : ''}
              disabled={!emptyPersonalInfo && true}
              fullWidth
              required
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
            />
            {
              errors.name && 
              <FormHelperText error>{snack.message && snack.message}</FormHelperText>
            }
            <TextField
              margin="normal"
              defaultValue={personalInfo ? personalInfo.email : ''}
              disabled={!emptyPersonalInfo && true}
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
            />
            {
              errors.email && 
              <FormHelperText error>{snack.message && snack.message}</FormHelperText>
            }
              <TextField
                margin="normal"
                type="date"
                defaultValue={personalInfo ? personalInfo.birthday : ''}
                disabled={!emptyPersonalInfo && true}
                fullWidth
                id="birthday"
                label="Birthday (optional)"
                name="birthday"
                autoComplete="birthday"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                margin="normal"
                defaultValue={personalInfo ? personalInfo.company : ''}
                disabled={!emptyPersonalInfo && true}
                fullWidth
                id="company"
                label="Company (optional)"
                name="company"
                autoComplete="company"
              />
              <TextField
                margin="normal"
                type="number"
                defaultValue={personalInfo ? personalInfo.vatNumber : ''}
                disabled={!emptyPersonalInfo && true}
                fullWidth
                id="vatNumber"
                label="VAT Number (optional)"
                name="vatNumber"
              />         
              {
                errors.vatNumber && 
                <FormHelperText error>{snack.message && snack.message}</FormHelperText>
              }
              {
                emptyPersonalInfo &&
                <React.Fragment>
                  <Typography sx={{pt: 3, pb: 2}} align="left" variant='h6' component="p">
                    Create an account (optional)
                    <Typography variant='caption' component="p">And save time on your next order!</Typography>
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        onChange={handleWillRegister}
                      />
                      {
                        confirmPassword.confirmError &&
                        <FormHelperText sx={{color: 'red'}} id="error-text">Passwords don't match</FormHelperText>
                      }
                      {
                        errors.password &&
                        <FormHelperText sx={{color: 'red'}} id="error-text">{snack.message}</FormHelperText>
                      }
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl sx={{ width: '100%' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">
                          Confirm Password
                        </InputLabel>
                        <OutlinedInput
                          fullWidth
                          name="password-confirmed"
                          label="Confirm Password *"
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
                  </Grid>
                </React.Fragment>
              }
          </Box>
          }
          {
            !willLogin && emptyPersonalInfo &&
            <Box component="form" onSubmit={willRegister ? handleRegister : handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                defaultValue={personalInfo ? personalInfo.name : ''}
                disabled={!emptyPersonalInfo && true}
                fullWidth
                required
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
              />
              {
                errors.name && 
                <FormHelperText error>{snack.message && snack.message}</FormHelperText>
              }
              <TextField
                margin="normal"
                defaultValue={personalInfo ? personalInfo.email : ''}
                disabled={!emptyPersonalInfo && true}
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
              {
                errors.email && 
                <FormHelperText error>{snack.message && snack.message}</FormHelperText>
              }
                <TextField
                  margin="normal"
                  type="date"
                  defaultValue={personalInfo ? personalInfo.birthday : ''}
                  disabled={!emptyPersonalInfo && true}
                  fullWidth
                  id="birthday"
                  label="Birthday (optional)"
                  name="birthday"
                  autoComplete="birthday"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  margin="normal"
                  defaultValue={personalInfo ? personalInfo.company : ''}
                  disabled={!emptyPersonalInfo && true}
                  fullWidth
                  id="company"
                  label="Company (optional)"
                  name="company"
                  autoComplete="company"
                />
                <TextField
                  margin="normal"
                  type="number"
                  defaultValue={personalInfo ? personalInfo.vatNumber : ''}
                  disabled={!emptyPersonalInfo && true}
                  fullWidth
                  id="vatNumber"
                  label="VAT Number (optional)"
                  name="vatNumber"
                />         
                {
                  errors.vatNumber && 
                  <FormHelperText error>{snack.message && snack.message}</FormHelperText>
                }
                {
                  emptyPersonalInfo &&
                  <React.Fragment>
                    <Typography sx={{pt: 3, pb: 2}} align="left" variant='h6' component="p">
                      Create an account (optional)
                      <Typography variant='caption' component="p">And save time on your next order!</Typography>
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="password"
                          label="Password"
                          type="password"
                          id="password"
                          autoComplete="false"
                          onChange={handleWillRegister}
                        />
                        {
                          confirmPassword.confirmError &&
                          <FormHelperText sx={{color: 'red'}} id="error-text">Passwords don't match</FormHelperText>
                        }
                        {
                          errors.password &&
                          <FormHelperText sx={{color: 'red'}} id="error-text">{snack.message}</FormHelperText>
                        }
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl sx={{ width: '100%' }} variant="outlined">
                          <InputLabel htmlFor="outlined-adornment-password">
                            Confirm Password
                          </InputLabel>
                          <OutlinedInput
                            fullWidth
                            name="password-confirmed"
                            label="Confirm Password *"
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
                    </Grid>
                  </React.Fragment>
                }
                {
                  emptyPersonalInfo &&
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, '&:hover': { backgroundColor: theme.palette.secondary.main, textDecoration: 'none' } }}
                  >
                    save
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
          {
            !emptyPersonalInfo &&
            <Box sx={{display: 'flex', width: '100%'}}>
              <Button
                variant="outlined"
                sx={{ mt: 3, mb: 2, mr: 1, '&:hover': { backgroundColor: theme.palette.secondary.main, textDecoration: 'none' } }}
                onClick={handleEdit}
              >
                edit
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, '&:hover': { backgroundColor: theme.palette.secondary.main, textDecoration: 'none' } }}
                onClick={handleNext}
              >
                Continue Next
              </Button>
            </Box>
          }
          </Box>
        </Container>
      </ThemeProvider>
    </CheckoutLayout>
  );
}