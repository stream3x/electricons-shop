import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import theme from '../theme';
import SwipeableViews from 'react-swipeable-views';
import { useMediaQuery } from '@mui/material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, width: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs({productData}) {
  const [value, setValue] = React.useState(0);
  const [activeStep, setActiveStep] = React.useState(0);
  const matches = useMediaQuery('(min-width: 600px)');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 240,  width: '100%', flexWrap: {xs: 'wrap', sm: 'nowrap'}}}
    >
      <Tabs
        orientation={matches && "vertical"}
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: {xs: 0, sm: `thin solid ${theme.palette.secondary.borderColor}`}, minWidth: '80px' }}
      >
      {
        productData.images.map((img, index) => (
          <Tab key={img.image + index} label="" {...a11yProps(index)} sx={{ backgroundImage: `url(${img.image})`, backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', my: 1, minWidth: '70px', maxWidth: '70px'}}>
          </Tab>
        ))
      }
      </Tabs>
      <SwipeableViews
      axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
      index={value}
      onChangeIndex={handleChange}
      style={{width: "100%", overflow: 'hidden'}}
      enableMouseEvents
      >
      {
        productData.images.map((img, index) => (
          <TabPanel key={img.image} value={value} index={index}>
              <Box
                component="img"
                sx={{
                  height: {xs: 140, sm: 200},
                  display: 'block',
                  maxWidth: 400,
                  overflow: 'hidden',
                  width: 'auto',
                  margin: 'auto'
                }}
                src={img.image}
                alt={productData.title}
              />
          </TabPanel>
          ))
      }
      </SwipeableViews>
    </Box>
  );
}
