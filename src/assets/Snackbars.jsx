import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import theme from '../theme';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Snackbars(props) {
  const { snack, snack: {severity}, snack: {message} } = props;
  const [open, setOpen] = React.useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'escapeKeyDown') {
      return;
    }
    setOpen(false);
  };

  React.useEffect(() => {
    setOpen(true);
    console.log(open)
    return () => {
      setOpen(false);
    }
  }, [message !== '']);

  const messageSnack = (
    <Typography variant="p" color={theme.palette.primary.main}>
      Welcome to our Store
    </Typography>
  )

  const action = (
    <IconButton
    size="small"
    aria-label="close"
    color="inherit"
    onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );
  
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
    {
      snack && snack.message === 'successfully logged out' ?
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={ <Typography>{ message }</Typography> }
        action={action}
      /> :
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      {
        message ?
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          <Typography>{ message }</Typography>
        </Alert>
        :
        <Snackbar
          sx={{ width: '100%' }}
          open={open}
          action={action}
          message={messageSnack}
        />
      }
      </Snackbar>
    }
    </Stack>
  );
}
