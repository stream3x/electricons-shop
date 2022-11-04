import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function CartTotal(props) {
  const { cartItems } = props;
  const subTotal = cartItems.reduce((a, c) => a + c.quantity * (Number(c.price.replace(/[^0-9.-]+/g,""))), 0);

  const shipping = 50;
  const total = subTotal + shipping;
  
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card cartItems={cartItems} variant="outlined">
        <CardContent>
          <Typography sx={{textAlign: 'left'}} variant="h5" component="h3">
            Cart{bull}Totals
          </Typography>
          <Divider />
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">subtotal: </Typography>
            <Typography variant="h6" component="span">${subTotal} </Typography>
          </Typography>
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">shipping: </Typography>
            <Typography variant={shipping ? "h6" : "p"} component="span">{shipping ? `$${shipping}` : 'Free'}</Typography>
          </Typography>
          <Divider />
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">Total: </Typography>
            <Typography variant="h6" component="span">${total} </Typography>
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Show Deatalis</Button>
        </CardActions>
      </Card>
    </Box>
  );
}
