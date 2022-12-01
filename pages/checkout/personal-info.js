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
import AddIcon from '@mui/icons-material/Add';

export default function PersonalInfo() {
  const router = useRouter();
  const [company, setCompany] = useState(false);
  const { state, dispatch } = useContext(Store);
  const { userInfo, snack, cart: {cartItems, personalInfo} } = state;
  const [willLogin, setWillLogin] = useState(false);
  const [willRegister, setWillRegister] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    birthday: false,
    company: false,
    vatNumber: false
  });
  const [confirmPassword, setConfirmPassword] = useState({
    showPassword: false,
    confirmError: false
  });
  const pattern= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  const emptyPersonalInfo = personalInfo !== null ? Object.keys(personalInfo).length === 0 : true;
  const emptyUserInfo = userInfo !== null ? Object.keys(userInfo).length === 0 : true;

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

      if(!emptyUserInfo) {
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully added user info', severity: 'success'}});
        router.push('/checkout/addresses');
        return;
      }
      if(formOutput.get('name') === '') {
        setErrors({ ...errors, firstName: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'please fill name', severity: 'error'}});
        return;
      }
      if(formOutput.get('vatNumber') !== '' && formOutput.get('vatNumber').length < 9) {
        setErrors({ ...errors, vatNumber: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'must contain exactly 9 numbers', severity: 'error'}});
        return;
      }
      if(formOutput.get('vatNumber') !== '' && formOutput.get('vatNumber').length > 9) {
        setErrors({ ...errors, vatNumber: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'must contain exactly 9 numbers', severity: 'error'}});
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
      
      console.log(formData, formOutput.get('vatNumber') !== '');
      // dispatch({ type: 'PERSONAL_INFO', payload: formData });
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully added personal info', severity: 'success'}});
      setCompany(false);
      // Cookies.set('personalInfo', JSON.stringify(formData));
      // router.push('/checkout/addresses');

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
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully register', severity: 'success'}});
      Cookies.set('userInfo', JSON.stringify(data));
      if(cartItems.length !== 0) {
        router.push('/checkout/addresses');
      }else {
        router.push('/');
      }
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
      dispatch({ type: 'USER_LOGIN', payload: data});
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully logedin', severity: 'success'}});
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
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: error ? error.response.data.message : error, severity: error.response.data.severity }});
    }
  };

  const handleEdit = () => {
      dispatch({ type: 'PERSONAL_REMOVE'});
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
            emptyUserInfo &&
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
            !emptyUserInfo &&
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                defaultValue={!emptyUserInfo && userInfo.name}
                disabled={!emptyUserInfo && true}
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
                defaultValue={!emptyUserInfo && userInfo.email}
                disabled={!emptyUserInfo && true}
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
                defaultValue={!emptyUserInfo ? userInfo.birthday : ""}
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
              <TextField
                margin="normal"
                defaultValue={!emptyUserInfo && userInfo.company}
                disabled={!emptyUserInfo && true}
                fullWidth
                id="company"
                label="Company (optional)"
                name="company"
                autoComplete="company"
              />
              {
                errors.company && 
                <FormHelperText error>{snack.message && snack.message}</FormHelperText>
              }
              <TextField
                margin="normal"
                type="number"
                defaultValue={!emptyUserInfo && userInfo.vatNumber}
                disabled={!emptyUserInfo && true}
                fullWidth
                id="vatNumber"
                label="VAT Number (optional)"
                name="vatNumber"
                autoComplete="vatNumber"
              />
              {
                errors.vatNumber && 
                <FormHelperText error>{snack.message && snack.message}</FormHelperText>
              }
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, '&:hover': { backgroundColor: theme.palette.secondary.main, textDecoration: 'none' } }}
              >
                Continue
              </Button>
            </Box>
          }
          {
            emptyUserInfo &&
            <Box component="form" onSubmit={willRegister ? handleRegister : handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                defaultValue={!emptyUserInfo ? userInfo.name : ''}
                disabled={!emptyUserInfo && true}
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
                defaultValue={!emptyUserInfo && userInfo.email}
                disabled={!emptyUserInfo && true}
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
                  defaultValue={!emptyUserInfo ? userInfo.birthday : ""}
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
                <TextField
                  margin="normal"
                  defaultValue={personalInfo.company ? personalInfo.company : ''}
                  disabled={personalInfo.company && true}
                  fullWidth
                  required
                  id="company"
                  label="Company (optional)"
                  name="company"
                  autoComplete="company"
                />
                 <TextField
                  margin="normal"
                  type="number"
                  defaultValue={personalInfo ? personalInfo.vatNumber : ''}
                  disabled={personalInfo.vatNumber && true}
                  fullWidth
                  id="vatNumber"
                  label="VAT Number (optional)"
                  name="vatNumber"
                />         
                {
                  errors.vatNumber && 
                  <FormHelperText error>{snack.message && snack.message}</FormHelperText>
                }
                <Typography sx={{pt: 3, pb: 2}} align="left" variant='h6' component="p">
                  Create an account (optional)
                  <Typography variant='caption' component="p">And save time on your next order!</Typography>
                </Typography>
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
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, '&:hover': { backgroundColor: theme.palette.secondary.main, textDecoration: 'none' } }}
                >
                  Continue
                </Button>
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
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleEdit}
            >
              Edit
            </Button>
          }
          {
              !company ?
              <Grid container space={2}>
                  <Grid sx={{p: 2, textAlign: 'left'}} item xs={12} sm={6}>
                    <Button onClick={() => setCompany(true)} size="small" startIcon={<AddIcon />}>
                      Add Company Info
                    </Button>
                  </Grid>
              </Grid>
              :
              <Grid container space={2}>
                  <Grid sx={{p: 2, textAlign: 'left'}} item xs={12} sm={6}>
                    <Button onClick={() => setCompany(false)} size="small" startIcon={<AddIcon />}>
                      cencel Company Info
                    </Button>
                  </Grid>
              </Grid>
            }
          </Box>
        </Container>
      </ThemeProvider>
    </CheckoutLayout>
  );
}