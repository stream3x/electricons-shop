import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import { Store } from '../utils/Store';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function PaymentInstruction() {
  const { state } = useContext(Store);
  const { cart: {cartItems, personalInfo, addresses, shipping, payment}, userInfo } = state;
  const subTotal = cartItems.reduce((a, c) => a + c.quantity * c.price, 0);

  const emptyShipping = Object.keys(shipping).length === 0;
  const total = subTotal + (!emptyShipping && shipping.shippingMethod !== 'store' ? 50 : 0);
  // const randomNumber = getRandomInt(1, 999999);
  const modelNumber = `${new Date().getFullYear()}-${userInfo._id.substr(userInfo._id.length - 6)}`;

  // function getRandomInt(min, max) {
  //   min = Math.ceil(min);
  //   max = Math.floor(max);
  //   return Math.floor(Math.random() * (max - min) + min);
  // }

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{textAlign: 'left', pb: 1}} variant="h5" component="h3">
            Payment{bull}Instruction
          </Typography>
          <Divider />
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">Name of account owner: </Typography>
            <Typography variant="h6" component="span">
              Electricons Phd
            </Typography>
          </Typography>
          <Divider />
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">Aaccount number: </Typography>
            <Typography variant="h6" component="span">
              980-555062201787-58
            </Typography>
          </Typography>
          <Divider />
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">Model: </Typography>
            <Typography variant="h6" component="span">
              {modelNumber}
            </Typography>
          </Typography>
          <Divider />
          <Typography sx={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} color="secondary" gutterBottom>
            <Typography component="span">Bank name: </Typography>
            <Typography variant="h6" component="span">
              Banka Postanska Stedionica
            </Typography>
          </Typography>
          <Divider />
          <Typography align="left" sx={{pt: 2}} color="secondary" gutterBottom>
            <Typography align="left" sx={{ fontSize: 14 }} variant="h6" component="span">
              Your order will be sent as soon as we receive payment.
            </Typography>
            <Typography align="left" sx={{ fontSize: 14 }} variant="body" component="p">
            If you have questions, comments or concerns, please contact our expert customer support team.
            </Typography>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
