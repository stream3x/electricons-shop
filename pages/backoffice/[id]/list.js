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
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import { Button, Chip, InputBase, useMediaQuery } from '@mui/material';
import theme from '../../../src/theme';
import AlertDialogSlide from '../../../src/assets/AlertDialogSlide';
import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import Image from 'next/image';
import Link from '../../../src/Link';
import AddIcon from '@mui/icons-material/Add';

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

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
  
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'ID',
  },
  {
    id: 'img',
    numeric: false,
    disablePadding: true,
    label: 'Image',
  },
  {
    id: 'title',
    numeric: true,
    disablePadding: false,
    label: 'Product Name',
  },
  {
    id: 'price',
    numeric: true,
    disablePadding: false,
    label: 'Price',
  },
  {
    id: 'inStock',
    numeric: true,
    disablePadding: false,
    label: 'Stock',
  },
  {
    id: 'rating',
    numeric: true,
    disablePadding: false,
    label: 'Rating',
  },
  {
    id: 'category',
    numeric: true,
    disablePadding: false,
    label: 'Categories',
  },
  {
    id: 'orderCount',
    numeric: true,
    disablePadding: false,
    label: 'Orders',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, selectedItems } = props;
  const [open, setOpen] = React.useState(false);

  function removeUserHandler(selectedItems) {
    console.log(selectedItems, `now you deleted ${selectedItems.map(item => item.title)}`);
    setOpen(() => false);
  }

  function editItemHandler(item) {
    console.log(item, `edit user ${item.map(item => item.title)}`);
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Toolbar
      sx={{
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
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Products
        </Typography>
      )}

      {numSelected > 0 && (
        <Box sx={{display: 'flex'}}>
          {
            numSelected === 1 &&
            <Tooltip title="Edit">
              <IconButton onClick={() => editItemHandler(selectedItems)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          }
          <Tooltip title="Delete" onClick={() => setOpen(true)}>
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      <AlertDialogSlide removeUserHandler={removeUserHandler} open={open} setOpen={setOpen} handleClose={handleClose} selectedItems={selectedItems} />

    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function ProductsListTable() {
  const userInf0 = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('title');
  const [selected, setSelected] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const matches = useMediaQuery('(min-width: 560px)');
  const [search, setSearch] = React.useState('');
  const [rows, setRows] = React.useState([]);
  const [totalProducts, setTotalProducts] = React.useState([]);

  React.useEffect(() => {
    async function fetchingData(totalProducts) {
      const { data } = await axios.get('/api/products', {
        params: {
          pageSize: totalProducts,
        }
      });
      setRows(data.products);
      setTotalProducts(data.totalProducts)
    }
    fetchingData(totalProducts);
  }, [totalProducts])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.title);
      setSelected(newSelected);
      setSelectedItems(rows);
      return;
    }
    setSelected([]);
  };

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    (e) =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );

  const hasWord = (word, toMatch) => {
    let wordSplitted = word.split(' ');
      if(wordSplitted.join(' ').includes(toMatch)) {
        return true;
      }
      return false;
  };

  function searchTable(rows) {
    return rows && rows.lenght !== 0 ? rows.filter((row) => ((row.title && hasWord(row.title.toLowerCase(), search.toLowerCase())) || (row.subCategory && hasWord(row.subCategory.toLowerCase(), search.toLowerCase())))  || (row.category && hasWord(row.category.toLowerCase(), search.toLowerCase()) || (row._id.toString() && hasWord(row._id.toString().toLowerCase(), search.toLowerCase())))) : rows;
  }

  const usersTabs = ['All Products', 'Out of Stock', 'Zero Orders']

  return (
    <Box>
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
        <Box sx={{py: 1, px: {xs: 0, md: 3}, display: 'flex', flex: 1, justifyContent: {xs: 'center', md: 'right'}, alignItems: 'center', width: {xs: '100%', md: 'auto'}}}>
          <Link href={`/backoffice/${userInf0?._id}/create`}>
            <Button sx={{py: 1}} color='dashboard' variant="outlined" startIcon={<AddIcon />}>
              create new Product
            </Button>
          </Link>
        </Box>
        <Box sx={{py: 1, display: 'flex', justifyContent: 'left', flexWrap: 'wrap', width: {xs: '100%', md: 'auto'}}}>
          <Search component="div">
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Box>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Paper elevation={0} sx={{ width: '100%', mb: 2, bgcolor: 'transparent' }}>
          <EnhancedTableToolbar numSelected={selected.length} selectedItems={selectedItems} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
              {
                (search !== '' ? searchTable(rows) : usersTabs[activeTab] === 'All Products' ? visibleRows : usersTabs[activeTab] === 'Out of Stock' ? rows.filter(row => row.inStock === 0) : rows.filter(row => row.orderCount === 0))
                .map((row, index) => {
                  const isItemSelected = isSelected(row.title);
                  const labelId = `enhanced-table-checkbox-${index}`;

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
                    <TableCell sx={{minWidth: '10px', maxWidth: '100px', overflowX: 'scroll', '&::-webkit-scrollbar': {display: 'none'}}}>
                      {row._id}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ width: 'auto', height: '50px', position: 'relative','& img': {objectFit: 'contain', width: 'auto!important', m: 'auto'}}}>
                        <Image
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority
                          src={row?.images[1]?.image}
                          alt={row.title}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {row.title}
                    </TableCell>
                    <TableCell color='primary' align="right">
                      {'$'}{row.price}
                    </TableCell>
                    <TableCell color='primary' align="right">
                      {
                        row.inStock === 0 ? <Chip sx={{bgcolor: theme.palette.dashboard.main, color: theme.palette.primary.contrastText}} label={row.inStock} /> : <Chip sx={{bgcolor: theme.palette.success.main}} label={row.inStock} />
                      }
                    </TableCell>
                    <TableCell color='primary' align="right">
                      <Box component='span' sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                        <Box component='span'>{row.rating}</Box>
                        <Box component='span'><StarIcon sx={{color: 'gold'}} /></Box>
                      </Box>
                      
                    </TableCell>
                    <TableCell align="right">
                      {row.category}{', '}{row.subCategory}
                    </TableCell>
                    <TableCell align="right">
                      {
                      row.orderCount === 0 ? <Chip sx={{bgcolor: theme.palette.dashboard.main, color: theme.palette.primary.contrastText}} label={row.orderCount} /> : <Chip sx={{bgcolor: theme.palette.success.main}} label={row.orderCount} />
                      }
                    </TableCell>
                  </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )
              }
              </TableBody>
            </Table>
          </TableContainer>
          {
            search === '' && usersTabs[activeTab] !== 'Out of Stock' && usersTabs[activeTab] !== 'Zero Orders' &&
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          }
        </Paper>
      </Box>
    </Box>
  );
}