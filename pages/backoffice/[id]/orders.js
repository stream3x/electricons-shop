import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DashboardLayout from '../../../src/layout/DashboardLayout';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import { Chip, Stack } from '@mui/material';
import theme from '../../../src/theme';
import Image from 'next/image';

function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  function convertDate(value) {
    const date = new Date(value);
    const formatDate = date.toLocaleDateString("en-US", options);
    return formatDate;
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="right">{row?.orderNumber}</TableCell>
        <TableCell align="right">{row.personalInfo.name}</TableCell>
        <TableCell align="right">{row?.shipping.shippingAddress} {row?.shipping.shippingCity}{row?.shipping.store !== 'null' && row?.shipping.store}</TableCell>
        <TableCell align="right">{row?.shipping.shippingMethod}</TableCell>
        <TableCell align="right">{row?.payment.paymentMethod}</TableCell>
        <TableCell component="th" scope="row">
          {convertDate(row.createdAt)}
        </TableCell>
        <TableCell align="right">
          <Stack direction="row" spacing={1}>
            {
              row.isPaid ? 
              <Chip sx={{bgcolor: theme.palette.success.main, fontWeight: 700}} label="complete" /> 
              : 
              <Chip sx={{bgcolor: theme.palette.error.main, fontWeight: 700}} color='primary' label="pending" />
            }
          </Stack>
        </TableCell>
        <TableCell align="right">
          <Stack direction="row" spacing={1}>
            {
              row.isDeliverd ? 
              <Chip sx={{bgcolor: theme.palette.success.main, fontWeight: 700}} label="delivered" /> 
              : 
              <Chip sx={{bgcolor: theme.palette.dashboard.main, fontWeight: 700}} color='primary' label="pending" />
            }
          </Stack>
        </TableCell>
        <TableCell align="right">
        {'$'}{row?.total.toFixed(2)}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Orders
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Shipment</TableCell>
                    <TableCell align="right">Tax</TableCell>
                    <TableCell align="right">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.orderItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell component="th" scope="row">
                        <Box sx={{ width: 'auto', height: '50px', position: 'relative', objectFit: 'contain','& img': {objectFit: 'contain', width: 'auto!important', height: '50px'} }}>
                          <Image
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                            src={item?.images[1]?.image}
                            alt={row.title}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{'$'}{row?.shippingCost}</TableCell>
                      <TableCell align="right">{'$'}{row?.taxCost}</TableCell>
                      <TableCell align="right">
                        {'$'}{item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

export default function CollapsibleTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [pageGuest, setPageGuest] = React.useState(0);
  const [rowsPerPageGuest, setRowsPerPageGuest] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [rowsGuest, setRowsGuest] = React.useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePageGuest = (event, newPage) => {
    setPageGuest(newPage);
  };

  const handleChangeRowsPerPageGuest = (event) => {
    setRowsPerPageGuest(+event.target.value);
    setPageGuest(0);
  };

  React.useEffect(() => {
    async function fetchingData() {
      const { data } = await axios.get('/api/orders/fetch_orders');
      setRows(data[0].orders);
    }
    fetchingData();
  }, [])

  React.useEffect(() => {
    async function fetchingData() {
      const { data } = await axios.get('/api/guests/fetch_guest');
      setRowsGuest(data[0].guest_orders);
    }
    fetchingData();
  }, [])

  return (
    <DashboardLayout>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Order Number</TableCell>
              <TableCell align="right">Customer</TableCell>
              <TableCell align="right">Shipping Address</TableCell>
              <TableCell align="right">Shipping Method</TableCell>
              <TableCell align="right">Payment Method</TableCell>
              <TableCell align="right">Created At</TableCell>
              <TableCell align="right">Paid</TableCell>
              <TableCell align="right">Delivered</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <Row key={row._id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[3, 10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Box sx={{py: 5}}></Box>
       <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Order Number</TableCell>
              <TableCell align="right">Customer</TableCell>
              <TableCell align="right">Shipping Address</TableCell>
              <TableCell align="right">Shipping Method</TableCell>
              <TableCell align="right">Payment Method</TableCell>
              <TableCell align="right">Created At</TableCell>
              <TableCell align="right">Paid</TableCell>
              <TableCell align="right">Delivered</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsGuest.slice(pageGuest * rowsPerPageGuest, pageGuest * rowsPerPageGuest + rowsPerPageGuest).map((row) => (
              <Row key={row._id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[3, 10, 25, 100]}
        component="div"
        count={rowsGuest.length}
        rowsPerPage={rowsPerPageGuest}
        page={pageGuest}
        onPageChange={handleChangePageGuest}
        onRowsPerPageChange={handleChangeRowsPerPageGuest}
      />
    </DashboardLayout>
  );
}
