import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
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
import { Typography } from '@mui/material';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import CartIcon from '@mui/icons-material/ShoppingCartOutlined';
import axios from 'axios';
import { Store } from '../utils/Store';
import Link from '../Link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const AddToCartButton = styled(LoadingButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.palette.addToCartButtonShape.borderRadius,
  margin: '-1px',
  padding: '.5em 2em',
  '&:hover': {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.secondary.main,
  }
}));

function TablePaginationActions(props) {
  const theme = useTheme();
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

export default function CompareTable(props) {
  const { compareItems, cartItems } = props;
  const { state, dispatch } = React.useContext(Store);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = React.useState(false);

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

  function removeCompareItemHandler(item) {
    dispatch({ type: 'COMPARE_REMOVE_ITEM', payload: item});
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item removed successfully', severity: 'warning' } });
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - compareItems.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableBody>
          <TableRow>
            <TableCell sx={{minWidth: '200px'}} component="th">
              {'Product'}
            </TableCell>
            {(rowsPerPage > 0
              ? compareItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : compareItems
            ).map((row) => (
            <TableCell key={row._id} sx={{minWidth: '300px'}} component="td" scope="row">
              <Box sx={{ width: 'auto', height: '180px', position: 'relative', objectFit: 'contain','& img': {objectFit: 'contain', width: 'auto!important', height: '50px', margin: 'auto'}, mb: 3 }}>
                <Image
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  src={row.images[0].image}
                  alt={row.title}
                />
              </Box>
              <Typography variant='h6' align='center'>{row.title}</Typography>
            </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell sx={{width: '200px'}} component="th">
              {'Price'}
            </TableCell>
            {(rowsPerPage > 0
              ? compareItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : compareItems
            ).map((row) => (
            <TableCell key={row._id} align='center' component="td" scope="row">
              <Typography component="p" color="primary" variant="h6">
                {"$"}{row.price}
              </Typography>
            </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell sx={{width: '200px'}} component="th">
              {'Deskription'}
            </TableCell>
            {(rowsPerPage > 0
              ? compareItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : compareItems
            ).map((row) => (
            <TableCell key={row._id} component="td" style={{ width: 160 }} align="justify">
              {row.shortDescription}
            </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell sx={{width: '200px'}} component="th">
              {'Brand'}
            </TableCell>
            {(rowsPerPage > 0
              ? compareItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : compareItems
            ).map((row) => (
            <TableCell key={row._id} component="td" style={{ width: 160 }} align="center">
              <Link href={`/search?brand=${row.brand}`}>
                <Box sx={{ width: 'auto', height: '70px', position: 'relative', objectFit: 'contain','& img': {objectFit: 'contain', width: 'auto!important', height: '50px', margin: 'auto'} }}>
                  <Image
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    src={row.brandImg}
                    alt={row.brand}
                  />
                </Box>
              </Link>
            </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell component="th">
              {'Add to Cart'}
            </TableCell>
            {(rowsPerPage > 0
              ? compareItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : compareItems
            ).map((row) => (
            <TableCell key={row._id} component="td" style={{ width: 160 }} align="center">
              <Box sx={{ flex: {xs: '0 0 100%', lg: '0 0 35%'}, my: 1, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', '& > a': {textDecoration: 'none', width: {xs:'100%', sm: 'auto'}} }}>
              {
                row.inStock !== 0 ? (cartItems.find(item => item._id === row._id) ? 
                  <Link noLinkStyle href="/cart" passHref>
                    <AddToCartButton loading={loading} loadingPosition="start" sx={{width: {xs: '100%', sm: 'auto'}}} variant="contained" startIcon={<VisibilityIcon />}>
                      View Cart
                    </AddToCartButton>
                  </Link>
                : 
                  <AddToCartButton loading={loading} loadingPosition="start" sx={{width: {xs: '100%', sm: 'auto'}}} variant="contained" onClick={() => addToCartHandler(row)} startIcon={<CartIcon />}>
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
            ))}           
          </TableRow>
          <TableRow>
            <TableCell component="th">
              {'Remove'}
            </TableCell>
            {(rowsPerPage > 0
              ? compareItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : compareItems
            ).map((row) => (
            <TableCell key={row._id} sx={{width: '300px'}} component="td" style={{ width: 160 }} align="center">
              <IconButton onClick={() => removeCompareItemHandler(row)} sx={{ margin: 'auto' }}>
                <DeleteForeverIcon />
              </IconButton>
            </TableCell>
            ))}           
          </TableRow>

        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={compareItems.length}
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
    </TableContainer>
  );
}