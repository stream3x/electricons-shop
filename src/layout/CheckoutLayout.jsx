import { Box } from '@mui/material'
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import CartTotal from '../components/CartTotal';
import dynamic from 'next/dynamic';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  }));

 function CheckoutLayout({ children }) {

  return (
    <Box sx={{ my: 4 }}>
      <Grid container space={2}>
        <Grid xs={12} lg={8}>
          <Item elevation={0}>
            { children }
          </Item>
        </Grid>
        <Grid xs={12} lg={4}>
          <Item elevation={0}>
            <CartTotal />
          </Item>
        </Grid>
      </Grid>
    </Box>
  )
}

export default dynamic(() => Promise.resolve(CheckoutLayout), { ssr: false });