import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Store } from '../utils/Store';
import { TableHead } from '@mui/material';
import Image from 'next/image';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

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
    id: 'payment',
    label: 'Payment',
  },
  {
    id: 'shipping',
    label: 'Shipping',
  },
  {
    id: 'shippingCost',
    label: 'Shipping Cost',
  },
  {
    id: 'tax',
    label: 'Tax Cost',
  },
  {
    id: 'delevered',
    label: 'Delevered',
  },
  {
    id: 'paid',
    label: 'Paid',
  },
  {
    id: 'OrderNumber',
    label: 'Order',
  },
  {
    id: 'quantity',
    label: 'Quantity',
  },
  {
    id: 'total',
    label: 'Total',
  },
];

export default function OrderTable(props) {
  const { orders } = props;
  const { state } = React.useContext(Store);
  const { userInfo } = state;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  let rows = [];
  if (userInfo) {
    rows = orders.filter(order => order.userInfo.email === userInfo.email);
  }else {
    rows = [];
  }
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
          {
            headCells.map(cell => (
              <TableCell align={cell.id === 'image' || cell.id === 'title' ? 'left' : 'right'} key={cell.id}>{cell.label}</TableCell>
            ))
          }
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row._id}>
              <TableCell>
                <Box sx={{ width: 'auto', height: '50px', position: 'relative', objectFit: 'contain','& img': {objectFit: 'contain', width: 'auto!important', height: '50px'} }}>
                  <Image
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    src={row && row.orderItems[0].images[1].image}
                    alt={row.orderItems[0].title}
                  />
                </Box>
              </TableCell>
              <TableCell style={{ width: 200 }} align="left">
                {row.orderItems[0].title}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
              {'$'}{row.orderItems[0].price}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.payment.paymentMethod}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.shipping.shippingMethod}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
              {'$'}{row.shippingCost}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
              {row.taxCost}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
              {row.isDelevered ? 'delevered' : 'not delevered'}
              </TableCell>
              <TableCell style={{ width: 100 }} align="right">
              {row.isPaid ? 'paid' : 'not paid'}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
              {row.orderNumber}
              </TableCell>
              <TableCell style={{ width: 30 }} align="right">
                {row.orderItems[0].quantity}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {'$'}{row.total.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}