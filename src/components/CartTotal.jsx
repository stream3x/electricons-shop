import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import Link from '../Link';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const randomNumber = getRandomInt(1, 999999);

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

export default function CartTotal() {
  const { state } = useContext(Store);
  const { cart: {cartItems, shipping, payment} } = state;
  const router = useRouter();
  const subTotal = cartItems.reduce((a, c) => a + c.quantity * (Number(c.price.replace(/[^0-9.-]+/g,""))), 0);
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const emptyShipping = shipping && Object.keys(shipping).length === 0;
  const shippingCost = shipping.shippingMethod !== 'store' ? 50 : 0;
  const total = subTotal + shippingCost;

  return (
    <Box sx={{ minWidth: 275 }}>
    {
      router.pathname !== '/checkout/placeorder' ?
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{textAlign: 'left', pb: 1}} variant="h5" component="h3">
            Cart{bull}Totals
          </Typography>
          <Divider />
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">subtotal: </Typography>
            <Typography variant="h6" component="span">${subTotal} </Typography>
          </Typography>
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">shipping: </Typography>
            <Typography component="span">{shippingCost === 0 ? 'free' : '$50'}</Typography>
          </Typography>
          <Divider />
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">Total: </Typography>
            <Typography variant="h6" component="span">${total} </Typography>
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={handleExpandClick} size="small">Show Deatalis</Button>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {
            cartItems.map(row => (
              <Box key={row._id} sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                <Box sx={{width: '100px'}}>
                  <Box
                    component="img"
                    sx={{
                      height: 70,
                      display: 'block',
                      maxWidth: 100,
                      overflow: 'hidden',
                      width: 'auto',
                      margin: '5px auto'
                    }}
                    src={row.images[0].image}
                    alt={row.title}
                  />
                </Box>
                <Link href={`/product/${row.slug}`} passHref>
                  <Typography>{row.title}</Typography>
                </Link>
                <Typography sx={{p: 1}}>{`x ${row.quantity}`}</Typography>
              </Box>
            ))
          }
        </CardContent>
      </Collapse>
      </Card>
      :
      <Card cartItems={cartItems} variant="outlined">
        <CardContent>
          <Typography sx={{textAlign: 'left', pb: 1}} variant="h5" component="h3">
            Order{bull}Details
          </Typography>
          <Divider />
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">order number: </Typography>
            <Typography variant="h6" component="span">{`${new Date().getFullYear()}-${randomNumber}`} </Typography>
          </Typography>
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">date: </Typography>
            <Typography variant="h6" component="span">{`${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}`}</Typography>
          </Typography>
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">Payment method: </Typography>
            <Typography variant="h6" component="span">{`${payment.paymentMethod}`}</Typography>
          </Typography>
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">Shipping method: </Typography>
            <Typography variant="h6" component="span">{`${shipping.shippingMethod === 'store' ? 'pick up in-store' : 'delivery'}`}</Typography>
          </Typography>
          {
            shipping.shippingMethod === 'store' &&
            <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
              <Typography component="span">Shipping address: </Typography>
              <Typography variant="h6" component="span">{`${shipping.store}, ${shipping.shippingCity}`}</Typography>
            </Typography>
          }
          <Divider />
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">Total: </Typography>
            <Typography variant="h6" component="span">${total} </Typography>
          </Typography>
          </CardContent>
      </Card>
    }
    </Box>
  );
}
