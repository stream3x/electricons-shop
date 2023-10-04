import * as React from 'react';
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
import TablePagination from '@mui/material/TablePagination';
import { Button, Chip, InputBase, Stack, alpha, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';
import theme from '../theme';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

const Search = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  [theme.breakpoints.down('md')]: {
    marginLeft: theme.spacing(0),
    width: '100%',
  },
  border: 'thin solid lightGrey',
  boxSizing: 'border-box',
  display: 'flex',
  margin: '.2rem 0' 
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('xl')]: {
      width: '12ch',
      '&:focus': {
        width: '22ch',
      },
    },
  },
}));

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
        <TableCell align="right">{row.personalInfo?.name}</TableCell>
        <TableCell align="right">{row?.shipping?.shippingAddress !== "null" && row?.shipping?.shippingAddress} {row?.shipping.shippingCity}{', '}{row?.shipping.store !== 'null' && row?.shipping.store}</TableCell>
        <TableCell align="right">{row?.shipping?.shippingMethod}</TableCell>
        <TableCell align="right">{row?.payment?.paymentMethod}</TableCell>
        <TableCell component="th" scope="row">
          {convertDate(row.createdAt)}
        </TableCell>
        <TableCell align="right">
          <Stack direction="row" spacing={1}>
            {
              row.isPaid ? 
              <Chip sx={{bgcolor: theme.palette.success.main, fontWeight: 700}} label="complete" /> 
              : 
              <Chip sx={{bgcolor: theme.palette.dashboard.main, fontWeight: 700}} color='primary' label="pending" />
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
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
                            alt={item?.title}
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

export default function SingleUserOrders(props) {
  const { rows, rowsGuest } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [pageGuest, setPageGuest] = React.useState(0);
  const [rowsPerPageGuest, setRowsPerPageGuest] = React.useState(10);
  const [activeTab, setActiveTab] = React.useState(0);
  const matches = useMediaQuery('(min-width: 560px)');
  const [search, setSearch] = React.useState('');

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  function convertDate(value) {
    const date = new Date(value);
    const formatDate = date.toLocaleDateString("en-US", options);
    return formatDate;
  }

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

  const hasWord = (word, toMatch) => {
    let wordSplitted = word.split(' ');
      if(wordSplitted.join(' ').includes(toMatch)) {
        return true;
      }
      return false;
  };

  function searchTable(rows) {
    return rows && rows.lenght !== 0 ? rows.filter((row) => ((row.personalInfo.name && hasWord(row.personalInfo.name.toLowerCase(), search.toLowerCase())) || (row.orderNumber && row.orderNumber.indexOf(search) > -1)) || (row.shipping.shippingMethod && hasWord(row.shipping.shippingMethod.toLowerCase(), search.toLowerCase()) || (row.payment.paymentMethod.toString() && hasWord(row.payment.paymentMethod.toString().toLowerCase(), search.toLowerCase())) || (row.createdAt.toString() && hasWord(convertDate(row.createdAt).toLowerCase(), search.toLowerCase())) )) : rows;
  }

  const usersTabs = ['All Orders', 'Paid Orders', 'Delivered']

  return (
    <Box>
      <Typography variant='h6' component='h2'>
        Orders
      </Typography>
      <Box component='nav' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
        <Box sx={{listStyle: 'none', display: 'flex', flexWrap: 'wrap', p: 0}} component="ul">
          {
            usersTabs.map((tab, index) => (
              <Box key={tab + index} sx={{pl: {xs: 1, md: 3} }} component='li'>
                <Button value={index} onClick={(e) => setActiveTab(e.target.value)} sx={{bgcolor: usersTabs[activeTab] === tab ? theme.palette.dashboard.main : theme.palette.primary.main, fontSize: matches ? '.75rem' : '.5rem', p: {xs: '6px 8px'} }} variant="contained">
                  {tab}
                </Button>
              </Box>
            ))
          }
        </Box>
        <Box sx={{py: 1, display: 'flex', justifyContent: 'left', flexWrap: 'wrap', width: {xs: '100%', md: 'auto'}}}>
          <Search component="div">
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Box>
      </Box>
      <TableContainer sx={{bgcolor: 'transparent'}} elevation={0} component={Paper}>
        {
          Object.keys(rows).length === 0 ?
          <Item sx={{ '& a': {textDecoration: 'none' } }} elevation={0}>
            <Typography component="p" variant="h6">
              There are no items in orders
            </Typography>
          </Item>
          :
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
              {
                (search !== '' ? searchTable(rows) : usersTabs[activeTab] === 'All Orders' ? rows : usersTabs[activeTab] === 'Paid Orders' ? rows?.filter(row => row.isPaid === true) : rows?.filter(row => row.isDelevered === true))
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <Row key={row._id} row={row} />
                ))
              }
            </TableBody>
          </Table>
        }
      </TableContainer>
      {
        Object.keys(rows).length !== 0 &&
        <TablePagination
          rowsPerPageOptions={[3, 10, 25, 100]}
          component="div"
          count={rows?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      }
      <Box sx={{py: 5}}></Box>
      <Typography variant='h6' component='h2'>
        Orders as a Guest
      </Typography>

       <TableContainer sx={{bgcolor: 'transparent'}} elevation={0} component={Paper}>
        {
          Object.keys(rowsGuest).length === 0 ?
          <Item sx={{ '& a': {textDecoration: 'none' } }} elevation={0}>
            <Typography component="p" variant="h6">
              There are no items in orders
            </Typography>
          </Item>
          :
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
              {
                rowsGuest?.slice(pageGuest * rowsPerPageGuest, pageGuest * rowsPerPageGuest + rowsPerPageGuest).map((row) => (
                  <Row key={row._id} row={row} />
                ))
              }
            </TableBody>
          </Table>
        }
      </TableContainer>
      {
        Object.keys(rowsGuest).length !== 0 &&
        <TablePagination
          rowsPerPageOptions={[3, 10, 25, 100]}
          component="div"
          count={rowsGuest?.length}
          rowsPerPage={rowsPerPageGuest}
          page={pageGuest}
          onPageChange={handleChangePageGuest}
          onRowsPerPageChange={handleChangeRowsPerPageGuest}
        />
      }
    </Box>
  );
}
