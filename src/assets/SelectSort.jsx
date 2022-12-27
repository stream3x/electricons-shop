import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useMediaQuery } from '@mui/material';

export default function SelectSort(props) {
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
          <MenuItem value='availability'>In Stock</MenuItem>
          <MenuItem value="lowest">Price: Hight to Low</MenuItem>
          <MenuItem value="highest">Price: Low to Hight</MenuItem>
          <MenuItem value="namelowest">Name: A - Z</MenuItem>
          <MenuItem value="namehighest">Name: Z - A</MenuItem>
          <MenuItem defaultValue="latest" value="latest">Featured Products</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}