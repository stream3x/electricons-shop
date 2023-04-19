import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Backdrop, Box, Button, Grid, Typography } from '@mui/material';
import BreadcrumbNav from '../src/assets/BreadcrumbNav';
import { Store } from '../src/utils/Store';
import { onError } from '../src/utils/error';
import CircularProgress from '@mui/material/CircularProgress';
import OrderTable from '../src/components/OrderTable';
import styled from '@emotion/styled';
import theme from '../src/theme';
import ProfileNavigation from '../src/components/ProfileNavigation';

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
        return { ...state, loading: false, orders: action.payload, error: '' };
    }
    case 'FETCH_FAIL': {
      return { ...state, loading: false, error: action.payload };
    }
    default:
      return state;
  }
}

function OrderHistory() {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: ''
  });

  useEffect(() => {
    if(!userInfo) {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    };
  
    return () => {
      fetchOrders();
    };

  }, []);

  return (
    <Box sx={{ flexGrow: 1, my: 4  }}>
      <BreadcrumbNav />
      {
        loading ? (
          <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : error ? (
          <LabelButton sx={{width: '100%', my: 5, p: 2}}>
          <Typography sx={{m: 0, p: 1, fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h5" component="h1" gutterBottom>
           {error}
          </Typography>
        </LabelButton>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <ProfileNavigation />
            </Grid>
            <Grid item xs={12} md={9}>
              <OrderTable />
            </Grid>
          </Grid>
        )
      }      
    </Box>
  )
}

OrderHistory.auth = true;
export default OrderHistory;