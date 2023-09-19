import React from 'react'
import DashboardLayout from '../../../src/layout/DashboardLayout'
import { Button, Grid, Paper, Typography } from '@mui/material'
import Orders from '../../../src/components/Orders'
import Deposits from '../../../src/components/Deposits'
import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import axios from 'axios'
import Title from '../../../src/components/Title'
import { Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import theme from '../../../src/theme'

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.white,
  border: 'thin solid lightGrey',
  borderLeft: '5px solid black',
}));

let data = [
  { time: '00:00', amount: 0, amount_guest: 0 },
  { time: '03:00', amount: 0, amount_guest: 0 },
  { time: '06:00', amount: 0, amount_guest: 0 },
  { time: '09:00', amount: 0, amount_guest: 0 },
  { time: '12:00', amount: 0, amount_guest: 0 },
  { time: '15:00', amount: 0, amount_guest: 0 },
  { time: '18:00', amount: 0, amount_guest: 0 },
  { time: '21:00', amount: 0, amount_guest: 0 },
  { time: '24:00', amount: 0, amount_guest: 0 },
];

function Dashboard() {
  const [dataUsers, setDataUsers] = React.useState([]);
  const [dataGuests, setDataGuests] = React.useState([]);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    async function getOrders() {
      try {
        const { data } = await axios.get('/api/orders/fetch_orders');
        setDataUsers(data);
      } catch (error) {
        setError(error);
      }
    } 
    getOrders();

  }, []);

  React.useEffect(() => {
    async function getOrders() {
      try {
        const { data } = await axios.get('/api/guests/fetch_guest');
        setDataGuests(data);
      } catch (error) {
        setError(error);
      }
    } 
    getOrders();

  }, []);

  const userTotals = dataUsers[1]?.recentFiveOrders?.map(item => item?.total);
  const userSum = userTotals?.reduce((total, number) => total + number, 0);
  const guestTotals = dataGuests[1]?.recentFiveGuestOrders?.map(item => item?.total);
  const guestSum = guestTotals?.reduce((total, number) => total + number, 0);
  const TOTAL =  [userSum, guestSum]?.reduce((total, number) => total + number, 0);

  // User chart
  data[0].amount = dataUsers[0]?.orders.filter(order => parseInt(order.updatedAt.substring(11, 13)) >= 0 && parseInt(order.updatedAt.substring(11, 13)) < 3)?.map(item => item.total).reduce((total, number) => total + number, 0).toFixed(2);

  data[1].amount = dataUsers[0]?.orders.filter(order => parseInt(order.updatedAt.substring(11, 13)) >= 3 && parseInt(order.updatedAt.substring(11, 13)) < 6)?.map(item => item.total).reduce((total, number) => total + number, 0).toFixed(2);

  data[2].amount = dataUsers[0]?.orders.filter(order => parseInt(order.updatedAt.substring(11, 13)) >= 6 && parseInt(order.updatedAt.substring(11, 13)) < 9)?.map(item => item.total).reduce((total, number) => total + number, 0).toFixed(2);

  data[3].amount = dataUsers[0]?.orders.filter(order => parseInt(order.updatedAt.substring(11, 13)) >= 9 && parseInt(order.updatedAt.substring(11, 13)) < 12)?.map(item => item.total).reduce((total, number) => total + number, 0).toFixed(2);

  data[4].amount = dataUsers[0]?.orders.filter(order => parseInt(order.updatedAt.substring(11, 13)) >= 12 && parseInt(order.updatedAt.substring(11, 13)) < 15)?.map(item => item.total).reduce((total, number) => total + number, 0).toFixed(2);

  data[5].amount = dataUsers[0]?.orders.filter(order => parseInt(order.updatedAt.substring(11, 13)) >= 15 && parseInt(order.updatedAt.substring(11, 13)) < 18)?.map(item => item.total).reduce((total, number) => total + number, 0).toFixed(2);

  data[6].amount = dataUsers[0]?.orders.filter(order => parseInt(order.updatedAt.substring(11, 13)) >= 18 && parseInt(order.updatedAt.substring(11, 13)) < 21)?.map(item => item.total).reduce((total, number) => total + number, 0).toFixed(2);

  data[7].amount = dataUsers[0]?.orders.filter(order => parseInt(order.updatedAt.substring(11, 13)) >= 21 && parseInt(order.updatedAt.substring(11, 13)) < 24)?.map(item => item.total).reduce((total, number) => total + number, 0).toFixed(2);

  data[8].amount = dataUsers[0]?.orders.filter(order => parseInt(order.updatedAt.substring(11, 13)) === 24)?.map(item => item.total).reduce((total, number) => total + number, 0).toFixed(2);


  // Guest user chart
  data[0].amount_guest = dataGuests[0]?.guest_orders.filter(order => parseInt(order.updatedAt.substring(11, 13)) >= 0 && parseInt(order.updatedAt.substring(11, 13)) < 3)?.map(item => item.total).reduce((total, number) => total + number, 0).toFixed(2);

  data[1].amount_guest = dataGuests[0]?.guest_orders.filter(order => parseInt(order.updatedAt.substring(11, 13)) >= 3 && parseInt(order.updatedAt.substring(11, 13)) < 6)?.map(item => item.total).reduce((total, number) => total + number, 0).toFixed(2);

  data[2].amount_guest = dataGuests[0]?.guest_orders.filter(order => parseInt(order.updatedAt.substring(11, 13)) >= 6 && parseInt(order.updatedAt.substring(11, 13)) < 9)?.map(item => item.total).reduce((total, number) => total + number, 0).toFixed(2);

  data[3].amount_guest = dataGuests[0]?.guest_orders.filter(order => parseInt(order.updatedAt.substring(11, 13)) >= 9 && parseInt(order.updatedAt.substring(11, 13)) < 12)?.map(item => item.total).reduce((total, number) => total + number, 0).toFixed(2);
  
  data[4].amount_guest = dataGuests[0]?.guest_orders.filter(order => parseInt(order.updatedAt.substring(11, 13)) >= 12 && parseInt(order.updatedAt.substring(11, 13)) < 15)?.map(item => item.total).reduce((total, number) => total + number, 0).toFixed(2);

  data[5].amount_guest = dataGuests[0]?.guest_orders.filter(order => parseInt(order.updatedAt.substring(11, 13)) >= 15 && parseInt(order.updatedAt.substring(11, 13)) < 18)?.map(item => item.total).reduce((total, number) => total + number, 0).toFixed(2);

  data[6].amount_guest = dataGuests[0]?.guest_orders.filter(order => parseInt(order.updatedAt.substring(11, 13)) >= 18 && parseInt(order.updatedAt.substring(11, 13)) < 21)?.map(item => item.total).reduce((total, number) => total + number, 0).toFixed(2);

  data[7].amount_guest = dataGuests[0]?.guest_orders.filter(order => parseInt(order.updatedAt.substring(11, 13)) >= 21 && parseInt(order.updatedAt.substring(11, 13)) < 24)?.map(item => item.total).reduce((total, number) => total + number, 0).toFixed(2);

  data[8].amount_guest = dataGuests[0]?.guest_orders.filter(order => parseInt(order.updatedAt.substring(11, 13)) === 24)?.map(item => item.total).reduce((total, number) => total + number, 0).toFixed(2);

  return (
    <DashboardLayout>
      {
        error ?
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
              <Title>
                In the last 5 days the order interval
              </Title>
              <ResponsiveContainer>
                <LineChart
                  data={data}
                  margin={{
                    top: 16,
                    right: 16,
                    bottom: 0,
                    left: 24,
                  }}
                >
                  <XAxis
                    dataKey="time"
                    stroke={theme.palette.text.secondary}
                    style={theme.typography.body2}
                  />
                  <YAxis
                    stroke={theme.palette.text.secondary}
                    style={theme.typography.body2}
                  >
                    <Label
                      angle={270}
                      position="left"
                      style={{
                        textAnchor: 'middle',
                        fill: theme.palette.text.primary,
                        ...theme.typography.body1,
                      }}
                    >
                      Sales ($)
                    </Label>
                  </YAxis>
                  <Line
                    isAnimationActive={false}
                    type="monotone"
                    name="Users"
                    dataKey="amount"
                    stroke={theme.palette.primary.main}
                    dot={false}
                  />
                  <Tooltip />
                  <Line
                    isAnimationActive={false}
                    type="monotone"
                    name="Guests"
                    dataKey="amount_guest"
                    stroke={theme.palette.dashboard.main}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
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
              <Deposits total={TOTAL} />
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
              <Orders orders={dataUsers[1]?.recentFiveOrders} isGuest={false} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
              <Orders orders={dataGuests[1]?.recentFiveGuestOrders} isGuest={true} />
            </Paper>
          </Grid>
        </Grid>
      }
    </DashboardLayout>
  )
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });