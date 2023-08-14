import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from '../../src/utils/SessionProvider';
import DashboardLayout from '../../src/layout/DashboardLayout';
import { Box, CircularProgress, Fab, Typography } from '@mui/material';
import theme from '../../src/theme';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Store } from '../../src/utils/Store';

const BackofficeIndex = () => {
  const { state, dispatch } = useContext(Store);
  const { session } = useSession();
  const router = useRouter();
  const status = session && session.isAdmin === true;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const buttonSx = {
    ...(success && {
      bgcolor: theme.palette.primary.main,
    }),
  };

  const timer = useRef();

  useEffect(() => {    
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        
      }, 2000);
    }
    if (status) {
        // User is authenticated and is an admin, continue to backoffice
        router.push('/backoffice/[id]/dashboard', `/backoffice/${session._id}/dashboard`);
      }else {
        // User is authenticated but not an admin, redirect to access denied or other page
        router.push('/login'); // Create this page or use an appropriate route
        dispatch({ type: 'USER_LOGOUT'});
        dispatch({ type: 'PERSONAL_REMOVE'});
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'you are denied and logged out', severity: 'warning'}});
      }
      return () => {
        clearTimeout(timer.current);
      };
  }, [status, session]);

  return (
    <DashboardLayout>
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
    </DashboardLayout>
  );
};

export default BackofficeIndex;
