import React from 'react';
import DashboardLayout from '../../../src/layout/DashboardLayout';
import { AppBar, Box, Button, Checkbox, Chip, FormControl, Grid, IconButton, InputBase, InputLabel, MenuItem, Pagination, Rating, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Tooltip, Typography } from '@mui/material';
import SelectPages from '../../../src/assets/SelectPages';
import theme from '../../../src/theme';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AlertDialogSlide from '../../../src/assets/AlertDialogSlide';
import Link from '../../../src/Link';
import dynamic from 'next/dynamic';
import axios from 'axios';

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.white,
  border: 'thin solid lightGrey',
  borderLeft: '5px solid black',
}));

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

function ProductList() {
  const router = useRouter();
  const { query } = router;
  const { id } = query;
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [rating, setRating] = React.useState(5);
  const [pageSize, setPageSize] = React.useState('10');
  const [page, setPage] = React.useState('');

  async function fetchingData(page, pageSize, search) {
    try {
      const { data } = await axios.get('/api/products', {
        params: {
          page: page,
          pageSize: pageSize,
          searchQuery: search
        }
      });
      setRows(data.products);
      setPage(data.totalPages)
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  React.useEffect(() => {
    fetchingData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('set url');
    fetchingData(page, pageSize, search);
  };

  const handlePageChange = (newPage) => {
    fetchingData(newPage, pageSize, search);
  };

  const pageSizeHandler = (newPageSize) => {
    setPageSize(newPageSize);
    fetchingData(1, newPageSize, search); // Fetch data with updated page size
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
                <Search onSubmit={handleSearch} component="form">
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                  <Button type="submit">Search</Button>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
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
                            {'$'}{row.price}
                          </TableCell>
                          <TableCell color='primary' align="right">
                            {
                              row.inStock === 0 ? <Chip sx={{bgcolor: theme.palette.error.main, color: theme.palette.primary.contrastText}} label={row.inStock} /> : <Chip sx={{bgcolor: theme.palette.success.main}} label={row.inStock} />
                            }
                          </TableCell>
                          <TableCell color='primary' align="right">
                            <Box component='span' sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                              <Box component='span'>{row.rating}</Box>
                              <Box component='span'><StarIcon sx={{color: 'gold'}} /></Box>
                            </Box>
                            
                          </TableCell>
                          <TableCell align="right">
                            {row.category}
                          </TableCell>
                          <TableCell align="right">
                            {row.subCategory}
                          </TableCell>
                          <TableCell align="right">
                            {
                            row.orderCount === 0 ? <Chip sx={{bgcolor: theme.palette.dashboard.main, color: theme.palette.primary.contrastText}} label={row.orderCount} /> : <Chip sx={{bgcolor: theme.palette.success.main}} label={row.orderCount} />
                            }
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {rows.length > 0 && (
                    <TableRow
                      style={{
                        height: (6) * rows.length,
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
                <SelectPages values={['1', '5', '10', '20']} pageSize={pageSize} pageSizeHandler={pageSizeHandler} />
                {
                  rows.length === 0 ?
                  <Typography sx={{ m: {xs: 'auto', sm: 0}, ml: 2, flexGrow: 1, fontSize: {xs: '12px', sm: '16px'}, textAlign: {xs: 'center', sm: 'left'}, py: 3, width: {xs: '100%', sm: 'auto'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                  "No Orders"
                  </Typography>
                  :
                  <Typography sx={{ m: {xs: 'auto', sm: 0}, ml: 2, fontSize: {xs: '12px', sm: '16px'}, flexGrow: 1, py: 3, width: {xs: '100%', sm: 'auto'}, textAlign: {xs: 'center', sm: 'left'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                  There are {rows.length} {rows.length === 1 ? "product" : "products"}.
                </Typography>
                }
                {
                  rows.length > 0 &&
                  <Stack sx={{width: {xs: '100%', sm: 'auto'}, py: 2 }} spacing={2}>
                    <Pagination sx={{mx: 'auto'}} color="primary" showFirstButton showLastButton count={page} onChange={(e, val) => handlePageChange(val)}/>
                  </Stack>
                }
              </Toolbar>
            </AppBar>
          </Grid>
        </Grid>
    </DashboardLayout>
  )
}

export default dynamic(() => Promise.resolve(ProductList), { ssr: false });