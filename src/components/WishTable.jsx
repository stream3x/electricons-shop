import * as React from 'react';
import PropTypes from 'prop-types';
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
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import ReplyIcon from '@mui/icons-material/Reply';
import { Button, FormHelperText } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import Link from '../Link';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import theme from '../theme';
import InputBase from '@mui/material/InputBase';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Slide from '@mui/material/Slide';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import LoadingButton from '@mui/lab/LoadingButton';
import CartIcon from '@mui/icons-material/ShoppingCartOutlined';
import axios from 'axios';
import CompareIcon from '@mui/icons-material/RepeatOutlined';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  }));

const AddToCartButton = styled(LoadingButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.palette.addToCartButtonShape.borderRadius,
  margin: '-1px',
  padding: '.5em 2em',
  [theme.breakpoints.down('lg')]: {
    padding: '.5em 1em',
  },
  '&:hover': {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.secondary.main,
  }
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

const InputContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  flexWrap: 'nowrap',
  display: 'flex',
  borderRadius: theme.palette.shape.borderRadius,
  border: `thin solid ${theme.palette.secondary.borderColor}`,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: '50%',
  [theme.breakpoints.down('md')]: {
    marginLeft: theme.spacing(3),
    width: '100%',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(1)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const StyledInputButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.palette.inputButtonShape.borderRadius,
  margin: '-1px',
  padding: '.5em 0em',
  width: '250px',
  fontSize: '14px',
  '&:hover': {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.secondary.main,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
}));

function descendingComparator(a, b, orderBy) {
  
  if(a[orderBy] === undefined) {
    const subB = b.price * b.quantity;
    const subA = a.price * a.quantity;
    console.log(subA > subB)
    if (subB < subA) {
      return -1;
    }
    if (subB > subA) {
      return 1;
    }
  }
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

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array && array.map((el, index) => [el, index]);
  stabilizedThis && stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis && stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'image',
    numeric: false,
    disablePadding: true,
    label: 'Product',
  },
  {
    id: 'title',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'price',
    numeric: false,
    disablePadding: false,
    label: 'Price',
  },
  {
    id: 'compare',
    numeric: false,
    disablePadding: false,
    label: 'Compare',
  },
  {
    id: 'add_to_cart',
    numeric: false,
    disablePadding: false,
    label: 'Add to Cart',
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
              'aria-label': 'select all',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.id === 'image' ? 'center' : 'right'}
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
  const { numSelected, dispatch, state, selectedItems } = props;

  function removeItemHandler(item) {
    dispatch({ type: 'WISHLIST_REMOVE_ITEM', payload: item});
  }

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
          sx={{ flex: '1 1 100%', textAlign: 'left' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : 
        <Typography component="h1" variant="h6">
          Wishlist
        </Typography>
      }

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton onClick={() => removeItemHandler(selectedItems)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const icon = (
  <Paper sx={{ m: 1 }} elevation={4}>
    <Box component="svg" sx={{ width: 100, height: 100 }}>
      <Box
        component="polygon"
        sx={{
          fill: (theme) => theme.palette.common.white,
          stroke: (theme) => theme.palette.divider,
          strokeWidth: 1,
        }}
        points="0,100 50,00, 100,100"
      />
    </Box>
  </Paper>
);

export default function WishTable(props) {
  const { cartItems } = props;
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('title');
  const [selected, setSelected] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { state, dispatch } = React.useContext(Store);
  const { comparasion: { compareItems }, wishlist: { wishItems }, snack } = state;
  const router = useRouter();
  const [loadingCompare, setLoadingCompare] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    console.log(property)
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = wishItems.map((n) => n.title);
      const newSelectedItems = wishItems.map((n) => n);
      setSelected(newSelected);
      setSelectedItems(newSelectedItems);
      return;
    }
    setSelected([]);
    setSelectedItems([]);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - wishItems.length) : 0;

  async function addToCartHandler(item) {
    setLoading(true)
    const { data } = await axios.get(`/api/products/${item._id}`)
    if(data.inStock <= 0) {
      dispatch({ type: 'CART_ADD_ITEM', payload: { ...state.snack, message: 'Sorry Product is out of stock', severity: 'success'}});
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity: 1 } });
    if(cartItems.find(i => i._id === item._id)) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item already added', severity: 'warning' } });
      setLoading(false);
      return;
    }
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item successfully added', severity: 'success' } });
    setLoading(false);
  }

  async function addToComparasion(item) {
    setLoadingCompare(true)
    const { data } = await axios.get(`/api/products/${item._id}`);
    dispatch({ type: 'COMPARE_ADD_ITEM', payload: { ...item, data }});
    if(compareItems && compareItems.find(i => i._id === data._id)) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item already added', severity: 'warning' } });
      setLoadingCompare(false)
      return;
    }
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item successfully added', severity: 'success' } });
    setLoadingCompare(false)
  }

  if (cartItems) {
    return (
      <Item sx={{ '& a': {textDecoration: 'none' } }} elevation={0}>
        <Typography component="p" variant="h6">There are no items in your wishlist</Typography>
      </Item>
    )
  }

  return (
    <React.Fragment>
      <Box sx={{ width: '100%' }}>
        <Paper elevation={0} sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
          numSelected={selected.length}
          dispatch={dispatch}
          state={state}
          selectedItems={selectedItems}
          />
          <MyTableContainer>
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
                rowCount={wishItems && wishItems.length}
              />
              <TableBody>
                {wishItems && stableSort(wishItems, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                        <TableCell align="left" sx={{maxWidth: 100}}>
                          <Box sx={{ width: 'auto', height: '50px', position: 'relative', objectFit: 'contain','& img': {objectFit: 'contain', width: 'auto!important', height: '50px'} }}>
                            <Image
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority
                              src={row.images[1].image ? row.images[1].image : row.images[0].image}
                              alt={row.title}
                            />
                          </Box>
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          align="right"
                          sx={{ '& > a': {textDecoration: 'none' }}}
                        >
                          <Link noLinkStyle sx={{ color: theme.palette.primary.main }} href={`/product/${row.slug}`}>
                            {row.title}
                          </Link>
                        </TableCell>
                        <TableCell color='primary' align="right">
                        {'$'}{row.price}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ flex: {xs: '0 0 100%', lg: '0 0 35%'}, my: 1, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'right', '& > a': {textDecoration: 'none', width: {xs:'100%', sm: 'auto'}} }}>
                            {
                              row.inStock !== 0 ? (compareItems.find(item => item._id === row._id) ? 
                                <Link noLinkStyle href="/compare" passHref>
                                  <AddToCartButton size='small' loading={loadingCompare} loadingPosition="start" sx={{width: {xs: '100%', sm: 'auto'}}} variant="contained" startIcon={<VisibilityIcon />}>
                                    View Compare
                                  </AddToCartButton>
                                </Link>
                              :
                                <AddToCartButton size='small' loading={loading} loadingPosition="start" sx={{width: {xs: '100%', sm: 'auto'}}} variant="contained" onClick={() => addToComparasion(row)} startIcon={<CompareIcon color='white'/>}>
                                  Compare
                                </AddToCartButton>
                              )
                              :
                              <AddToCartButton sx={{width: {xs: '100%', sm: 'auto'}}} startIcon={<RemoveShoppingCartIcon />}>
                                no Stock
                              </AddToCartButton>
                            }
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ flex: {xs: '0 0 100%', lg: '0 0 35%'}, my: 1, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'right', '& > a': {textDecoration: 'none', width: {xs:'100%', sm: 'auto'}} }}>
                          {
                            row.inStock !== 0 ? (cartItems.find(item => item._id === row._id) ? 
                              <Link noLinkStyle href="/cart" passHref>
                                <AddToCartButton size='small' loading={loading} loadingPosition="start" sx={{width: {xs: '100%', sm: 'auto'}}} variant="contained" startIcon={<VisibilityIcon />}>
                                  View Cart
                                </AddToCartButton>
                              </Link>
                            : 
                              <AddToCartButton size='small' loading={loading} loadingPosition="start" sx={{width: {xs: '100%', sm: 'auto'}}} variant="contained" onClick={() => addToCartHandler(row)} startIcon={<CartIcon />}>
                                Add To Cart
                              </AddToCartButton>
                            )
                            :
                            <AddToCartButton sx={{width: {xs: '100%', sm: 'auto'}}} startIcon={<RemoveShoppingCartIcon />}>
                              no Stock
                            </AddToCartButton>
                          }
                          </Box>
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
                )}
              </TableBody>
            </Table>
          </MyTableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={wishItems && wishItems.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </React.Fragment>
  );
}