import React, { useContext, useReducer } from 'react'
import DashboardLayout from '../../../src/layout/DashboardLayout'
import { Backdrop, Button, Grid, Paper } from '@mui/material'
import Chart from '../../../src/components/Chart'
import Orders from '../../../src/components/Orders'
import Deposits from '../../../src/components/Deposits'
import db from '../../../src/utils/db'
import Order from '../../../models/Order'
import Guest from '../../../models/Guest'
import CircularProgress from '@mui/material/CircularProgress';
import styled from '@emotion/styled'
import { Store } from '../../../src/utils/Store'
import dynamic from 'next/dynamic'

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
        return { ...state, loading: false, recentOrders: action.payload, recentGuestOrders: action.payload, error: '' };
    }
    case 'FETCH_FAIL': {
      return { ...state, loading: false, error: action.payload };
    }
    default:
      return state;
  }
}

export async function getServerSideProps(context) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 60);
  try {
    db.connect();
    const orders = await Order.find().sort({ createdAt: -1 }).lean().exec();
    const guestOrders = await Guest.find().sort({ createdAt: -1 }).lean().exec();
    const totalInflows = await Order.find({
      createdAt: { $gte: sevenDaysAgo }, // Find orders from the last seven days
    }).lean().exec();
    const totalGuestInflows = await Guest.find({
      createdAt: { $gte: sevenDaysAgo }
    }).lean().exec();
    db.disconnect();
    return {
      props: {
        orders: JSON.parse(JSON.stringify(orders && orders)),
        guestOrders: JSON.parse(JSON.stringify(guestOrders && guestOrders)),
        totalInflows: JSON.parse(JSON.stringify(totalInflows && totalInflows)),
        totalGuestInflows: JSON.parse(JSON.stringify(totalGuestInflows && totalGuestInflows)),
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        orders: [],
        guestOrders: [],
        totalInflows: 0,
        totalGuestInflows: 0
      },
    };
  }
}

function Dashboard(props) {
  const { orders, guestOrders, totalInflows, totalGuestInflows } = props;
  const { state: {session} } = useContext(Store);

  const [{ loading, error, recentOrders, recentGuestOrders }, dispatch] = useReducer(reducer, {
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
        const resGuest = await guestOrders;
        dispatch({ type: 'FETCH_SUCCESS', payload: resGuest });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    } 
    getOrders();

  }, []);

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
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Chart orders={recentOrders} guestOrders={recentGuestOrders} />
            </Paper>
          </Grid>
          {/* Recent Deposits */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Deposits totalInflows={totalInflows} totalGuestInflows={totalGuestInflows} />
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
              <Orders orders={recentOrders} isGuest={false} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
              <Orders orders={recentGuestOrders} isGuest={true} />
            </Paper>
          </Grid>
        </Grid>
      }
    </DashboardLayout>
  )
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });