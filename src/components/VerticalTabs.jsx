import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

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
  const theme = useTheme();
  const maxSteps = productData.images.length;
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 240,  width: '100%'}}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider', minWidth: '80px' }}
      >
      {
        productData.images.map((img, index) => (
          <Tab key={img.image + index} label="" {...a11yProps(index)} sx={{ backgroundImage: `url(${img.image})`, backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', my: 1, minWidth: '70px', maxWidth: '70px'}}>
          </Tab>
        ))
      }
      </Tabs>
      {
        productData.images.map((img, index) => (
            <TabPanel key={img.image} value={value} index={index} style={{width: "100%"}}>
            <Box
              component="img"
              sx={{
                height: 200,
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
    </Box>
  );
}
