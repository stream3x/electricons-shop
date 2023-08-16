import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '../src/Link';
import ReplyIcon from '@mui/icons-material/Reply';
import theme from '../src/theme';
import axios from 'axios';
import { Card, CardContent, CardMedia, Divider, Grid } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import MapFooter from '../src/assets/MapFooter';

export default function Store() {
  const [stores, setStores] = React.useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`/api/store_info`);
      setStores(data);
    } catch (error) {
      console.log('Store Info not found', error);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const distinctArrayByCountry = [
    ...new Map(stores.map((item) => [item.city, item])).values(),
];

  return (
      <Box sx={{ my: 5, '& a': {textDecoration: 'none' }, '&:hover a': {textDecoration: 'none' } }}>
        {
          distinctArrayByCountry.map(country => (
            <Box key={country.country} sx={{py: 3}}>
              <Typography variant='h4' component="h2">{'Stores in '}{country.country}</Typography>
              <Divider />
              <Grid sx={{my: 3}} container spacing={3}>
                {
                  stores?.map(store => (
                    store.country === country.country &&
                    <Grid item key={store._id} xs={12} md={6} lg={4}>
                      <Card>
                        <CardHeader
                          title={store.name}
                        />
                        <CardMedia>
                          <MapFooter src={store.map} />
                        </CardMedia>
                        <CardContent>
                          {
                            Object.keys(stores[0]).filter(item => item !== 'name' && item !== 'map' && item !== '_id' && item !== 'logo' && item !== 'createdAt' && item !== 'updatedAt' && item !== '__v' && item !== 'favicon').map((attr, index) => (
                              <Box key={index} sx={{display: 'flex', alignItems: 'baseline'}}>
                                <Typography variant='subtitle2' component="span">{attr}{':'}</Typography>
                                <Typography variant='caption' component="span" sx={{pl: 3, textAlign: 'right', width: '100%'}}>{store[attr]}</Typography>
                              </Box>
                            ))
                          }
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                }
              </Grid>
            </Box>
          ))
        }
        <Link href="/" passHref>
          <Button sx={{'&:hover': {backgroundColor: theme.palette.secondary.main}}} size="large" variant="contained" startIcon={<ReplyIcon />}>
            back to shop
          </Button>
        </Link>
      </Box>
  );
}
