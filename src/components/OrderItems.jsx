import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import ReplyIcon from '@mui/icons-material/Reply';
import { Button, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from '../Link';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';

const headCells = [
  {
    id: 'image',
    label: 'Product',
  },
  {
    id: 'title',
    label: 'Name',
  },
  {
    id: 'price',
    label: 'Price',
  },
  {
    id: 'quantity',
    label: 'Quantity',
  },
  {
    id: 'subtotal',
    label: 'Subtotal',
  },
];

export default function OrderItems({ cartItems }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const subTotal = cartItems.reduce((a, c) => a + c.quantity * (Number(c.price.replace(/[^0-9.-]+/g,""))), 0);

  const total = subTotal;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={0} sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='medium'
          >
          <TableHead>
              <TableRow>
              {
                headCells.map(cell => (
                  <TableCell align={cell.id === 'image' ? 'left' : 'right'} key={cell.id}>{cell.label}</TableCell>
                ))
              }
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems && cartItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const subtotal = Number(row.price.replace(/[^0-9.-]+/g,"")) * row.quantity;

                  return (
                    <TableRow
                      hover
                      key={row._id}
                    >
                      <TableCell align="left" sx={{maxWidth: 100}}>
                        <Box
                          component="img"
                          sx={{
                            height: 70,
                            display: 'block',
                            maxWidth: 100,
                            overflow: 'hidden',
                            width: 'auto',
                            margin: 'auto'
                          }}
                          src={row.images[0].image}
                          alt={row.title}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="right"
                      >
                        <Link href={`/product/${row.slug}`}>
                          {row.title}
                        </Link>
                      </TableCell>
                      <TableCell color='primary' align="right">
                        {row.price}
                      </TableCell>
                      <TableCell align="right">
                        {row.quantity}
                      </TableCell>
                      <TableCell align="right">
                        ${subtotal}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableBody>
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography component="p" variant="h6" align="right" sx={{ fontSize: 14 }} color="secondary" gutterBottom>
                    Total: ${total}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={cartItems && cartItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
