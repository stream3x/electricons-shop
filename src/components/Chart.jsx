import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';
import Title from './Title';
import theme from '../theme';

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

export default function Chart(props) {
  const { orders, guestOrders } = props;

  React.useEffect(() => {
    // Wait for orders to resolve (assuming orders is a Promise)
    if (Array.isArray(orders)) {
      orders.forEach(order => {
        const hour = parseInt(order.createdAt.substring(11, 13));
        const amount = order.total;
        if (hour >= 0 && hour < 3) {
          data[0].amount += amount;
        } else if (hour >= 3 && hour < 6) {
          data[1].amount += amount;
        } else if (hour >= 6 && hour < 9) {
          data[2].amount += amount;
        }else if (hour >= 9 && hour < 12) {
          data[3].amount += amount;
        }else if (hour >= 12 && hour < 15) {
          data[4].amount += amount;
        }else if (hour >= 15 && hour < 18) {
          data[5].amount += amount;
        }else if (hour >= 18 && hour < 21) {
          data[6].amount += amount;
        }else if (hour >= 21 && hour < 24) {
          data[7].amount += amount;
        }else if (hour === 24) {
          data[8].amount += amount;
        }
      });
    }
  }, [orders]);

  React.useEffect(() => {
    if (Array.isArray(orders)) {
      guestOrders.forEach(order => {
        const hour = parseInt(order.createdAt.substring(11, 13));
        const amount_guest = order.total;
        if (hour >= 0 && hour < 3) {
          data[0].amount_guest += amount_guest;
        } else if (hour >= 3 && hour < 6) {
          data[1].amount_guest += amount_guest;
        } else if (hour >= 6 && hour < 9) {
          data[2].amount_guest += amount_guest;
        }else if (hour >= 9 && hour < 12) {
          data[3].amount_guest += amount_guest;
        }else if (hour >= 12 && hour < 15) {
          data[4].amount_guest += amount_guest;
        }else if (hour >= 15 && hour < 18) {
          data[5].amount_guest += amount_guest;
        }else if (hour >= 18 && hour < 21) {
          data[6].amount_guest += amount_guest;
        }else if (hour >= 21 && hour < 24) {
          data[7].amount_guest += amount_guest;
        }else if (hour === 24) {
          data[8].amount_guest += amount_guest;
        }
      });
    }
  }, [guestOrders]);

  return (
    <React.Fragment>
      <Title>Last Day</Title>
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
    </React.Fragment>
  );
}