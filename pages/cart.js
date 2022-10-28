import { Box, Typography } from '@mui/material'
import CartTable from '../src/assets/CartTable'
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import CartTotal from '../src/assets/CartTotal';
import { useContext } from 'react';
import { Store } from '../src/utils/Store';
import dynamic from 'next/dynamic';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  }));

 function Cart() {
  const { state } = useContext(Store)
  const { cart: {cartItems} } = state;

  return (
    <Box sx={{ my: 4 }}>
      <Typography component="h1" variant="h6">
        SHOPPING CART
      </Typography>
      <Grid container space={2}>
        <Grid xs={12} md={8}>
          <Item elevation={0}>
            <CartTable cartItems={cartItems} />
          </Item>
        </Grid>
        <Grid xs={12} md={4}>
          <Item elevation={0}>
            <CartTotal />
          </Item>
        </Grid>
      </Grid>
    </Box>
  )
}

export default dynamic(() => Promise.resolve(Cart), { ssr: false });