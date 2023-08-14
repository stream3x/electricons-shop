import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import theme from '../theme';

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits(props) {
  const { totalInflows, totalGuestInflows } = props;
  const orders = [];
  const orderGuest = [];
  totalInflows.forEach(order => {
    orders.push(order.total);
  })
  totalGuestInflows.forEach(order => {
    orderGuest.push(order.total);
  })
  const sumOrder = orders.reduce((total, number) => total + number, 0);
  const sumOrderGuest = orderGuest.reduce((total, number) => total + number, 0);

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  function convertDate() {
    const date = new Date();
    const formatDate = date.toLocaleDateString("en-US", options);
    return formatDate;
  }

  return (
    <React.Fragment>
      <Title>Recent Deposits</Title>
      <Typography component='span' variant='caption' color={theme.palette.secondary.lightGrey}>in last 7 days</Typography>
      <Typography component="p" variant="h4">
        {'$'}{(sumOrder + sumOrderGuest).toFixed(2)}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {convertDate()}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}