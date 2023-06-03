import { Box, Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import { useContext } from 'react';
import { Store } from '../src/utils/Store';
import dynamic from 'next/dynamic';
import Link from '../src/Link';
import theme from '../src/theme';
import ReplyIcon from '@mui/icons-material/Reply';
import WishTable from '../src/components/WishTable';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  }));

 function Wishlist() {
  const { state } = useContext(Store);
  const { cart: { cartItems }, wishlist: {wishItems} } = state;

  if(wishItems.length === 0) {
    return (
      <Box sx={{ flexGrow: 1, my: 4, '& a': {textDecoration: 'none'} }}>
        <Typography gutterBottom variant="h6" component="h3" textAlign="center">
          There are no items in your wishlist
        </Typography>
        <Button onClick={()=> router.push('/')} variant="contained" startIcon={<ReplyIcon />}>
          back to shop
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ my: 4 }}>
      <Grid container space={2}>
        <Grid xs={12}>
          <Item elevation={0}>
            <WishTable wishItems={wishItems} cartItems={cartItems} />
          </Item>
        </Grid>
        {
          wishItems.length > 0 &&
          <Grid xs={12}>
            <Item sx={{ '& a': {textDecoration: 'none' } }} elevation={0}>
              <Link noLinkStyle href="/" passHref>
                <Button sx={{ '&:hover': {color: theme.palette.secondary.main}}} size="large" startIcon={<ReplyIcon />}>
                  Continue shoping
                </Button>
              </Link>
            </Item>
          </Grid>
        }
      </Grid>
    </Box>
  )
}

export default dynamic(() => Promise.resolve(Wishlist), { ssr: false });