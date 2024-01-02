import { useContext, useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Fab, Typography } from '@mui/material';
import theme from '../../src/theme';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Store } from '../../src/utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const BackofficeIndex = () => {
  const router = useRouter();
  const { state, dispatch} = useContext(Store);
  const userInf0 = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const status = userInf0?.isAdmin;
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const buttonSx = {
    ...(success && {
      bgcolor: theme.palette.primary.main,
    }),
  };

  const timer = useRef();
  
  useEffect(() => {    
    if (loading) {
      setSuccess(false);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);     
      }, 2000);
    }
    if (status) {
        // User is authenticated and is an admin, continue to backoffice
        router.push('/backoffice/[id]/dashboard', `/backoffice/${userInf0?._id}/dashboard`);
      }else {
        // User is authenticated but not an admin, redirect to access denied or other page
        router.push('/login'); // Create this page or use an appropriate route
        dispatch({ type: 'USER_LOGOUT'});
        dispatch({ type: 'REMOVE_SESSION', payload: null });
        dispatch({ type: 'PERSONAL_REMOVE'});
        Cookies.remove('personalInfo');
        Cookies.remove('cartItems');
        Cookies.remove('addresses');
        Cookies.remove('payment');
        Cookies.remove('shipping');
        Cookies.remove('forInvoice');
        localStorage.removeItem('userInfo');
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'you are denied and logged out', severity: 'warning'}});
      }
      setLoading(true);
      return () => {
        clearTimeout(timer.current);
      };

  }, [status, userInf0]);

  return (
    <Box>
      <Typography component='h1' variant='h6'>{`Welcome dear ${userInf0?.name}`}</Typography>
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'end', height: '50vh'}}>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Fab
            aria-label="backoffice"
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
      </Box>
    </Box>
  );
};

export default BackofficeIndex;
