import React from 'react'
import { Box, Button, Grid, Paper, Typography } from '@mui/material'
import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import axios from 'axios'
import theme from '../../../src/theme'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Link from '../../../src/Link'

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.white,
  border: 'thin solid lightGrey',
  borderLeft: '5px solid black',
}));

function CreateNewItems() {
  const userInf0 = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  const [error, setError] = React.useState('');

  

  return (
    <Box>
      {
        error ?
          <LabelButton sx={{width: '100%', my: 5, p: 2}}>
            <Typography sx={{m: 0, p: 1, fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h5" component="h1" gutterBottom>
            {error}
            </Typography>
          </LabelButton>
         : 
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <Box sx={{display: 'flex', py: 3}}>
              <Box sx={{flex: 1}}>
                <Typography component="h2" variant='h6'>Add new product</Typography>
                <Typography variant='caption'>
                  Fill in the fields below to create a new product
                </Typography>
              </Box>
              <Box>
                <Link href={`/backoffice/${userInf0._id}/list`}>
                  <Button variant="outlined" startIcon={<KeyboardBackspaceIcon />}>
                    go to All Products
                  </Button>
                </Link>
              </Box>
            </Box>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              
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
              
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
             
            </Paper>
          </Grid>
        </Grid>
      }
    </Box>
  )
}

export default dynamic(() => Promise.resolve(CreateNewItems), { ssr: false });