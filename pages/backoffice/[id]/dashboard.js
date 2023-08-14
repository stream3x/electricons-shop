import React from 'react'
import DashboardLayout from '../../../src/layout/DashboardLayout'
import { Grid, Paper } from '@mui/material'
import Chart from '../../../src/components/Chart'
import Orders from '../../../src/components/Orders'
import Deposits from '../../../src/components/Deposits'
import db from '../../../src/utils/db'
import Order from '../../../models/Order'
import Guest from '../../../models/Guest'

export async function getServerSideProps(context) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  try {
    db.connect();
    const orders = await Order.find().sort({ createdAt: -1 }).lean().exec();
    const guestOrders = await Guest.find().sort({ createdAt: -1 }).lean().exec();
    const totalInflows = await Order.find({
      createdAt: { $gte: sevenDaysAgo }, // Find orders from the last seven days
    }).lean().exec();
    const totalGuestInflows = await Guest.find({
      createdAt: { $gte: sevenDaysAgo }, // Find guest orders from the last seven days
    }).lean().exec();
    db.disconnect();
    return {
      props: {
        orders: JSON.parse(JSON.stringify(orders)),
        guestOrders: JSON.parse(JSON.stringify(guestOrders)),
        totalInflows: JSON.parse(JSON.stringify(totalInflows)),
        totalGuestInflows: JSON.parse(JSON.stringify(totalGuestInflows)),
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

export default function Dashboard(props) {
  const { orders, guestOrders, totalInflows, totalGuestInflows } = props;

  return (
    <DashboardLayout>
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
            <Chart orders={orders} guestOrders={guestOrders} />
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
            <Orders orders={orders} isGuest={false} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            <Orders orders={guestOrders} isGuest={true} />
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  )
}
