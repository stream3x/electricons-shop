import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Link from '../Link';
import { useRouter } from 'next/router';
import { Button, Collapse, Grid, IconButton, Menu, MenuItem, Typography, useMediaQuery } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import theme from '../theme';
import Image from 'next/image';
import { TabContext } from '@mui/lab';
import axios from 'axios';
import styled from '@emotion/styled';
import Countdown from '../assets/Countdown';

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.white,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
  textTransform: 'capitalize',
  backgroundColor: theme.palette.error.main,
  border: 'thin solid lightGrey',
  borderLeft: '3px solid black',
}));

export default function NavTabs(props) {
  const router = useRouter();
  const { pages } = props;
  const matches = useMediaQuery('(min-width: 600px)');
  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [isFetched, setIsFetched] = React.useState(true);
  const [storePromo, setStorePromo] = React.useState([]);

  React.useEffect(() => {
    setIsFetched(false);
    fetchStorePromo();
  }, []);

  async function fetchStorePromo() {
    if(!isFetched) return;
    try {
      const { data } = await axios.get('/api/products');
      setStorePromo(data.products);
    } catch (error) {
      console.log(error);
    }
  }
  
  const desktopPromo = storePromo && storePromo.filter(promo => promo.category === 'Desktop computers');

  const laptopPromo = storePromo && storePromo.filter(promo => promo.category === 'Laptop computers');

  const mobilePromo = storePromo && storePromo.filter(promo => promo.category === 'Smartphones');

  const uniqueBrands = [...new Set(storePromo.map(product => product.brand))];

  const uniqueBrandObjects = uniqueBrands.map(brand => {
    return storePromo.find(product => product.brand === brand);
});

  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box component="nav" sx={{ width: '100%', maxWidth: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
      <Link href="/">
        <IconButton>
          <HomeIcon sx={{ '&:hover': { color: theme.palette.primary.main }}}/>
        </IconButton>
      </Link>
      <TabContext value={value}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Laptops" onClick={handleClick} />
          <Tab label="Desktop" onClick={handleClick} />
          <Tab label="Smartphones" onClick={handleClick} />
          <Tab label="Brands" onClick={handleClick} />
          <Tab label="Item Five" onClick={handleClick} />
          <Tab label="Item Six" onClick={handleClick} />
          <Tab label="Item Seven" onClick={handleClick} />
        </Tabs>
        <Collapse
         in={open}
         style={{ transformOrigin: '0 0 0' }}
          {...(open ? { timeout: 1000 } : {})}
        >
          {
            value === 0 &&
            <TabPanel sx={{px: 0}} value={value} index={0} dir={theme.direction}>
              <Menu
                id="laptops"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <Grid sx={{width: '100%', '& a': {textDecoration: 'none'}}} container spacing={0}>
                  <Grid sx={{px: 2}} item xs={12}>
                    <LabelButton sx={{width: '100%', display: 'flex', justifyContent: 'space-between', bgcolor: 'red'}}>
                      <Typography sx={{fontWeight: '600'}}>
                       SuperDeals 50% off
                      </Typography>
                      <Typography sx={{display: 'flex'}}>
                        <Typography component="span">Ends:</Typography> 
                        <Countdown />
                      </Typography>
                    </LabelButton>
                  </Grid>
                  {
                    laptopPromo && laptopPromo.map(laptop => (
                      <Grid key={laptop._id} item xs={Math.ceil(12 / laptopPromo.length)}>
                         <MenuItem sx={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', '& a': {width: '100%!important'} }} onClick={handleClose}>
                            <Link passHref noLinkStyle href={`/product/${laptop.slug}`}>
                              <Box sx={{ p: 2, mb: 3, bgcolor: theme.palette.badge.bgdLight }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center','& img': {objectFit: 'contain', width: 'auto!important', height: '120px!important', position: 'relative!important'}, p: 2 }}>
                                  <Image
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority
                                    src={laptop.images.length > 1 ? laptop.images[1].image : '/images/no-image.jpg'}
                                    alt={laptop.title}
                                    quality={35}
                                  />
                                </Box>
                              </Box>
                              <Typography color="secondary">
                                {laptop.title}
                              </Typography>
                              <Typography color="primary">
                                {`$${laptop.price}`}
                              </Typography>
                            </Link>
                         </MenuItem>
                      </Grid>
                    ))
                  }
                  </Grid>
              </Menu>    
            </TabPanel>
          }
          {
            value === 1 &&
            <TabPanel sx={{px: 0}} value={value} index={1} dir={theme.direction}>
              <Menu
                sx={{display: 'flex', justifyContent: 'center'}}
                id="desktop"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <Grid sx={{width: '100%', '& a': {textDecoration: 'none'}}} container spacing={0}>
                  <Grid sx={{px: 2}} item xs={12}>
                    <LabelButton sx={{width: '100%', display: 'flex', justifyContent: 'space-between', bgcolor: 'red', color: 'white'}}>
                      <Typography sx={{fontWeight: '600'}}>
                        SuperDeals FreeShipping
                      </Typography>
                      <Typography sx={{display: 'flex'}}>
                        <Typography component="span">Ends:</Typography> 
                        <Countdown />
                      </Typography>
                    </LabelButton>
                  </Grid>             
                  {
                    desktopPromo && desktopPromo.map(desktop => (
                      <Grid key={desktop._id} item xs={Math.ceil(12 / desktopPromo.length)}>
                        <MenuItem sx={{ minWidth: '250px', display: 'flex', justifyContent: 'center', '& a': {width: '100%!important'} }} onClick={handleClose}>
                          <Link passHref noLinkStyle href={`/product/${desktop.slug}`}>
                            <Box sx={{p: 2, mb: 3, bgcolor: theme.palette.badge.bgdLight, overflow: 'hidden'}}>
                              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center','& img': {objectFit: 'contain', width: 'unset!important', height: '120px!important', position: 'relative!important'}, p: 2 }}>
                                <Image
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  priority
                                  src={desktop.images.length > 1 ? desktop.images[1].image : '/images/no-image.jpg'}
                                  alt={desktop.title}
                                  quality={35}
                                />
                              </Box>
                            </Box>
                            <Typography color="secondary">
                            {desktop.title}
                            </Typography>
                            <Typography color="primary">
                              {`$${desktop.price}`}
                            </Typography>
                          </Link>
                        </MenuItem>
                      </Grid>
                    ))
                  }
                </Grid>
              </Menu>    
            </TabPanel>
          }
          {
            value === 2 &&
            <TabPanel sx={{px: 0}} value={value} index={2} dir={theme.direction}>
              <Menu
              sx={{display: 'flex', justifyContent: 'center'}}
                id="smartphones"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <Grid sx={{width: '100%', '& a': {textDecoration: 'none'}}} container spacing={0}>
                  <Grid sx={{px: 2}} item xs={12}>
                    <LabelButton sx={{width: '100%', display: 'flex', justifyContent: 'center', bgcolor: 'red'}}>
                      <Typography sx={{fontWeight: '600'}}>
                        95.2% Positive Feedback
                      </Typography>
                    </LabelButton>
                  </Grid>
                  {
                    mobilePromo && mobilePromo?.map(desktop => (
                      <Grid key={desktop._id} sx={{pr: '1rem'}} item xs={mobilePromo.length < 4 ? Math.ceil(12 / mobilePromo.length) : 4}>
                        <MenuItem sx={{ minWidth: '250px', display: 'flex', justifyContent: 'center', '& a': {width: '100%!important'} }} onClick={handleClose}>
                          <Link passHref noLinkStyle href={`/product/${desktop.slug}`}>
                            <Box sx={{p: 2, mb: 3, bgcolor: theme.palette.badge.bgdLight, overflow: 'hidden'}}>
                              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center','& img': {objectFit: 'contain', width: 'unset!important', height: '120px!important', position: 'relative!important'}, p: 2 }}>
                                <Image
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  priority
                                  src={desktop.images.length > 1 ? desktop.images[1].image : '/images/no-image.jpg'}
                                  alt={desktop.title}
                                  quality={35}
                                />
                              </Box>
                            </Box>
                            <Typography color="secondary">
                            {desktop.title}
                            </Typography>
                            <Typography color="primary">
                              {`$${desktop.price}`}
                            </Typography>
                          </Link>
                        </MenuItem>
                      </Grid>
                    ))
                  }
                </Grid>
              </Menu>    
            </TabPanel>
          }
          {
            value === 3 &&
            <TabPanel sx={{px: 0}} value={value} index={3}>
              <Menu
                sx={{display: 'flex', justifyContent: 'center'}}
                id="brands"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <Grid sx={{'& a': {textDecoration: 'none'}}} container spacing={0}>
                  {
                    uniqueBrandObjects?.map(store => (
                      <Grid key={store._id} item xs={4}>
                        <MenuItem sx={{ minWidth: '80px', display: 'flex', justifyContent: 'center', '& a': {width: '100%!important'} }} onClick={handleClose}>
                          <Link passHref noLinkStyle href={`/search?&brand=${store.brand}`}>
                            <Box sx={{p: 1}}>
                              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center','& img': {objectFit: 'contain', width: 'auto!important', height: '40px!important', position: 'relative!important'} }}>
                                <Image
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  src={store.brandImg ? store.brandImg : '/images/no-image.jpg'}
                                  alt={store.title}
                                  quality={35}
                                />
                              </Box>
                            </Box>
                          </Link>
                        </MenuItem>
                      </Grid>
                    ))
                  }
                </Grid>
              </Menu>    
            </TabPanel>
          }
        </Collapse>
      </TabContext>
    </Box>
  );
}