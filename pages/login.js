import { useContext, useRef, useState, useEffect } from 'react';
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
import { ThemeProvider } from '@mui/material/styles';
import Link from '../src/Link';
import axios from 'axios';
import { Store } from '../src/utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import FormHelperText from '@mui/material/FormHelperText';
import theme from '../src/theme';
import CircularProgress from '@mui/material/CircularProgress';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Fab from '@mui/material/Fab';
import { Alert } from '@mui/material';
import { useSession } from '../src/utils/SessionProvider';

export default function LogIn() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { snack, userInfo } = state;
  const [errors, setErrors] = useState({
    email: false,
    password: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = useRef();
  const [updateEmail, setUpdateEmail] = useState('');
  const [updatePassword, setUpdatePassword] = useState('');
  const { session, setSession } = useSession();

  const buttonSx = {
    ...(success && {
      bgcolor: theme.palette.primary.main,
    }),
  };

  useEffect(() => {
    if(userInfo) {
      router.push("/");
      return;
    }
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        if(router.pathname === '/cart') {
          router.back();
        }
        router.push('/');
      }, 2000);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({ ...errors, email: false, password: false});
    try {
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        email: formOutput.get('email'),
        password: formOutput.get('password'),
      };
      const { data } = await axios.post('/api/users/login', formData);
      setSession(data);
      handleButtonClick();
      dispatch({ type: 'USER_LOGIN', payload: data});
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully logedin', severity: 'success'}});
      Cookies.set('userInfo', JSON.stringify(data));
    }catch (error) {
      if(error.response.data.type === 'all') {
        setErrors({ ...errors, email: true, password: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: error ? error.response.data.message : error, severity: error.response.data.severity }});
      }
      if(error.response.data.type === 'email') {
        setErrors({ ...errors, email: true, password: false });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: error ? error.response.data.message : error, severity: error.response.data.severity }});
      }
      if(error.response.data.type === 'password') {
        setErrors({ ...errors, email: false, password: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: error ? error.response.data.message : error, severity: error.response.data.severity }});
      }
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: error ? error.response.data.message : error, severity: error.response.data.severity }});
    }
  };

  function handleChangeEmail(e) {
    setUpdateEmail(e.target.value)
  }
  function handleChangePassword(e) {
    setUpdatePassword(e.target.value)
  }

  function copyEmail(e) {
    setUpdateEmail(e.target.value)
  }
  function copyPassword(e) {
    setUpdatePassword(e.target.value)
  }

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
          <Box sx={{ m: 1, position: 'relative' }}>
            <Fab
              aria-label="sign in"
              color="secondary"
              sx={buttonSx}
            >
              {success ? <LockOpenIcon /> : <LockOutlinedIcon />}
            </Fab>
            {loading && (
              <CircularProgress
                size={68}
                sx={{
                  color: theme.palette.primary.main,
                  position: 'absolute',
                  top: -6,
                  left: -6,
                  zIndex: 1,
                }}
              />
            )}
          </Box>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box sx={{width: {xs: '100%', sm: 'auto'}, '& a': {textDecoration: 'none'}, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mt: 3}}>
            <Alert severity="info">
              Get these accounts!
              <Box>
                <Button color='indigo' value="sinan.sakic@gmail.com" onClick={copyEmail}>
                  email: sinan.sakic@gmail.com
                </Button>
                <Button color='indigo' value="Sinana123" onClick={copyPassword}>
                  password: Sinana123
                </Button>
              </Box>
              <Box>
                <Button color='indigo' value="super.admin@gmail.com" onClick={copyEmail}>
                  email: super.admin@gmail.com
                </Button>
                <Button color='indigo' value="Dmdevelo123" onClick={copyPassword}>
                  password: Dmdevelo123
                </Button>
              </Box>
              <Box>
                <Button color='indigo' value="zokac.pokac@gmail.com" onClick={copyEmail}>
                  email: zokac.pokac@gmail.com
                </Button>
                <Button color='indigo' value="Z@kula03" onClick={copyPassword}>
                  password: Z@kula03
                </Button>
              </Box>
            </Alert>
          </Box>
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
              onChange={handleChangeEmail}
              value={updateEmail}
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
              onChange={handleChangePassword}
              value={updatePassword}
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
              sx={{ mt: 3, mb: 2, '&:hover': {backgroundColor: theme.palette.secondary.main} }}
            >
              Login
            </Button>
            <Grid sx={{display: 'flex', flexWrap: 'wrap'}} container spacing={2}>
              <Grid item xs>
                <Link sx={{textDecorationColor: theme.palette.primary.main}} href='/forgot-password' variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid sx={{width: {xs: '100%', sm: 'auto'}}} item>
                <Link sx={{textDecorationColor: theme.palette.primary.main}} href='/signin' variant="body2">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}