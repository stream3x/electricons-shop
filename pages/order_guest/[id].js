import React, { useState, useEffect, useContext, useRef } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '../../src/Link';
import ReplyIcon from '@mui/icons-material/Reply';
import theme from '../../src/theme';
import styled from '@emotion/styled';
import CheckIcon from '@mui/icons-material/Check';
import Fab from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';
import CartIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Guest from '../../models/Guest';
import db from '../../src/utils/db';

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.white,
  border: 'thin solid lightGrey',
  borderLeft: '5px solid black',
}));

function GuestOrder(props) {
  const { order_number, order_id, order_address, order_user_name, paid, delivered, delivery_method, order_items, order_country, order_city, order_postalcode, order_phone } = props;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = useRef();
  const router = useRouter();

  const buttonSx = {
    ...(success && {
      bgcolor: theme.palette.success,
    }),
  };

  useEffect(() => {
    handleButtonClick();
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    console.log(props)
  }, [props]);

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
  };

  return (
      <Box sx={{ my: 5, '& a': {textDecoration: 'none' }, '&:hover a': {textDecoration: 'none' } }}>
        <LabelButton sx={{width: '100%', my: 5, p: 2}}>
          <Box sx={{ m: 1, position: 'relative' }}>
            <Fab
              aria-label="save"
              color="primary"
              sx={buttonSx}
              onClick={handleButtonClick}
            >
              {success ? <CheckIcon /> : <CartIcon />}
            </Fab>
            {loading && (
              <CircularProgress
                size={68}
                sx={{
                  color: theme.palette.success,
                  position: 'absolute',
                  top: -6,
                  left: -6,
                  zIndex: 1,
                }}
              />
            )}
            </Box>
          <Typography sx={{m: 0, p: 1, fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h5" component="h1" gutterBottom>
            Thank you. Your order has been received.
          </Typography>
        </LabelButton>
        <Box sx={{m: 2}}>
          <Typography sx={{m: 0, p: 1}} variant="h5" component="h1" gutterBottom>
            Order ID: {order_id}
          </Typography>
          <Typography sx={{m: 0, p: 1}} variant="h5" component="p" gutterBottom>
            Order number: {order_number}
          </Typography>
          <Typography sx={{m: 0, p: 1}} variant="h5" component="p" gutterBottom>
            Customer information: {order_user_name}, {order_address}, {order_postalcode}, {order_city}, {order_country}, {order_phone}
          </Typography>
          <Typography sx={{m: 0, p: 1}} variant="h5" component="p" gutterBottom>
            Delivery method: {delivery_method}
          </Typography>
          <Typography sx={{m: 0, p: 1}} variant="h5" component="p" gutterBottom>
            {delivered === "false" ? "Not delivered" : "Delivered"}
          </Typography>
          <Typography sx={{m: 0, p: 1}} variant="h5" component="p" gutterBottom>
            {paid === "false" ? "Not paid" : "Paid"}
          </Typography>
          <Typography sx={{m: 0, p: 1}} variant="body2" component="p" gutterBottom>
            Product reviews
          </Typography>
          {
            order_items.map(item => (
              <Box key={item._id} sx={{m: 2, width: '200px'}}>
                <Box
                 component="img"
                 src={item.images[0].image}
                 alt={item.title}
                 sx={{
                  height: {xs: 70, sm: 100},
                  display: 'block',
                  maxWidth: 100,
                  overflow: 'hidden',
                  width: 'auto',
                  margin: 0,
                  p: 2
                }}
                 />
                <Typography sx={{m: 0, p: 1}} variant="body2" component="p" gutterBottom>
                  {item.title} x {item.quantity}
                </Typography>
              </Box>
            ))
          }
        </Box>
        <Link href="/" passHref>
          <Button sx={{'&:hover': {backgroundColor: theme.palette.secondary.main}}} size="large" variant="contained" startIcon={<ReplyIcon />}>
            back to shop
          </Button>
        </Link>
      </Box>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;
  await db.connect();
  const guest_order = await Guest.findById(id);
  await db.disconnect();

  function replacer(key, value) {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from([...value]),
      };
    } else {
      return value;
    }
  }

  function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  const org_value = JSON.stringify(guest_order.orderItems, replacer);
  const newValue = JSON.parse(org_value, reviver);

  return {
    props: {
      order_id: guest_order._id.toString(),
      order_address: guest_order.addresses.address.toString(),
      order_country: guest_order.addresses.country.toString(),
      order_city: guest_order.addresses.city.toString(),
      order_postalcode: guest_order.addresses.postalcode.toString(),
      order_phone: guest_order.addresses.phone.toString(),
      order_user_name: guest_order.personalInfo.name.toString(),
      order_number: guest_order.orderNumber,
      delivery_method: guest_order.shipping.shippingMethod.toString(),
      payment_method: guest_order.payment.paymentMethod.toString(),
      order_items: newValue,
      paid: guest_order && guest_order.isPaid.toString(),
      delivered: guest_order && guest_order.isDelevered ? guest_order.isDelevered.toString() : null
    },
  };
}

export default dynamic(() => Promise.resolve(GuestOrder), { ssr: false });