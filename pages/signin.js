import { useEffect, useContext, useState, useRef } from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Fab from '@mui/material/Fab';

export default function SignIn() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { snack, userInfo, session } = state;
  const [confirmPassword, setConfirmPassword] = useState({
    showPassword: false,
  });
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  // const passwordPattern = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{8, 22}$/;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = useRef();

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
        isAdmin: {type: Boolean, required: true, default: false},
        image: '',
        birthday: '',
        address: '',
        phone: '',
        country: '',
        city: '',
        postalcode: '',
        company: '',
        vatNumber: '',
        newsletter: '',
      };
      const existUser = await axios.get('/api/users/');
      const existEmail = await existUser.data.map(user => user.email);
      const findDuplicate = (existEmail.filter(x => x == formData.email)).toString();
      if(formData.name === '') {
        setErrors({
          name: true,
          email: false,
          password: false,
          confirmPassword: false
        });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "name is required", severity: "error" }});
        return;
      }
      if(formData.email === findDuplicate) {
        setErrors({
          name: false,
          email: true,
          password: false,
          confirmPassword: false
        });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "email already exist", severity: "error" }});
        return;
      }
      if(!pattern.test(formData.email)) {
        setErrors({
          name: false,
          email: true,
          password: false,
          confirmPassword: false
        });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "email is not valid", severity: "error" }});
        return;
      }
      if(formData.password.search(/[a-z]/i) < 0) {
        setErrors({
          name: false,
          email: false,
          password: true,
          confirmPassword: false
        });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "password must contain at least one letter", severity: "error" }});
        return;
      }
      if(formData.password.search(/[0-9]/) < 0) {
        setErrors({
          name: false,
          email: false,
          password: true,
          confirmPassword: false
        });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "password must contain at least one digit", severity: "error" }});
        return;
      }
      if(formData.password === '') {
        setErrors({
          name: false,
          email: false,
          password: true,
          confirmPassword: false
        });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "password is required", severity: "error" }});
        return;
      }
      if(formData.password < 6) {
        setErrors({
          name: false,
          email: false,
          password: true,
          confirmPassword: false
        });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "password must have more than 6 characters", severity: "error" }});
        return;
      }
      if(formData.password !== formOutput.get('password-confirmed')) {
        setErrors({
          name: false,
          email: false,
          password: false,
          confirmPassword: true,
        });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "passwords don't match", severity: "error" }});
        return;
      }
      handleButtonClick();
      setErrors({
        name: false,
        email: false,
        password: false
      });
      const { data } = await axios.post('/api/users/register', formData);
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully register', severity: 'success'}});
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: error ? error.response : error, severity: "error" }});
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
            Sign in
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
                />
                {
                  errors.name && 
                  <FormHelperText error>{snack.message}</FormHelperText>
                }
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
                {
                  errors.email && 
                  <FormHelperText error>{snack.message}</FormHelperText>
                }
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
                  errors.password &&
                  <FormHelperText sx={{color: 'red'}} id="error-text">{snack.message}</FormHelperText>
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
                  <FormHelperText sx={{color: 'red'}} id="error-password">{snack.message}</FormHelperText>
                }
              </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  sx={{'& span': {fontSize: '12px'}}}
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, '&:hover': {backgroundColor: theme.palette.secondary.main} }}
            >
              Sign in
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link sx={{textDecorationColor: theme.palette.primary.main}} href='/login' variant="body2">
                  Already have an account? Login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}