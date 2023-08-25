import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';
import Title from './Title';
import theme from '../theme';

export default function Chart(props) {
  const { data } = props;
  const [chartData, setChartData] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = data;
        setChartData(res);
      } catch (error) {
        console.log('error fetch chart data', error);
      }
    }
    fetchData();
  }, []);  

  return (
    <React.Fragment>
      <Title>Last Day</Title>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
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