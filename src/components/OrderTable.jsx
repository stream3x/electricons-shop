import * as React from 'react';
import PropTypes, { func } from 'prop-types';
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
import { Button, TableHead, Typography, styled } from '@mui/material';
import Image from 'next/image';
import theme from '../theme';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';

const MyTableContainer = styled(TableContainer)({
  overflowY: "auto",
  margin: 0,
  padding: 0,
  listStyle: "none",
  height: "100%",
  '&::-webkit-scrollbar': {
    width: '3px',
    height: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.secondary.borderColor
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '3px'
  }
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  }));

function TablePaginationActions(props) {
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
  {
    id: 'review',
    label: 'Leave Review',
  },
];

export default function OrderTable(props) {
  const { orders } = props;
  const router = useRouter()
  const { state, dispatch } = React.useContext(Store);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [userOrders, setUserOrders] = React.useState([]);
  const userInf0 = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

    const total = [];
    rows?.map((row) => row?.orderItems.map(item => total.push(Number(item?.price * item?.quantity))));
    const total_price = total.reduce((total, number) => total + number, 0);

  React.useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await orders;
        setUserOrders(res);
      } catch (error) {
        console.log(error, 'error fetching orders');
      }
    }
    fetchOrders();
  }, [])

  React.useEffect(() => {
    if (userInf0) {
      const getOrders = userOrders && userOrders.filter(order => order.personalInfo?.email === userInf0?.email);
      setRows(getOrders);
    }else {
      setRows([]);
    }
  }, [userOrders]);

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

  if (!rows) {
    return (
      <Item sx={{ '& a': {textDecoration: 'none' } }} elevation={0}>
        <Typography component="p" variant="h6">There are no items in your order history</Typography>
      </Item>
    )
  }

  function handleReview(slug, id) {
    dispatch({ type: 'REVIEW', payload: {...state.review, hasReview: true, hasRated: false, orderId: id} });
    router.push(`/product/${slug}/#reviews`);
  }

  return (
    <MyTableContainer>
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
          ).map((row) => row?.orderItems.map(item => (
            <TableRow key={item._id}>
              <TableCell>
                <Box sx={{ width: 'auto', height: '50px', position: 'relative', objectFit: 'contain','& img': {objectFit: 'contain', width: 'auto!important', height: '50px'} }}>
                  <Image
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    src={item && item.images[1].image}
                    alt={item.title}
                  />
                </Box>
              </TableCell>
              <TableCell style={{ minWidth: 160 }} align="left">
                {item.title}
              </TableCell>
              <TableCell style={{ minWidth: 100 }} align="right">
              {'$'}{item.price}
              </TableCell>
              <TableCell style={{ minWidth: 160 }} align="right">
                {row.payment.paymentMethod}
              </TableCell>
              <TableCell style={{ minWidth: 160 }} align="right">
                {row.shipping.shippingMethod}
              </TableCell>
              <TableCell style={{ minWidth: 160 }} align="right">
              {'$'}{row.shippingCost}
              </TableCell>
              <TableCell style={{ minWidth: 100 }} align="right">
              {row.taxCost}
              </TableCell>
              <TableCell style={{ minWidth: 160 }} align="right">
              {row.isDelevered ? 'delevered' : 'not delevered'}
              </TableCell>
              <TableCell style={{ minWidth: 100 }} align="right">
              {row.isPaid ? 'paid' : 'not paid'}
              </TableCell>
              <TableCell style={{ minWidth: 160 }} align="right">
              {row.orderNumber}
              </TableCell>
              <TableCell style={{ minWidth: 30 }} align="right">
                {item.quantity}
              </TableCell>
              <TableCell style={{ minWidth: 160 }} align="right">
                {'$'}{Number(item.price * item.quantity)}
              </TableCell>
              <TableCell style={{ minWidth: 160 }} align="right">
                {
                  item.hasRated ?
                  <Button onClick={() => handleReview(item.slug, row._id)} color='secondary' variant='outlined' size='small'>
                    rated
                  </Button>
                :
                  <Button onClick={() => handleReview(item.slug, row._id)} variant='outlined' size='small'>
                    review
                  </Button>
                }
              </TableCell>
            </TableRow>
          )))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableHead sx={{width: '100%'}}>
          <TableRow sx={{width: '100%'}}>
            <TableCell colSpan={10} align="right">
              {'Total price:'}
            </TableCell>
              <TableCell colSpan={2} align="right">
                {'$'}{total_price}
              </TableCell>
          </TableRow>
        </TableHead>
        <TableFooter sx={{width: '100%'}}>
          <TableRow sx={{width: '100%'}}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={12}
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
    </MyTableContainer>
  );
}