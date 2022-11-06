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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Link from '../../src/Link';
import axios from 'axios';
import { Store } from '../../src/utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Snackbars from '../../src/assets/Snackbars';
import FormHelperText from '@mui/material/FormHelperText';
import { Divider } from '@mui/material';
import theme from '../../src/theme';

export default function PersonalInfo() {
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const { cart: {cartItems} } = state;
  const { userInfo } = state;
  const [willLogin, setWillLogin] = useState(false);
  const [snack, setSnack] = useState({
    message: '',
    severity: ''
  })
  const [errors, setErrors] = useState({
    email: false,
    password: false
  });

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
      if(router.back() === '/cart') {
        router.back()
      }else {
        router.push('/');
      }
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
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        {
          !userInfo &&
          <Grid container sx={{ m: 2, boxSizing: 'border-box' }}>
            <Grid item xs={6} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
              <Button sx={{ color: theme.palette.secondary.main }}>
                <Typography variant="p">
                  Order as a guest
                </Typography>
              </Button>
            </Grid>
            <Divider variant="middle" orientation="vertical" flexItem />
            <Grid item xs={6} sm={3} sx={{ display: 'flex', justifyContent: 'flex-start', boxSizing: 'border-box' }}>
              <Button sx={{ color: theme.palette.main }}>
                <Typography variant="p">
                  Click here to login
                </Typography>
              </Button>
            </Grid>
          </Grid>
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
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Box sx={{  display: 'flex', justifyContent: 'space-between', '& .MuiTextField-root': { width: '25ch' } }}>
              <TextField
                margin="normal"
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href='/forgot-password' variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href='/singin' variant="body2">
                  {"Don't have an account? Sign Up"}
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
  );
}