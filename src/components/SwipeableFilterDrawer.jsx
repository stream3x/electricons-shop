import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import { AppBar, IconButton, ToggleButton, Toolbar, Typography, useMediaQuery } from '@mui/material';
import theme from '../theme';
import CartIcon from '@mui/icons-material/ShoppingCartOutlined';
import Link from '../Link';
import { Store } from '../utils/Store';
import RangeSlider from '../assets/RangeSlider';
import CheckboxesBrand from '../assets/CheckboxesBrand';
import CheckboxesCategory from '../assets/CheckboxesCategory';
import TuneIcon from '@mui/icons-material/Tune';

export default function SwipeableFilterDrawer(props) {
  const { countProducts, brands, brandHandler, categories, subCategories, subCategoryHandler, categoryHandler } = props;
  const [drawerState, setDrawerState] = React.useState({
    left: false
  });
  const matches = useMediaQuery('(min-width: 600px)');

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDrawerState({ ...drawerState, [anchor]: open });
  };

  const list = (anchor) => (
      <Box
        sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300, flexGrow: 2 }}
        role="presentation"
      >
      <Box sx={{display: 'flex', alignItems: 'center', p: 1}}>
          <IconButton onClick={toggleDrawer(anchor, false)}>
            <CloseIcon />
          </IconButton>
          <Typography gutterBottom variant="h6" component="h6" color="secondary" sx={{flex: 1, alignItems: 'center', mb: 0, textAlign: 'center'}}>
            Filters
          </Typography>
        </Box>
        <Divider />
        <AppBar elevation={1} sx={{bgcolor: theme.palette.primary.white, mt: 3}} position="static">
          <Toolbar>
            <RangeSlider countProducts={countProducts} />
          </Toolbar>
          <Toolbar>
            <CheckboxesBrand brands={brands} brandHandler={brandHandler} />
          </Toolbar>
          <Toolbar>
            <CheckboxesCategory categories={categories} subCategories={subCategories} subCategoryHandler={subCategoryHandler} categoryHandler={categoryHandler} />
          </Toolbar>
        </AppBar>
      </Box>
  );

  return (
    <Box sx={{ display: {xs: 'block', lg: 'none'} }}>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <ToggleButton
            size={!matches ? 'small' : 'medium'}
            onClick={toggleDrawer(anchor, true)}
          >
            <TuneIcon />
          </ToggleButton>
          <SwipeableDrawer
            anchor={anchor}
            open={drawerState[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </Box>
  );
}
