import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { useRouter } from 'next/router';
import Link from '../Link';
import { TableFooter } from '@mui/material';

export default function Orders(props) {
  const { orders, isGuest } = props;
  const router = useRouter();
  const { id } = router.query;
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  function convertDate(value) {
    const date = new Date(value);
    const formatDate = date.toLocaleDateString("en-US", options);
    return formatDate;
  }

  return (
    <React.Fragment>
      <Title>{isGuest ? 'Recent Guest Orders' : 'Recent Orders'}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ship To</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((row) => (
            <TableRow key={row._id}>
              <TableCell>{convertDate(row?.createdAt)}</TableCell>
              <TableCell>{row.personalInfo?.name}</TableCell>
              <TableCell>{row.addresses?.address}, {row.addresses.city}, {row.addresses.country}</TableCell>
              <TableCell>{row.payment.paymentMethod}</TableCell>
              <TableCell align="right">{`$${row.total.toFixed(2)}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TableFooter sx={{ mt: 3 }}>
        <Link color="primary" href={`/backoffice/${id}/orders`} >
          See more orders
        </Link>
      </TableFooter>
    </React.Fragment>
  );
}