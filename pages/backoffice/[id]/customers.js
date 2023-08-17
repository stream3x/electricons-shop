import React, { useReducer } from 'react';
import DashboardLayout from '../../../src/layout/DashboardLayout';
import { AppBar, Backdrop, Box, Button, Checkbox, Chip, Grid, IconButton, InputBase, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Tooltip, Typography, useMediaQuery } from '@mui/material';
import SelectPages from '../../../src/assets/SelectPages';
import theme from '../../../src/theme';
import { useRouter } from 'next/router';
import db from '../../../src/utils/db';
import styled from '@emotion/styled';
import User from '../../../models/User';
import SearchIcon from '@mui/icons-material/Search';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AlertDialogSlide from '../../../src/assets/AlertDialogSlide';
import Guest from '../../../models/Guest';
import CircularProgress from '@mui/material/CircularProgress';
import dynamic from 'next/dynamic';

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
        return { ...state, loading: false, customers: action.payload, error: '' };
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
    const totalUser = await User.countDocuments();
    const guestOrders = await Guest.find()
      // Assuming you have a product reference in orderItems
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    // Fetch User data (if needed) and add to customers
    const users = await User.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean()
    .exec();
    db.disconnect();

    // Combine personalInfo from GuestOrder with User data
    const customers = guestOrders.map(guestOrder => {
      return {
        name: guestOrder.personalInfo.name,
        email: guestOrder.personalInfo.email,
        address: guestOrder.personalInfo.address ? guestOrder.personalInfo.address : '',
        city: guestOrder.personalInfo.city ? guestOrder.personalInfo.address : '',
        country: guestOrder.personalInfo.country ? guestOrder.personalInfo.country : '',
        postalcode: guestOrder.personalInfo.postalcode ? guestOrder.personalInfo.postalcode : '',
        company: guestOrder.personalInfo.company ? guestOrder.personalInfo.company : '',
        phone: guestOrder.personalInfo.phone ? guestOrder.personalInfo.phone : '',
        vatNumber: guestOrder.personalInfo.vatNumber ? guestOrder.personalInfo.vatNumber : '',
        newsletter: guestOrder.personalInfo.newsletter ? guestOrder.personalInfo.newsletter : '',
        createdAt: guestOrder.createdAt ? guestOrder.createdAt.toString() : '',
        birthday: guestOrder.personalInfo.birthday ? guestOrder.personalInfo.birthday : ''
      };
    });

    const uniqueCustomers = [];
    customers.filter(customer => {
      const duplicate = uniqueCustomers.findIndex(unique => unique.email === customer.email);
      if (duplicate <= -1) {
        uniqueCustomers.push(customer);
      }
    })

    const allUsers = [...users, ...uniqueCustomers];
    const totalPages = Math.ceil((uniqueCustomers.length - 1 + totalUser) / pageSize);

    return {
      props: {
        users: JSON.parse(JSON.stringify(allUsers)),
        totalPages,
        pageSize
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        users: [],
        totalPages: 0,
        pageSize: 0
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

function EnhancedTableToolbar(props) {
  const { numSelected, selectedItems } = props;
  const [open, setOpen] = React.useState(false);
  

  function removeUserHandler(selectedItems) {
    console.log(selectedItems, 'now you deleted user');
    setOpen(() => false);
  }

  function editItemHandler(item) {
    console.log(item, `edit user ${item.map(item => item.name)}`);
  }

  const handleClose = () => {
    setOpen(false);
  };

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
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%', textAlign: 'left' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} {'selected'}
        </Typography>
      ) : 
        <Typography component="h1" variant="h6">
          
        </Typography>
      }

      {numSelected > 0 ? (
        <Box sx={{display: 'flex'}}>
          <Tooltip title="Edit">
            <IconButton onClick={() => editItemHandler(selectedItems)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => setOpen(true)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ): null}
      <AlertDialogSlide removeUserHandler={removeUserHandler} open={open} setOpen={setOpen} handleClose={handleClose} selectedItems={selectedItems} />
    </Toolbar>
  );
}

function Customers(props) {
  const { users, pageSize, totalPages } = props;
  const router = useRouter();
  const [searchFilter, setSearchFilter] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [activeTab, setActiveTab] = React.useState(0);
  const matches = useMediaQuery('(min-width: 560px)');

  const [{ loading, error, customers }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: ''
  });

  React.useEffect(() => {
    async function getOrders() {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const res = await users;
        dispatch({ type: 'FETCH_SUCCESS', payload: res });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    } 
    getOrders();

  }, [users]);

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  function convertDate(value) {
    const date = new Date(value);
    const formatDate = date.toLocaleDateString("en-US", options);
    return formatDate;
  }

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

  const hasWord = (word, toMatch) => {
    let wordSplitted = word.split(' ');
      if(wordSplitted.join(' ').includes(toMatch)) {
        return true;
      }
      return false;
  };

  function searchTable(rows) {
    return rows && rows.lenght !== 0 ? rows.filter((row) => ((row.name && hasWord(row.name.toLowerCase(), search.toLowerCase())) || (row.email && hasWord(row.email.toLowerCase(), search.toLowerCase()))) || (row.address && hasWord(row.address.toLowerCase(), search.toLowerCase()))  || (row.city && hasWord(row.city.toLowerCase(), search.toLowerCase()))) : users;
  }

  const usersTabs = ['All Customers', 'Administrators', 'Subscribers']

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
        <Grid container spacing={3} sx={{pr: {xs: '0px'}}}>
          <Grid item xs={12} sx={{p: {xs: '24px 12px 0px 20px!important'}}}>
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
                <Search component="form">
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
          </Grid>
          <Grid item xs={12}>
            <MyTableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={'small'}
              >
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Name</TableCell>
                    <TableCell align="right">Address</TableCell>
                    <TableCell align="right">Email</TableCell>
                    <TableCell align="right">Company</TableCell>
                    <TableCell align="right">Phone</TableCell>
                    <TableCell align="right">VAT number</TableCell>
                    <TableCell align="right">Newsletter</TableCell>
                    <TableCell align="right">Birthday</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(usersTabs[activeTab] === 'All Customers' ? searchTable(customers) : usersTabs[activeTab] === 'Administrators' ? customers.filter(user => user.isAdmin === true) : customers.filter(user => user.newsletter === "newsletter"))
                    .map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;
                      const isItemSelected = isSelected(row.name);

                      return (
                        <TableRow
                          hover
                          key={row._id}
                        >
                          <TableCell
                            onClick={(event) => handleClick(event, row.name, row)}
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
                          <TableCell color='primary' align="right">
                            {convertDate(row.createdAt)}
                          </TableCell>
                          <TableCell color='primary' align="right">
                            {row.name}
                          </TableCell>
                          <TableCell color='primary' align="right">
                            {row?.address}{row.city ? ', ' : ''}{row?.city}{row.postalcode ? ', ' : ''}{row?.postalcode}{row.country ? ', ' : ''}{row?.country}
                          </TableCell>
                          <TableCell color='primary' align="right">
                            {row?.email}
                          </TableCell>
                          <TableCell color='primary' align="right">
                            {row?.company}
                          </TableCell>
                          <TableCell align="right">
                            {row?.phone && `+${row.phone}`}
                          </TableCell>
                          <TableCell align="right">
                            {row?.vatNumber}
                          </TableCell>
                          <TableCell align="right">
                            {row?.newsletter ? <Chip sx={{bgcolor: theme.palette.success.main}} label="subscribed" /> : <Chip sx={{bgcolor: theme.palette.error.main}} color='primary' label="not subscribed" />}
                          </TableCell>
                          <TableCell align="right">
                            {row?.birthday}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {customers.length > 0 && (
                    <TableRow
                      style={{
                        height: (20) * customers.length,
                      }}
                    >
                      <TableCell colSpan={10} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </MyTableContainer>
          </Grid>
          <Grid item xs={12}>
            <EnhancedTableToolbar
            numSelected={selected.length}
            selectedItems={selectedItems}
            />
          </Grid>
          <Grid item xs={12}>
            <AppBar elevation={0} sx={{bgcolor: 'transparent'}} position="static">
              <Toolbar sx={{display: 'flex', flexWrap: 'wrap'}}>
                <SelectPages values={['1', '5', '10', '20']} pageSize={pageSize} pageSizeHandler={pageSizeHandler}  />
                {
                  customers.length === 0 ?
                  <Typography sx={{ m: {xs: 'auto', sm: 0}, ml: 2, flexGrow: 1, fontSize: {xs: '12px', sm: '16px'}, textAlign: {xs: 'center', sm: 'left'}, py: 3, width: {xs: '100%', sm: 'auto'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                  "No Orders"
                  </Typography>
                  :
                  <Typography sx={{ m: {xs: 'auto', sm: 0}, ml: 2, fontSize: {xs: '12px', sm: '16px'}, flexGrow: 1, py: 3, width: {xs: '100%', sm: 'auto'}, textAlign: {xs: 'center', sm: 'left'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                  There are {customers.length} {customers.length === 1 ? "user" : "users"}.
                </Typography>
                }
                {
                  customers.length > 0 &&
                  <Stack sx={{width: {xs: '100%', sm: 'auto'}, py: 2 }} spacing={2}>
                    <Pagination sx={{mx: 'auto'}} count={totalPages} color="primary" showFirstButton showLastButton onChange={(e, value) => pageHandler(value)}  />
                  </Stack>
                }
              </Toolbar>
            </AppBar>
          </Grid>
        </Grid>
      }
    </DashboardLayout>
  )
}

export default dynamic(() => Promise.resolve(Customers), { ssr: false });
