import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Input, Typography } from '@mui/material';

function valuetext(value) {
  return `$${value}`;
}

const minDistance = 10;

export default function RangeSlider(props) {
  const { countProducts, price, priceHandler } = props;

  const [value, setValue] = React.useState([0, 10000]);

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 10000 - minDistance);
        setValue([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setValue([clamped - minDistance, clamped]);
      }
    } else {
      setValue(newValue);
    }
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 10000) {
      setValue(10000);
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
            max: 9990,
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
            max: 10000,
            type: 'number',
            'aria-labelledby': 'input-slider',
          }}
        />
      </Box>
      <Slider
        getAriaLabel={() => 'Filter by price'}
        value={[value[0], value[1]]}
        max={10000}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
      />
    </Box>
  );
}