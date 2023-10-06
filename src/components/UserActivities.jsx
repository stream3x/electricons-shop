import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import styled from '@emotion/styled';
import theme from '../theme';

const LabelBox = styled(Box)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.white,
  border: `thin solid ${theme.palette.primary.bgdLight}`,
  borderRadius: 10,
  height: '100%'
}));

export default function UserActivities(props) {
  const { orders: {total_orders}, favorites, reviews } = props;
  const totalOrders = Math.floor(total_orders[0].guest.length + total_orders[0].orders.length);
  const notPaid = Math.floor(total_orders[0].guest.filter(item => item.isPaid === false).length + total_orders[0].orders.filter(item => item.isPaid === false).length);
  const ratings = reviews.map(item => item.rating);

  function calculateAverageRating(ratings) {
    // Step 1: Calculate the total sum of ratings
    const totalSum = ratings.reduce((sum, rating) => sum + rating, 0);
  
    // Step 2: Calculate the number of reviews
    const numberOfReviews = ratings.length;
  
    // Step 3: Calculate the average rating
    const averageRating = totalSum / numberOfReviews;
  
    // Return the average rating
    return averageRating;
  }

  const averageRating = calculateAverageRating(ratings).toFixed(2);

  return (
    <Grid container spacing={3} sx={{height: '100%'}}>
      <Grid item xs={12} md={4}>
        <LabelBox sx={{display: 'flex', p: 3}}>
          <Box sx={{width: 50, height: 50, borderRadius: '100%', bgcolor: theme.palette.primary.bgdLight, display: 'flex', justifyContent: 'center', alignItems: 'center', flex: {xs: '0 0 25%', md: '0 0 20%'}}}>
            <ShoppingBasketIcon color='primary' />
          </Box>
          <Box sx={{display: 'flex', flexWrap: 'wrap', pl: 3}}>
            <Typography component="h3" variant='h5' sx={{width: '100%', fontWeight: 'bold', p: 1, pl: 0}}>Orders</Typography>
            <Typography sx={{flex: 1, color: theme.palette.secondary.lightGrey}}>
              TOTAL
              <Typography sx={{fontWeight: 'bold', color: theme.palette.secondary.main}} variant='h5' component="h4">{totalOrders}</Typography>
            </Typography>
            <Typography sx={{color: theme.palette.secondary.lightGrey}}>
              NOT PAID
              <Typography sx={{fontWeight: 'bold', color: theme.palette.secondary.main}} variant='h5' component="h4">{notPaid}</Typography>
            </Typography>
          </Box>
        </LabelBox>
      </Grid>
      <Grid item xs={12} md={4}>
        <LabelBox sx={{display: 'flex', p: 3}}>
          <Box sx={{width: 50, height: 50, borderRadius: '100%', bgcolor: theme.palette.primary.bgdLight, display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '0 0 20%'}}>
            <FavoriteIcon color='primary' />
          </Box>
          <Box sx={{display: 'flex', flexWrap: 'wrap', pl: 3}}>
            <Typography component="h3" variant='h5' sx={{width: '100%', fontWeight: 'bold', p: 1, pl: 0}}>Favourites</Typography>
            <Typography sx={{flex: 1, color: theme.palette.secondary.lightGrey}}>
              PRODUCTS
              <Typography sx={{fontWeight: 'bold', color: theme.palette.secondary.main}} variant='h5' component="h4">{favorites?.length}</Typography>
            </Typography>
          </Box>
        </LabelBox>
      </Grid>
      <Grid item xs={12} md={4}>
        <LabelBox sx={{display: 'flex', p: 3}}>
          <Box sx={{width: 50, height: 50, borderRadius: '100%', bgcolor: theme.palette.primary.bgdLight, display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '0 0 20%'}}>
            <StarIcon color='primary' />
          </Box>
          <Box sx={{display: 'flex', flexWrap: 'wrap', pl: 3}}>
            <Typography component="h3" variant='h5' sx={{width: '100%', fontWeight: 'bold', p: 1, pl: 0}}>Reviews</Typography>
            <Typography sx={{flex: 1, color: theme.palette.secondary.lightGrey}}>
              TOTAL
              <Typography sx={{fontWeight: 'bold', color: theme.palette.secondary.main}} variant='h5' component="h4">{reviews?.length}</Typography>
            </Typography>
            <Typography sx={{color: theme.palette.secondary.lightGrey}}>
              AVG. RATING
              <Typography sx={{fontWeight: 'bold', display: 'flex', alignItems: 'center', color: theme.palette.secondary.main}} variant='h5' component="h4">{averageRating !== 'NaN' ? averageRating : 0}
              <StarIcon color='warning' />
              </Typography>
            </Typography>
          </Box>
        </LabelBox>
      </Grid>
    </Grid>
  )
}
