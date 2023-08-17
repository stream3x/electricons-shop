import React, { useReducer } from 'react';
import DashboardLayout from '../../../src/layout/DashboardLayout';
import Order from '../../../models/Order';
import Guest from '../../../models/Guest';
import { AppBar, Backdrop, Box, Button, Checkbox, Collapse, Grid, IconButton, InputBase, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from '@mui/material';
import SelectPages from '../../../src/assets/SelectPages';
import theme from '../../../src/theme';
import { useRouter } from 'next/router';
import db from '../../../src/utils/db';
import Link from '../../../src/Link';
import styled from '@emotion/styled';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.white,
  border: 'thin solid lightGrey',
  borderLeft: '5px solid black',
}));

function reducer(state, action) {
  switch(action.type) {
    case 'FETCH_REQUEST': {
      return { ...state, loading: true, error: '' };
    }
    case 'FETCH_SUCCESS': {
        return { ...state, loading: false, userOrders: action.payload, guestUserOrders: action.payload, error: '' };
    }
    case 'FETCH_FAIL': {
      return { ...state, loading: false, error: action.payload };
    }
    default:
      return state;
  }
}

export async function getServerSideProps(context) {
  const page = parseInt(context.query.page) || 1;
  const PAGE_SIZE = 10; // Number of items per page
  const pageSize = context.query.pageSize || PAGE_SIZE;

  try {
    db.connect();
    const totalOrders = await Order.countDocuments();
    const totalPages = Math.ceil(totalOrders / pageSize);
    const orders = await Order.find().sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).exec();
    const guestOrders = await Guest.find().sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).exec();
    db.disconnect();

    return {
      props: {
        orders: JSON.parse(JSON.stringify(orders && orders)),
        guestOrders: JSON.parse(JSON.stringify(guestOrders && guestOrders)),
        pageSize,
        totalPages
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        orders: [],
        guestOrders: [],
        pageSize: 0,
        totalPages: 0
      },
    };
  }
}

const MyTableContainer = styled(TableContainer)({
  overflowY: "auto",
  margin: 0,
  padding: 0,
  listStyle: "none",
  height: "100%",
  '&::-webkit-scrollbar': {
    width: '3px',
    height: '3px'
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.secondary.borderColor
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '3px'
  }
});

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
  border: 'thin solid transparent',
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
  '& svg': {
    fill: 'white'
  }
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'white',
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

function EnhancedTableToolbar(props) {
  const { numSelected, selectedItems, numChildSelected, selectedChildItems } = props;

  function removeItemHandler(item, childItem) {
    
  }
// console.log(numSelected, selectedItems, numChildSelected, selectedChildItems);
  return (
    <Toolbar
      sx={{
        width: '100%',
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 || numChildSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%', textAlign: 'left' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected + numChildSelected} {'selected'}
        </Typography>
      ) : 
        <Typography component="h1" variant="h6">
          
        </Typography>
      }

      {numSelected > 0 || numChildSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => removeItemHandler(selectedItems, selectedChildItems)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ): null}
    </Toolbar>
  );
}

function Row(props) {
  const { row, index, isItemSelected, labelId, handleClick, isChildSelected, handleChildeCheckbox } = props;
  const [open, setOpen] = React.useState(false);

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  function convertDate(value) {
    const date = new Date(value);
    const formatDate = date.toLocaleDateString("en-US", options);
    return formatDate;
  }

  return (
    <React.Fragment>
      <TableRow
          hover
          key={row._id}
        >
          <TableCell
            onClick={(event) => handleClick(event, row._id, row)}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            selected={isItemSelected}
            padding="checkbox"
          >
            <Checkbox
              color="primary"
              checked={isItemSelected}
              inputProps={{
                'aria-labelledby': labelId,
              }}
            />
          </TableCell>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell color='primary' align="right">
            {convertDate(row.createdAt)}
          </TableCell>
          <TableCell color='primary' align="right">
            {row.personalInfo.name}
          </TableCell>
          <TableCell color='primary' align="right">
            {row?.addresses.address}{row.addresses.city ? ', ' : ''}{row?.addresses.city}{row.addresses.postalcode ? ', ' : ''}{row?.addresses.postalcode}{row.addresses.country ? ', ' : ''}{row?.addresses.country}
          </TableCell>
          <TableCell color='primary' align="right">
            {row?.payment.paymentMethod}
          </TableCell>
          <TableCell color='primary' align="right">
            {row?.personalInfo.email}
          </TableCell>
          <TableCell color='primary' align="right">
            {row?.personalInfo.company}
          </TableCell>
          <TableCell align="right">
            {row?.personalInfo.phone}
          </TableCell>
          <TableCell color='primary' align="right">
            {row?.orderNumber}
          </TableCell>
          <TableCell align="right">
            {row?.personalInfo.vatNumber}
          </TableCell>
          <TableCell align="right">
            <Stack direction="row" spacing={1}>
              {
                row.isPaid ? 
                <Chip sx={{bgcolor: theme.palette.success.main}} label="complete" /> 
                : 
                <Chip sx={{bgcolor: theme.palette.error.main}} color='primary' label="not paid" />
              }
            </Stack>
          </TableCell>
          <TableCell align="right">
            {row?.total.toFixed(2)}
          </TableCell>
      </TableRow>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order Items
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="right">Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Tax</TableCell>
                    <TableCell align="right">Price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.orderItems.map((item) => {
                    const labelItemId = `enhanced-item-checkbox-${index}`;
                    const isChildeItemSelected = isChildSelected(item.title);
                    return (

                      <TableRow
                          hover
                          key={item._id}
                        >
                          <TableCell
                            onClick={(event) => handleChildeCheckbox(event, item.title, item)}
                            role="checkbox"
                            aria-checked={isChildeItemSelected}
                            tabIndex={-1}
                            selected={isChildeItemSelected}
                            padding="checkbox"
                          >
                            <Checkbox
                              color="primary"
                              checked={isChildeItemSelected}
                              inputProps={{
                                'aria-labelledby': labelItemId,
                              }}
                            />
                          </TableCell>
                          <TableCell color='primary' align="right">
                            {item.title}
                          </TableCell>
                          <TableCell color='primary' align="right">
                            {item.quantity}
                          </TableCell>
                          <TableCell align="right">
                            {row?.taxCost}
                          </TableCell>
                          <TableCell color='primary' align="right">
                            {item.price}
                          </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Orders(props) {
  const { orders, guestOrders, pageSize, totalPages } = props;
  const router = useRouter();
  const [searchFilter, setSearchFilter] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [childeSelected, setChildeSelected] = React.useState([]);
  const [selectedChildeItems, setSelectedChildeItems] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [searchGuest, setSearchGuest] = React.useState('');

  const [{ loading, error, userOrders, guestUserOrders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: ''
  });

  React.useEffect(() => {
    async function getOrders() {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const res = await orders;
        dispatch({ type: 'FETCH_SUCCESS', payload: res });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    } 
    getOrders();

  }, []);

  React.useEffect(() => {
    async function getOrders() {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const res = await guestOrders;
        dispatch({ type: 'FETCH_SUCCESS', payload: res });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    } 
    getOrders();

  }, []);
  
  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleClick = (event, name, item) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    let newSelectedItems = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
      newSelectedItems = newSelectedItems.concat(selectedItems, item);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newSelectedItems = newSelectedItems.concat(selectedItems.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newSelectedItems = newSelectedItems.concat(selectedItems.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
      newSelectedItems = newSelectedItems.concat(
        selectedItems.slice(0, selectedIndex),
        selectedItems.slice(selectedIndex + 1)
        );
    }
    setSelected(newSelected);
    setSelectedItems(newSelectedItems);
  };

  const isChildSelected = (name) => childeSelected.indexOf(name) !== -1;

  const handleChildeCheckbox = (event, name, item) => {
    const selectedIndex = childeSelected.indexOf(name);
    let newSelected = [];
    let newSelectedItems = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(childeSelected, name);
      newSelectedItems = newSelectedItems.concat(selectedChildeItems, item);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(childeSelected.slice(1));
      newSelectedItems = newSelectedItems.concat(selectedChildeItems.slice(1));
    } else if (selectedIndex === childeSelected.length - 1) {
      newSelected = newSelected.concat(childeSelected.slice(0, -1));
      newSelectedItems = newSelectedItems.concat(selectedChildeItems.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        childeSelected.slice(0, selectedIndex),
        childeSelected.slice(selectedIndex + 1),
      );
      newSelectedItems = newSelectedItems.concat(
        selectedChildeItems.slice(0, selectedIndex),
        selectedChildeItems.slice(selectedIndex + 1)
        );
    }
    setChildeSelected(newSelected);
    setSelectedChildeItems(newSelectedItems);
  };

  const {
    query = '',
  } = router.query;

  const filterSearch = ({
    page,
    pageSize,
  }) => {
    const { query } = router;
    if(page) query.page = page;
    if(pageSize) query.pageSize = pageSize;
    router.push({
      pathname: router.pathname,
      query: query
    });
  };

  const searchHandler = (item) => {
    if(item) {
      setSearchFilter([item])
    }else {
      setSearchFilter([])
    }
    filterSearch({ query: item});
  };

  React.useEffect(() => {
    searchHandler(query);
  }, [query]);

  const pageSizeHandler = (num) => {
    filterSearch({ pageSize: num });
  };

  const pageHandler = (page) => {
    filterSearch({ page });
  };

  const hasWord = (word, toMatch) => {
    let wordSplitted = word.split(' ');
      if(wordSplitted.join(' ').includes(toMatch)) {
        return true;
      }
      return false;
  };

  function searchTable(rows) {
    return rows && rows.lenght !== 0 ? rows.filter((row) => ((row.personalInfo.name && hasWord(row.personalInfo.name.toLowerCase(), search.toLowerCase())) || (row.personalInfo.email && hasWord(row.personalInfo.email.toLowerCase(), search.toLowerCase()))) || (row.payment.paymentMethod && hasWord(row.payment.paymentMethod.toLowerCase(), search.toLowerCase()))  || (row.personalInfo.company && hasWord(row.personalInfo.company.toLowerCase(), search.toLowerCase())) || (row.orderNumber && hasWord(row.orderNumber, search.toLowerCase()))) : orders;
  }

  function searchGuestTable(rows) {
    return rows && rows.lenght !== 0 ? rows.filter((row) => ((row.personalInfo.name && hasWord(row.personalInfo.name.toLowerCase(), searchGuest.toLowerCase())) || (row.personalInfo.email && hasWord(row.personalInfo.email.toLowerCase(), searchGuest.toLowerCase()))) || (row.payment.paymentMethod && hasWord(row.payment.paymentMethod.toLowerCase(), searchGuest.toLowerCase()))  || (row.personalInfo.company && hasWord(row.personalInfo.company.toLowerCase(), searchGuest.toLowerCase())) || (row.orderNumber && hasWord(row.orderNumber, searchGuest.toLowerCase()))) : guestOrders;
  }

  return (
    <DashboardLayout>
      {
        loading ?
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        : error ?
        <LabelButton sx={{width: '100%', my: 5, p: 2}}>
          <Typography sx={{m: 0, p: 1, fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h5" component="h1" gutterBottom>
          {error}
          </Typography>
        </LabelButton>
       :
        <React.Fragment>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={1} sx={{pt: 5, px: {xs: 1, md: 3}, mt: 5}}>
                <Box sx={{ width: '100%', minHeight: '1px', py: 3, background: `linear-gradient(60deg, #ab47bc, #8e24aa)`, boxShadow: '0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(156, 39, 176,.4)', px: {xs: 1, md: 5}, mt: '-80px', borderRadius: 1, mb: 5, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <Typography sx={{flexGrow: 0, display: 'flex', alignItems: 'center'}} component='h2' variant='h6' color={theme.palette.primary.contrastText}>User Orders</Typography>
                  <Box sx={{py: 0, display: 'flex', justifyContent: 'right', flexWrap: 'wrap', width: {xs: '100%', md: 'auto'}}}>
                    <Search component="form">
                      <SearchIconWrapper>
                        <SearchIcon />
                      </SearchIconWrapper>
                      <StyledInputBase
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="#name, #email, #order…"
                        inputProps={{ 'aria-label': 'search' }}
                      />
                    </Search>
                  </Box>
                </Box>
                <MyTableContainer>
                  <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={'small'}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell align="right">Date</TableCell>
                        <TableCell align="right">Name</TableCell>
                        <TableCell align="right">Ship To</TableCell>
                        <TableCell align="right">Payment Method</TableCell>
                        <TableCell align="right">Email</TableCell>
                        <TableCell align="right">Company</TableCell>
                        <TableCell align="right">Phone</TableCell>
                        <TableCell align="right">Order Number</TableCell>
                        <TableCell align="right">VAT</TableCell>
                        <TableCell align="right">Paid</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchTable(userOrders)
                        .map((row, index) => {
                          const labelId = `enhanced-table-checkbox-${index}`;
                          const isItemSelected = isSelected(row._id);

                          return (
                            <Row
                            key={row._id}
                            row={row}
                            index={index}
                            labelId={labelId}
                            isItemSelected={isItemSelected}
                            childeSelected={childeSelected}
                            selectedChildeItems={selectedChildeItems}
                            isChildSelected={isChildSelected}
                            handleChildeCheckbox={handleChildeCheckbox}
                            handleClick={handleClick}
                            />
                          );
                        })}
                      {userOrders.length > 0 && (
                        <TableRow
                          style={{
                            height: (33) * userOrders.length,
                          }}
                        >
                          <TableCell colSpan={12} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </MyTableContainer>
                <EnhancedTableToolbar
                numSelected={selected.length}
                selectedItems={selectedItems}
                numChildSelected={childeSelected.length}
                selectedChildItems={selectedChildeItems}
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <AppBar elevation={1} sx={{bgcolor: theme.palette.primary.white}} position="static">
                <Toolbar sx={{display: 'flex', flexWrap: 'wrap'}}>
                  <SelectPages values={['1', '5', '10', '20']} pageSize={pageSize} pageSizeHandler={pageSizeHandler}  />
                  {
                    searchTable(userOrders).length === 0 ?
                    <Typography sx={{ m: {xs: 'auto', sm: 0}, ml: 2, flexGrow: 1, fontSize: {xs: '12px', sm: '16px'}, textAlign: {xs: 'center', sm: 'left'}, py: 3, width: {xs: '100%', sm: 'auto'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    "No Orders"
                    </Typography>
                    :
                    <Typography sx={{ m: {xs: 'auto', sm: 0}, ml: 2, fontSize: {xs: '12px', sm: '16px'}, flexGrow: 1, py: 3, width: {xs: '100%', sm: 'auto'}, textAlign: {xs: 'center', sm: 'left'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    There are {searchTable(userOrders).length} {searchTable(userOrders).length === 1 ? "order" : "orders"}.
                  </Typography>
                  }
                  {
                    searchTable(userOrders).length > 0 &&
                    <Stack sx={{width: {xs: '100%', sm: 'auto'}, py: 2 }} spacing={2}>
                      <Pagination sx={{mx: 'auto'}} count={totalPages} color="primary" showFirstButton showLastButton onChange={(e, value) => pageHandler(value)}  />
                    </Stack>
                  }
                </Toolbar>
              </AppBar>
            </Grid>
          </Grid>
          <Box sx={{py: 5}}></Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={1} sx={{pt: 5, px: {xs: 1, md: 3}, mt: 5}}>
              <Box sx={{ width: '100%', minHeight: '1px', py: 3, background: `linear-gradient(60deg, #ab47bc, #8e24aa)`, boxShadow: '0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(156, 39, 176,.4)', px: {xs: 1, md: 5}, mt: '-80px', borderRadius: 1, mb: 5, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <Typography sx={{flexGrow: 0, display: 'flex', alignItems: 'center'}} component='h2' variant='h6' color={theme.palette.primary.contrastText}>Guest Orders</Typography>
                  <Box sx={{py: 0, display: 'flex', justifyContent: 'right', flexWrap: 'wrap', width: {xs: '100%', md: 'auto'}}}>
                    <Search component="form">
                      <SearchIconWrapper>
                        <SearchIcon />
                      </SearchIconWrapper>
                      <StyledInputBase
                        onChange={(e) => setSearchGuest(e.target.value)}
                        placeholder="#name, #email, #order…"
                        inputProps={{ 'aria-label': 'search' }}
                      />
                    </Search>
                  </Box>
                </Box>
                <MyTableContainer>
                  <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={'small'}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell align="right">Date</TableCell>
                        <TableCell align="right">Name</TableCell>
                        <TableCell align="right">Ship To</TableCell>
                        <TableCell align="right">Payment Method</TableCell>
                        <TableCell align="right">Email</TableCell>
                        <TableCell align="right">Company</TableCell>
                        <TableCell align="right">Phone</TableCell>
                        <TableCell align="right">Order Number</TableCell>
                        <TableCell align="right">VAT</TableCell>
                        <TableCell align="right">Paid</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchGuestTable(guestUserOrders)
                        .map((row, index) => {
                          const labelId = `enhanced-table-checkbox-${index}`;
                          const isItemSelected = isSelected(row._id);

                          return (
                            <Row
                            key={row._id}
                            row={row}
                            index={index}
                            labelId={labelId}
                            isItemSelected={isItemSelected}
                            childeSelected={childeSelected}
                            selectedChildeItems={selectedChildeItems}
                            isChildSelected={isChildSelected}
                            handleChildeCheckbox={handleChildeCheckbox}
                            handleClick={handleClick}
                            />
                          );
                        })}
                      {guestUserOrders.length > 0 && (
                        <TableRow
                          style={{
                            height: (33) * guestUserOrders.length,
                          }}
                        >
                          <TableCell colSpan={12} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </MyTableContainer>
                <EnhancedTableToolbar
                numSelected={selected.length}
                selectedItems={selectedItems}
                numChildSelected={childeSelected.length}
                selectedChildItems={selectedChildeItems}
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <AppBar elevation={1} sx={{bgcolor: theme.palette.primary.white}} position="static">
                <Toolbar sx={{display: 'flex', flexWrap: 'wrap'}}>
                  <SelectPages values={['1', '5', '10', '20']} pageSize={pageSize} pageSizeHandler={pageSizeHandler}  />
                  {
                    searchGuestTable(guestUserOrders).length === 0 ?
                    <Typography sx={{ m: {xs: 'auto', sm: 0}, ml: 2, flexGrow: 1, fontSize: {xs: '12px', sm: '16px'}, textAlign: {xs: 'center', sm: 'left'}, py: 3, width: {xs: '100%', sm: 'auto'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    "No Orders"
                    </Typography>
                    :
                    <Typography sx={{ m: {xs: 'auto', sm: 0}, ml: 2, fontSize: {xs: '12px', sm: '16px'}, flexGrow: 1, py: 3, width: {xs: '100%', sm: 'auto'}, textAlign: {xs: 'center', sm: 'left'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    There are {searchGuestTable(guestUserOrders).length} {searchGuestTable(guestUserOrders).length === 1 ? "order" : "orders"}.
                  </Typography>
                  }
                  {
                    searchGuestTable(guestUserOrders).length > 0 &&
                    <Stack sx={{width: {xs: '100%', sm: 'auto'}, py: 2 }} spacing={2}>
                      <Pagination sx={{mx: 'auto'}} count={totalPages} color="primary" showFirstButton showLastButton onChange={(e, value) => pageHandler(value)}  />
                    </Stack>
                  }
                </Toolbar>
              </AppBar>
            </Grid>
          </Grid>
        </React.Fragment>
      }
    </DashboardLayout>
  )
}
