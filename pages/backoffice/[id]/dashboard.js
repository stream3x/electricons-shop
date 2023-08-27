import React, { useContext } from 'react'
import DashboardLayout from '../../../src/layout/DashboardLayout'
import { Button, Grid, IconButton, Paper, Typography } from '@mui/material'
import Orders from '../../../src/components/Orders'
import Deposits from '../../../src/components/Deposits'
import styled from '@emotion/styled'
import { Store } from '../../../src/utils/Store'
import dynamic from 'next/dynamic'
import axios from 'axios'
import Title from '../../../src/components/Title'
import { Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import theme from '../../../src/theme'
import RefreshIcon from '@mui/icons-material/Refresh';
import Tooltips from '@mui/material/Tooltip';

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.white,
  border: 'thin solid lightGrey',
  borderLeft: '5px solid black',
}));

const orders = [];
const orderGuest = [];

const data = [
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
  const { state: {session} } = useContext(Store);
  const [dataUsers, setDataUsers] = React.useState([]);
  const [dataGuests, setDataGuests] = React.useState([]);
  const [error, setError] = React.useState('');
  const [refresh, setRefresh] = React.useState(false);


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

  dataUsers[1]?.recentFiveOrders.forEach(order => {
    orders.push(order.total);
  })
  dataGuests[1]?.recentFiveGuestOrders.forEach(order => {
    orderGuest.push(order.total);
  })
  const sumOrder = orders.reduce((total, number) => total + number, 0);
  const sumOrderGuest = orderGuest.reduce((total, number) => total + number, 0);
  const total = (sumOrder + sumOrderGuest).toFixed(2);

  React.useEffect(() => {
    // Wait for orders to resolve (assuming orders is a Promise)
  }, []);

  async function fillData() {
    try {
      const res = await axios.get('/api/orders/fetch_orders');
      const orders = await res.data[0]?.orders;
      orders && orders.forEach(order => {
        const hour = parseInt(order.createdAt.substring(11, 13));
        const amount = order.total;
        if (hour >= 0 && hour < 3) {
          data[0].amount += amount
        } else if (hour >= 3 && hour < 6) {
          data[1].amount += amount
        } else if (hour >= 6 && hour < 9) {
          data[2].amount += amount
        }else if (hour >= 9 && hour < 12) {
          data[3].amount += amount
        }else if (hour >= 12 && hour < 15) {
          data[4].amount += amount
        }else if (hour >= 15 && hour < 18) {
          data[5].amount += amount
        }else if (hour >= 18 && hour < 21) {
          data[6].amount += amount
        }else if (hour >= 21 && hour < 24) {
          data[7].amount += amount
        }else if (hour === 24) {
          data[8].amount += amount
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function fillGuestData() {
    try {
      const res = await axios.get('/api/guests/fetch_guest');
      const guest = await res.data[0]?.guest_orders;
      guest && guest.forEach(order => {
        const hour = parseInt(order.createdAt.substring(11, 13));
        const amount_guest = order.total;
        if (hour >= 0 && hour < 3) {
          data[0].amount_guest += amount_guest
        } else if (hour >= 3 && hour < 6) {
          data[1].amount_guest += amount_guest
        } else if (hour >= 6 && hour < 9) {
          data[2].amount_guest += amount_guest
        }else if (hour >= 9 && hour < 12) {
          data[3].amount_guest += amount_guest
        }else if (hour >= 12 && hour < 15) {
          data[4].amount_guest += amount_guest
        }else if (hour >= 15 && hour < 18) {
          data[5].amount_guest += amount_guest
        }else if (hour >= 18 && hour < 21) {
          data[6].amount_guest += amount_guest
        }else if (hour >= 21 && hour < 24) {
          data[7].amount_guest += amount_guest
        }else if (hour === 24) {
          data[8].amount_guest += amount_guest
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleRefreshChart() {
    setRefresh(true);
  }

  React.useEffect(() => {
    fillData();
    fillGuestData();
  }, [dataUsers, dataGuests]);

  React.useEffect(() => {
    fillData();
    fillGuestData();
    return () => {
      setRefresh(false);
    }
  }, [refresh]);  

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
                Last Day
                <Tooltips title='Refresh Chart'>
                  <IconButton onClick={handleRefreshChart} aria-label="delete">
                    <RefreshIcon />
                  </IconButton>
                </Tooltips>
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
              <Deposits total={total} />
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
              <Orders orders={dataUsers[0]?.orders} isGuest={false} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
              <Orders orders={dataGuests[0]?.guest_orders} isGuest={true} />
            </Paper>
          </Grid>
        </Grid>
      }
    </DashboardLayout>
  )
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });