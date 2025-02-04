import { Box, Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import CartTotal from '../src/components/CartTotal';
import { useContext } from 'react';
import { Store } from '../src/utils/Store';
import dynamic from 'next/dynamic';
import CartTable from '../src/components/CartTable';
import Link from '../src/Link';
import theme from '../src/theme';
import ReplyIcon from '@mui/icons-material/Reply';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  }));

 function Cart() {
  const { state } = useContext(Store);
  const { cart: {cartItems} } = state;

  return (
    <Box sx={{ my: 4 }}>
      <Grid container space={2}>
        <Grid xs={12} lg={8}>
          <Item elevation={0}>
            <CartTable />
          </Item>
        </Grid>
        <Grid xs={12} lg={4}>
          <Item elevation={0}>
            <CartTotal />
          </Item>
          {
            cartItems.length !== 0 &&
            <Item sx={{ '& a': {textDecoration: 'none' } }} elevation={0}>
              <Link href="/checkout/personal-info">
                <Button sx={{ my: 3, width: '100%', '&:hover': { backgroundColor: theme.palette.secondary.main, textDecoration: 'none' } }} variant="contained">
                  <Typography variant="body">Checkout</Typography>
                </Button>
              </Link>
              <Link noLinkStyle href="/" passHref>
                <Button sx={{ '&:hover': {color: theme.palette.secondary.main}}} size="large" startIcon={<ReplyIcon />}>
                  Continue shoping
                </Button>
              </Link>
            </Item>
          }
        </Grid>
      </Grid>
    </Box>
  )
}

export default dynamic(() => Promise.resolve(Cart), { ssr: false });