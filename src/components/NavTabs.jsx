import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Link from '../Link';
import { useRouter } from 'next/router';
import { Button, Collapse, Divider, Grid, IconButton, List, ListItem, ListItemText, ListSubheader, Menu, MenuItem, useMediaQuery } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import theme from '../theme';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Image from 'next/image';
import { TabContext } from '@mui/lab';
import SwipeableViews from 'react-swipeable-views';
import axios from 'axios';

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
    console.log(event.currentTarget);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event, newValue) => {
    console.log(newValue);
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
                id="mouse-over-popover-1"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                
                <MenuItem onClick={handleClose}>
                  <Grid sx={{width: '100%', mr: '1rem', '& a': {textDecoration: 'none'}}} container spacing={2}>
                  {
                    laptopPromo && laptopPromo.map(laptop => (
                      <Grid key={laptop._id} sx={{pr: '1rem'}} item xs={Math.ceil(12 / laptopPromo.length)}>
                        <Link passHref noLinkStyle href={`/product/${laptop.slug}`}>
                          <List
                            sx={{ border: `thin solid ${theme.palette.badge.bgd}`, borderRadius: '3px' }}
                            subheader={
                              <ListSubheader sx={{ bgcolor: theme.palette.badge.bgdLight }} component="div" id="nested-list-subheader">
                                {laptop.brand}
                              </ListSubheader>
                            }
                          >
                            <Box sx={{p: 2, mb: 3, bgcolor: theme.palette.badge.bgdLight, overflow: 'hidden'}}>
                              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center','& img': {objectFit: 'contain', width: 'unset!important', height: '120px!important', position: 'relative!important'}, p: 2 }}>
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
                            <ListItem disablePadding>
                              <ListItemText sx={{'& span': { fontSize: '.75rem', fontWeight: 'bold', color: 'secondary.main', px: 2} }} primary={laptop.title} />
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemText sx={{'& span': {color: 'primary.main', px: 2} }} primary={`$${laptop.price}`} />
                            </ListItem>
                          </List>
                        </Link>
                      </Grid>
                    ))
                  }
                  </Grid>
                </MenuItem>
              </Menu>    
            </TabPanel>
          }
          {
            value === 1 &&
            <TabPanel sx={{px: 0}} value={value} index={1} dir={theme.direction}>
              <Menu
                id="mouse-over-popover-1"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={handleClose}>
                  <Grid sx={{width: '100%', mr: '1rem', '& a': {textDecoration: 'none'}}} container spacing={2}>
                    {
                      desktopPromo && desktopPromo.map(desktop => (
                        <Grid key={desktop._id} sx={{pr: '1rem'}} item xs={Math.ceil(12 / desktopPromo.length)}>
                          <Link passHref noLinkStyle href={`/product/${desktop.slug}`}>
                            <List
                              sx={{ border: `thin solid ${theme.palette.badge.bgd}`, borderRadius: '3px' }}
                              subheader={
                                <ListSubheader sx={{ bgcolor: theme.palette.badge.bgdLight }} component="div" id="nested-list-subheader">
                                  {desktop.brand}
                                </ListSubheader>
                              }
                            >
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
                              <ListItem disablePadding>
                                <ListItemText sx={{'& span': { fontSize: '.75rem', fontWeight: 'bold', color: 'secondary.main', px: 2} }} primary={desktop.title} />
                              </ListItem>
                              <ListItem disablePadding>
                                <ListItemText sx={{'& span': {color: 'primary.main', px: 2} }} primary={`$${desktop.price}`} />
                              </ListItem>
                            </List>
                          </Link>
                        </Grid>

                      ))
                    }
                  </Grid>
                </MenuItem>
              </Menu>    
            </TabPanel>
          }
          {
            value === 2 &&
            <TabPanel sx={{px: 0}} value={value} index={2} dir={theme.direction}>
              <Menu
                id="mouse-over-popover-1"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={handleClose}>
                  <Grid sx={{width: '100%', mr: '1rem', '& a': {textDecoration: 'none'}}} container spacing={2}>
                    {
                      mobilePromo && mobilePromo?.map(desktop => (
                        <Grid key={desktop._id} sx={{pr: '1rem'}} item xs={mobilePromo.length < 4 ? Math.ceil(12 / mobilePromo.length) : 3}>
                          <Link passHref noLinkStyle href={`/product/${desktop.slug}`}>
                            <List
                              sx={{ border: `thin solid ${theme.palette.badge.bgd}`, borderRadius: '3px' }}
                              subheader={
                                <ListSubheader sx={{ bgcolor: theme.palette.badge.bgdLight }} component="div" id="nested-list-subheader">
                                  {desktop.brand}
                                </ListSubheader>
                              }
                            >
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
                              <ListItem disablePadding>
                                <ListItemText sx={{'& span': { fontSize: '.75rem', fontWeight: 'bold', color: 'secondary.main', px: 2} }} primary={desktop.title} />
                              </ListItem>
                              <ListItem disablePadding>
                                <ListItemText sx={{'& span': {color: 'primary.main', px: 2} }} primary={`$${desktop.price}`} />
                              </ListItem>
                            </List>
                          </Link>
                        </Grid>

                      ))
                    }
                  </Grid>
                </MenuItem>
              </Menu>    
            </TabPanel>
          }
          {
            value === 3 &&
            <TabPanel sx={{px: 0}} value={value} index={3} dir={theme.direction}>
              <Menu
                id="mouse-over-popover-1"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={handleClose}>
                  <Grid sx={{width: 500, '& a': {textDecoration: 'none'}}} container spacing={2}>
                    {
                      uniqueBrandObjects?.map(store => (
                        <Grid key={store._id} item xs={4}>
                          <Link passHref noLinkStyle href={`/product/${store.slug}`}>
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
                        </Grid>
                      ))
                    }
                  </Grid>
                </MenuItem>
              </Menu>    
            </TabPanel>
          }
        </Collapse>
      </TabContext>
    </Box>
  );
}