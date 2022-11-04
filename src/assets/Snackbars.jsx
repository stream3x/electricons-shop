import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Snackbars(props) {
  const { snack, snack: {severity}, snack: {message} } = props;
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
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
  }, [message !== ''])
  
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
    {
      snack && snack.message === 'successfully logged out' ?
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={ message }
      /> :
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          { message }
        </Alert>
      </Snackbar>
    }
    </Stack>
  );
}
