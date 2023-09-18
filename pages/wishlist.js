import { Box, Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import { useContext } from 'react';
import { Store } from '../src/utils/Store';
import Link from '../src/Link';
import theme from '../src/theme';
import ReplyIcon from '@mui/icons-material/Reply';
import WishTable from '../src/components/WishTable';
import BreadcrumbNav from '../src/assets/BreadcrumbNav';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  }));

 export default function Wishlist() {
  const { state } = useContext(Store);
  const { cart: { cartItems }, wishlist: {wishItems} } = state;

  if(wishItems.length === 0) {
    return (
      <Item sx={{ '& a': {textDecoration: 'none' } }} elevation={0}>
        <BreadcrumbNav />
        <Typography component="p" variant="h6">There are no items in your wishlist</Typography>
        <Link noLinkStyle href="/" passHref>
          <Button sx={{ '&:hover': {color: theme.palette.secondary.main} }} size="large" startIcon={<ReplyIcon />}>
            Continue shoping
          </Button>
        </Link>
      </Item>
    )
  }

  return (
    <Box sx={{ my: 4 }}>
      <BreadcrumbNav />
      <Grid container space={2}>
        <Grid xs={12}>
          <Item elevation={0}>
            <WishTable wishItems={wishItems} cartItems={cartItems} />
          </Item>
        </Grid>
      </Grid>
    </Box>
  )
}