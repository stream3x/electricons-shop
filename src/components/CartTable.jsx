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
import CountQuantity from '../assets/CountQuantity';
import ReplyIcon from '@mui/icons-material/Reply';
import { Alert, Button, FormHelperText } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import Link from '../Link';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import theme from '../theme';
import InputBase from '@mui/material/InputBase';
import Cookies from 'js-cookie';
import Backdrop from '@mui/material/Backdrop';
import Image from 'next/image';
import Slide from '@mui/material/Slide';

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
    id: 'quantity',
    numeric: false,
    disablePadding: false,
    label: 'Quantity',
  },
  {
    id: 'subtotal',
    numeric: false,
    disablePadding: false,
    label: 'Subtotal',
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
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item})
    dispatch({ type: 'SUCCESS_LOGIN', payload: { ...state.snack, message: 'item removed successfully', severity: 'warning' } });
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
          Shoping cart
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

export default function CartTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('title');
  const [selected, setSelected] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { state, dispatch } = React.useContext(Store);
  const {cart: {cartItems, cupon_discount}, snack} = state;
  const router = useRouter();
  const [errors, setErrors] = React.useState({
    cupon: false
  });
  const [open, setOpen] = React.useState(false);
  const [cuponNum, setCuponNum] = React.useState(Number);
  const [updateCupon, setUpdateCupon] = React.useState('');

  const handleToggle = () => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  };

  const emptyCupon = cupon_discount && Object.keys(cupon_discount).length === 0;
  const codex = [{code: '123789', discount: '.25'}, {code: '789456', discount: '.10'}, {code: '456132', discount: '.30'}];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = cartItems.map((n) => n.title);
      const newSelectedItems = cartItems.map((n) => n);
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
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cartItems.length) : 0;

  if(cartItems.length === 0) {
    return (
      <Box sx={{ flexGrow: 1, my: 4, '& a': {textDecoration: 'none'} }}>
        <Typography gutterBottom variant="h6" component="h3" textAlign="center">
          There are no items in your cart
        </Typography>
        <Button onClick={()=> router.push('/')} variant="contained" startIcon={<ReplyIcon />}>
          back to shop
        </Button>
      </Box>
    )
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault();
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        cuponCode: formOutput.get('cupon-code'),
      };
      if(formData.cuponCode === '') {
        setErrors({ ...errors, cupon: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'enter cupon code', severity: 'warning'}});
        return;
      }
      if(codex.find(cupon => cupon.code === formData.cuponCode)) {
        const cupon = codex.filter(cupon => cupon.code === formData.cuponCode && cupon.discount);
        setCuponNum(cupon[0].discount);
        setErrors({
          ...errors,
          cupon: false
        });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'cupon code accepted', severity: 'success'}});
        dispatch({ type: 'CUPON_DISCOUNT', payload: cupon[0].discount });
        Cookies.set('cupon_discount', cupon[0].discount);
        handleToggle();
        return;
      }
      if(codex.find(code => code !== formData.cuponCode)) {
        setErrors({ ...errors, cupon: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'cupon code is not valid', severity: 'error'}});
        return;
      }
      setCuponNum(null);
      setErrors({ 
        ...errors,
        cupon: false
      });
  };

  function handleChangeCupon(e) {
    setUpdateCupon(e.target.value)
  }

  function copyCupon(e) {
    setUpdateCupon(e.target.value)
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
                rowCount={cartItems && cartItems.length}
              />
              <TableBody>
                {cartItems && stableSort(cartItems, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.title);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const subtotal = row.price * row.quantity;

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
                          <CountQuantity item={row} quantityItem={row.quantity} maxItem={row.inStock} size="small"/>
                        </TableCell>
                        <TableCell align="right">
                        {'$'}{subtotal}
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
            count={cartItems && cartItems.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={{width: {xs: '100%', sm: 'auto'}, '& a': {textDecoration: 'none'}, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
        <InputContainer>
          <StyledInputBase
            name="cupon-code"
            id="cupon-code"
            placeholder="Coupon code"
            inputProps={{ 'aria-label': 'coupon' }}
            onChange={handleChangeCupon}
            value={updateCupon}
            error={errors.cupon}
          />
          <StyledInputButton type="submit">Apply coupon</StyledInputButton>
          </InputContainer>
          {
            errors.cupon && 
            <FormHelperText sx={{width: '100%', ml: 3}} error>{snack.message && snack.message}</FormHelperText>
          }
      </Box>
      <Box sx={{width: {xs: '100%', sm: 'auto'}, '& a': {textDecoration: 'none'}, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mt: 3}}>
        <Alert severity="info">
          Get these coupon codes!
          <Box>
          <Button color='indigo' value="789456" onClick={copyCupon}>
            10%: 789456
          </Button>
          </Box>
          <Box>
          <Button color='indigo' value="123789" onClick={copyCupon}>
            25%: 123789
          </Button>
          </Box>
          <Box>
          <Button color='indigo' value="456132" onClick={copyCupon}>
            30%: 456132
          </Button>
          </Box>
        </Alert>
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <Box
            component="img"
            sx={{width: '100%'}}
            src={`/images/cupon_code${!emptyCupon && cuponNum * 100}.png`}
            alt="cupon code"
          />
        </Slide>
      </Backdrop>
    </React.Fragment>
  );
}
