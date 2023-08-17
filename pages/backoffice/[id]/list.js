import React from 'react';
import DashboardLayout from '../../../src/layout/DashboardLayout';
import { AppBar, Box, Button, Checkbox, Chip, Grid, IconButton, InputBase, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Tooltip, Typography } from '@mui/material';
import SelectPages from '../../../src/assets/SelectPages';
import theme from '../../../src/theme';
import { useRouter } from 'next/router';
import db from '../../../src/utils/db';
import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AlertDialogSlide from '../../../src/assets/AlertDialogSlide';
import Product from '../../../models/Product';
import Order from '../../../models/Order';
import Guest from '../../../models/Guest';
import Link from '../../../src/Link';

export async function getServerSideProps(context) {
  const page = parseInt(context.query.page) || 1;
  const PAGE_SIZE = 10; // Number of items per page
  const pageSize = context.query.pageSize || PAGE_SIZE;

  try {
    db.connect();
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / pageSize);
    const products = await Product.find().sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).exec();
    const orders = await Order.find().lean().exec();
    const guestOrders = await Guest.find().lean().exec();

    db.disconnect();

    const productOrderCounts = [];

    if (products.length !== 0 && orders.length !== 0 && guestOrders.length !== 0) {
      const productCounts = products.map(product => {
        const orderCount = orders.concat(guestOrders).reduce((count, order) => {
          if (order.orderItems.some(orderProduct => orderProduct._id.toString() === product._id.toString())) {
            return count + 1;
          }
          return count;
        }, 0);
        return { ...product.toObject(), orderCount };
      });
      productOrderCounts.push(productCounts);
    }

    db.disconnect();

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        pageSize,
        totalPages,
        productOrderCounts: JSON.parse(JSON.stringify(productOrderCounts &&productOrderCounts[0]))
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        products: [],
        pageSize: 0,
        totalPages: 0,
        productOrderCounts: []
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
  width: 'auto',
  [theme.breakpoints.down('sm')]: {
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

export default function ProductList(props) {
  const { pageSize, totalPages, productOrderCounts } = props;
  const router = useRouter();
  const { id } = router.query;
  const [searchFilter, setSearchFilter] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [activeTab, setActiveTab] = React.useState(0);

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
    return rows && rows.lenght !== 0 ? rows.filter((row) => ((row.title && hasWord(row.title.toLowerCase(), search.toLowerCase())) || (row.category && hasWord(row.category.toLowerCase(), search.toLowerCase()))) || (row.subCategory && hasWord(row.subCategory.toLowerCase(), search.toLowerCase()))  || (row.rating && hasWord(row.rating.toString(), search.toLowerCase()))) : users;
  }

  const usersTabs = ['Create product']

  return (
    <DashboardLayout>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box component='nav' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            <Box sx={{listStyle: 'none', display: 'flex'}} component="ul">
              {
                usersTabs.map((tab, index) => (
                  <Box key={tab} sx={{pl: 3}} component='li'>
                    <Link href={`/backoffice/${id}/create`}>
                      <Button value={index} onClick={(e) => setActiveTab(e.target.value)} sx={{bgcolor: usersTabs[activeTab] === tab ? theme.palette.dashboard.main : theme.palette.primary.main}} variant="contained" size="medium">
                        {'+ '}{tab}
                      </Button>
                    </Link>
                  </Box>
                ))
              }
            </Box>
            <Box sx={{py: 1, display: 'flex', justifyContent: 'left', flexWrap: 'wrap'}}>
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
                  <TableCell align="right">Product Name</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell align="right">Rating</TableCell>
                  <TableCell align="right">Categories</TableCell>
                  <TableCell align="right">Sub Categories</TableCell>
                  <TableCell align="right">Orders</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchTable(productOrderCounts)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const isItemSelected = isSelected(row.title);

                    return (
                      <TableRow
                        hover
                        key={row._id}
                      >
                        <TableCell
                          onClick={(event) => handleClick(event, row.title, row)}
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
                          {row.title}
                        </TableCell>
                        <TableCell color='primary' align="right">
                          {'$'}{row?.price}
                        </TableCell>
                        <TableCell color='primary' align="right">
                          {
                            row?.inStock === 0 ? <Chip sx={{bgcolor: theme.palette.error.main, color: theme.palette.primary.contrastText}} label={row?.inStock} /> : <Chip sx={{bgcolor: theme.palette.success.main}} label={row?.inStock} />
                          }
                        </TableCell>
                        <TableCell color='primary' align="right">
                          <Box component='span' sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                            <Box component='span'>{row?.rating}</Box>
                            <Box component='span'><StarIcon sx={{color: 'gold'}} /></Box>
                          </Box>
                          
                        </TableCell>
                        <TableCell align="right">
                          {row?.category}
                        </TableCell>
                        <TableCell align="right">
                          {row?.subCategory}
                        </TableCell>
                        <TableCell align="right">
                          {
                          row?.orderCount === 0 ? <Chip sx={{bgcolor: theme.palette.dashboard.main, color: theme.palette.primary.contrastText}} label={row?.orderCount} /> : <Chip sx={{bgcolor: theme.palette.success.main}} label={row?.orderCount} />
                          }
                        </TableCell>
                        <TableCell align="right">
                          
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {productOrderCounts.length > 0 && (
                  <TableRow
                    style={{
                      height: (6) * productOrderCounts.length,
                    }}
                  >
                    <TableCell colSpan={12} />
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
                productOrderCounts.length === 0 ?
                <Typography sx={{ m: {xs: 'auto', sm: 0}, ml: 2, flexGrow: 1, fontSize: {xs: '12px', sm: '16px'}, textAlign: {xs: 'center', sm: 'left'}, py: 3, width: {xs: '100%', sm: 'auto'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                "No Orders"
                </Typography>
                :
                <Typography sx={{ m: {xs: 'auto', sm: 0}, ml: 2, fontSize: {xs: '12px', sm: '16px'}, flexGrow: 1, py: 3, width: {xs: '100%', sm: 'auto'}, textAlign: {xs: 'center', sm: 'left'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                There are {productOrderCounts.length} {productOrderCounts.length === 1 ? "product" : "products"}.
              </Typography>
              }
              {
                productOrderCounts.length > 0 &&
                <Stack sx={{width: {xs: '100%', sm: 'auto'}, py: 2 }} spacing={2}>
                  <Pagination sx={{mx: 'auto'}} count={totalPages} color="primary" showFirstButton showLastButton onChange={(e, value) => pageHandler(value)}  />
                </Stack>
              }
            </Toolbar>
          </AppBar>
        </Grid>
      </Grid>
    </DashboardLayout>
  )
}
