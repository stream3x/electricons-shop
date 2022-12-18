import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Input, Typography } from '@mui/material';

function valuetext(value) {
  return `$${value}`;
}

export default function RangeSlider() {
  const [value, setValue] = React.useState([20, 37]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  return (
    <Box sx={{ width: 300 }}>
      <Typography component="p" color="secondary" id="input-slider" gutterBottom>
        Filter by price
      </Typography>
      <Box sx={{ my: 2, display: 'flex' }}>
        <Input
          sx={{ '& input': {textAlign: 'center'}, flex: 1 }}
          value={value[0]}
          size="small"
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputProps={{
            step: 10,
            min: 0,
            max: 90,
            type: 'number',
            'aria-labelledby': 'input-slider',
          }}
        />
        <Typography component="span" color="secondary">
          -
        </Typography>
        <Input
          sx={{ '& input': {textAlign: 'center'}, flex: 1 }}
          value={value[1]}
          size="small"
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputProps={{
            step: 10,
            min: 10,
            max: 100,
            type: 'number',
            'aria-labelledby': 'input-slider',
          }}
        />
      </Box>
      <Slider
        getAriaLabel={() => 'Filter by price'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
      />
    </Box>
  );
}