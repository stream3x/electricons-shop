import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useMediaQuery } from '@mui/material';

export default function SelectCategory() {
  const [sort, setSort] = React.useState('');
  const matches = useMediaQuery('(min-width: 600px)');

  const handleChange = (event) => {
    setSort(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 100 }}>
        <InputLabel sx={{top: {xs: '-7px', sm: 0} }} id="select-label">Sort by</InputLabel>
        <Select
          size={!matches ? 'small' : 'medium'}
          labelId="select-label"
          id="select-label"
          value={sort}
          onChange={handleChange}
          autoWidth
          label="Sort by"
        >
          <MenuItem value={10}>Best sellers</MenuItem>
          <MenuItem value={21}>Name, A to Z</MenuItem>
          <MenuItem value={22}>Name, Z to A</MenuItem>
          <MenuItem value={31}>Price, low to high</MenuItem>
          <MenuItem value={32}>Price, high to low</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}