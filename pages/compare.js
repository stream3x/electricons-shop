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
import CompareTable from '../src/components/CompareTable';
import BreadcrumbNav from '../src/assets/BreadcrumbNav';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  }));

 function Compare() {
  const { state } = useContext(Store);
  const { comparasion: { compareItems }, cart: { cartItems } } = state;

  return (
    <Box sx={{ my: 4 }}>
      <BreadcrumbNav />
      <Grid container space={2}>
        {
          compareItems.length !== 0 &&
          <Grid xs={12}>
            <Item elevation={0}>
              <CompareTable compareItems={compareItems} cartItems={cartItems} />
            </Item>
          </Grid>
        }
        <Grid xs={12}>
          {
            compareItems.length !== 0 ?
            <Item sx={{ '& a': {textDecoration: 'none' } }} elevation={0}>
              <Link noLinkStyle href="/" passHref>
                <Button sx={{ '&:hover': {color: theme.palette.secondary.main}}} size="large" startIcon={<ReplyIcon />}>
                  Continue shoping
                </Button>
              </Link>
            </Item>
            :
            <Item sx={{ '& a': {textDecoration: 'none' } }} elevation={0}>
              <Typography component="p" variant="h6">Nothing to compare</Typography>
              <Link noLinkStyle href="/" passHref>
                <Button sx={{ '&:hover': {color: theme.palette.secondary.main} }} size="large" startIcon={<ReplyIcon />}>
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

export default dynamic(() => Promise.resolve(Compare), { ssr: false });