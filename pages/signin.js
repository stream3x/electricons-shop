import { useEffect, useContext, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '../src/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { Store } from '../src/utils/Store';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import { FormControl, InputLabel } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import axios from 'axios';
import Cookies from 'js-cookie';
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

export default function SignIn() {
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const [confirmPassword, setConfirmPassword] = useState({
    showPassword: false,
    confirmError: false
  })

  const handleClickShowPassword = () => {
    setConfirmPassword({
      showPassword: !confirmPassword.showPassword,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        name: formOutput.get('name'),
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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
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
                  required
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
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href='/login'variant="body2">
                  Already have an account? Login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}