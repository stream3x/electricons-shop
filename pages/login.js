import { useContext, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Link from '../src/Link';
import axios from 'axios';
import { Store } from '../src/utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Snackbars from '../src/assets/Snackbars';
import FormHelperText from '@mui/material/FormHelperText';
import theme from '../src/theme';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://electricons.explodemarket.com">
        Electricons
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function LogIn() {
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const { snack } = state;
  const [errors, setErrors] = useState({
    email: false,
    password: false
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        email: formOutput.get('email'),
        password: formOutput.get('password'),
      }
      const { data } = await axios.post('/api/users/login', formData);
      dispatch({ type: 'USER_LOGIN', payload: data});
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully logedin', severity: 'success'}});
      Cookies.set('userInfo', JSON.stringify(data));
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
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: error ? error.response.data.message : error, severity: error.response.data.severity }});
    }
  };
console.log(snack)
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
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
                <Link href='/signin' variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}