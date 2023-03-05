import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Checkbox, Collapse, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, IconButton, ToggleButton, Toolbar, Typography, useMediaQuery } from '@mui/material';
import theme from '../theme';
import CartIcon from '@mui/icons-material/ShoppingCartOutlined';
import Link from '../Link';
import { Store } from '../utils/Store';
import RangeSlider from '../assets/RangeSlider';
import CheckboxesBrand from '../assets/CheckboxesBrand';
import CheckboxesCategory from '../assets/CheckboxesCategory';
import TuneIcon from '@mui/icons-material/Tune';

export default function SwipeableFilterDrawer(props) {
  const { countProducts, brands, brandHandler, expanded, newSubCat, handleChangeSubCat, handleExpandClick } = props;
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
  {/*<CheckboxesBrand brands={brands} brandHandler={brandHandler} />*/}
          </Toolbar>
          <Toolbar>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                <FormLabel component="legend">Categories</FormLabel>
                {
                  // resultTopCat && resultTopCat.slice(0, 3).map((item, i) => (
                  //   <FormGroup key={item}>
                  //     <FormControlLabel
                  //       sx={{'& span': {color: 'secondary.lightGrey'} }}
                  //       control={
                  //         <Checkbox onChange={handleChangeTopCat(item)} />
                  //       }
                  //       label={item.toString().replace(/-/g, ' ').replace(/^./, function(x){return x.toUpperCase()})}
                  //     />
                  //   </FormGroup>
                  // ))
                }
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                {
                  // resultTopCat && resultTopCat.slice(3, resultTopCat.length).map(item => (
                  //     <FormGroup key={item}>
                  //       <FormControlLabel
                  //         sx={{'& span': {color: 'secondary.lightGrey'} }}
                  //         control={
                  //           <Checkbox onChange={handleChangeTopCat(item)} />
                  //         }
                  //         label={item.toString().replace(/-/g, ' ').replace(/^./, function(x){return x.toUpperCase()})}
                  //       />
                  //     </FormGroup>
                  //   ))
                }
                </Collapse>
                {
                  // categories.length > 3 &&
                  // <FormHelperText sx={{cursor: 'pointer', '&:hover': {color: 'secondary.main'}}} onClick={handleExpandClick}>{!expanded ? "+ show more" : "- show less"}</FormHelperText>
                }
              </FormControl>
              <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                <FormLabel component="legend">Brand Categories</FormLabel>
                {
                  newSubCat && newSubCat.slice(0, 3).map(item => (
                    <FormGroup key={Object.keys(item).toString()}>
                      <FormControlLabel
                        sx={{'& span': {color: 'secondary.lightGrey'} }}
                        control={
                          <Checkbox onChange={handleChangeSubCat(item)} />
                        }
                        label={`${Object.values(item)}`}
                      />
                    </FormGroup>
                  ))
                }
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                {
                  newSubCat && newSubCat.slice(3, newSubCat.length).map(item => (
                    <FormGroup key={Object.keys(item)}>
                      <FormControlLabel
                        sx={{'& span': {color: 'secondary.lightGrey'} }}
                        control={
                          <Checkbox onChange={handleChangeSubCat(item)} />
                        }
                        label={Object.keys(item)}
                      />
                    </FormGroup>
                  ))
                }
                </Collapse>
                {
                  newSubCat && newSubCat.length > 3 &&
                  <FormHelperText sx={{cursor: 'pointer', '&:hover': {color: 'secondary.main'}}} onClick={handleExpandClick}>{!expanded ? "+ show more" : "- show less"}</FormHelperText>
                }
              </FormControl>
            </Box>
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
