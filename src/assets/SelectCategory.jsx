import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useMediaQuery } from '@mui/material';

export default function SelectCategory(props) {
  const { sort, sortHandler } = props;
  const matches = useMediaQuery('(min-width: 600px)');

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 100 }}>
        <InputLabel sx={{top: {xs: '-7px', sm: 0} }} id="select-label">Sort by</InputLabel>
        <Select
          size={!matches ? 'small' : 'medium'}
          labelId="select-label"
          id="select-label"
          value={sort ? sort : ''}
          onChange={sortHandler}
          autoWidth
          label="Sort by"
        >
          <MenuItem value="featured">Featured</MenuItem>
          <MenuItem value="lowest">Price: Low to Hight</MenuItem>
          <MenuItem value="highest">Price: Hight to Low</MenuItem>
          <MenuItem value="newest">New Arrivals</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}