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
import Snackbars from '../../src/assets/Snackbars';
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

export default function PersonalInfo() {
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const { userInfo, cart: {cartItems} } = state;
  const [willLogin, setWillLogin] = useState(false);
  const [snack, setSnack] = useState({
    message: '',
    severity: ''
  })
  const [errors, setErrors] = useState({
    email: false,
    password: false
  });
  const [confirmPassword, setConfirmPassword] = useState({
    showPassword: false,
    confirmError: false
  })

  function loginHandler() {
    setWillLogin(prev => !prev);
  }

  const handleClickShowPassword = () => {
    setConfirmPassword({
      showPassword: !confirmPassword.showPassword,
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        name: formOutput.get('first-name'),
        email: formOutput.get('email'),
        password: formOutput.get('password'),
      }
      if(formData.password !== formOutput.get('password-confirmed')) {
        setConfirmPassword({
          confirmError: !confirmPassword.confirmError,
        });
        return
      }
      setConfirmPassword({
        confirmError: false,
      });
      const { data } = await axios.post('/api/users/register', formData);
      dispatch({ type: 'USER_LOGIN', payload: data});
      Cookies.set('userInfo', JSON.stringify(data));
      router.back();
      console.log('success login')
    } catch (error) {
      console.log(error.response ? error.response.data : error);
    }
   
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSnack({ ...snack, message: '', severity: '' });
    setErrors({ ...errors, email: false, password: false })
    try {
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        email: formOutput.get('email'),
        password: formOutput.get('password'),
      }
      const { data } = await axios.post('/api/users/login', formData);
      dispatch({ type: 'USER_LOGIN', payload: data});
      Cookies.set('userInfo', JSON.stringify(data));
      setSnack({ ...snack, message: 'success login', severity: 'success' });
      router.push('/checkout/addresses');
      setWillLogin(false);
    } catch (error) {
      if(error.response.data.type === 'all') {
        setErrors({ ...errors, email: error.response.data.type === 'all', password: error.response.data.type === 'all' })
      }else {
        setErrors({ ...errors, email: error.response.data.type === 'email', password: error.response.data.type === 'password' })
      }
      setSnack({ ...snack, message: error ? error.response.data.message : error, severity: error.response.data.severity });
    }
  };

  return (
    <CheckoutLayout>
      <CheckoutStepper activeStep={0} />
      <ThemeProvider theme={theme}>
        <Container component="div" maxWidth="xl">
          <CssBaseline />
          {
            !userInfo &&
            <Box sx={{display: 'flex', flexWrap: 'wrap', mt: 5 }}>
              <Button onClick={loginHandler} sx={{ color: theme.palette.secondary.main }}>
                <Typography variant="p">
                  Order as a guest
                </Typography>
              </Button>
              <Divider variant="middle" orientation="vertical" flexItem />
              <Button onClick={loginHandler} sx={{ color: theme.palette.main }}>
                <Typography variant="p">
                  Click here to login
                </Typography>
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
            !willLogin && 
            <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1, width: '100%' }}>
              <Box sx={{  display: 'flex', justifyContent: 'space-between', '& .MuiTextField-root': { width: '100%' } }}>
                <TextField
                  margin="normal"
                  fullWidth
                  required
                  id="first-name"
                  label="First name"
                  name="first-name"
                  autoComplete="name"
                  autoFocus
                  error={errors.name}
                  sx={{ mr: 1 }}
                />
                {
                  errors.name && 
                  <FormHelperText error>{snack.name}</FormHelperText>
                }
                <TextField
                  margin="normal"
                  fullWidth
                  required
                  name="last-name"
                  label="Last name"
                  type="text"
                  id="last-name"
                  autoComplete="family-name"
                  error={errors.name}
                  sx={{ ml: 1 }}
                />
                {
                  errors.name && 
                  <FormHelperText error>{snack.name}</FormHelperText>
                }
              </Box>
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
              <Typography sx={{pt: 3}} align="left" variant='h6' component="p">
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
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="Receive offers from our partners"
                />
              </Grid>
              <Grid align="left" item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I agree to the terms and conditions and the privacy policy"
                />
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
          }
          {
            willLogin &&
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
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
        {
          snack.message !== '' &&
          <Snackbars snack={snack}/>
        }
      </ThemeProvider>
    </CheckoutLayout>
  );
}