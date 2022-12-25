import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useMediaQuery } from '@mui/material';

export default function SelectPages(props) {
  const { value, pageSizeHandler, pageSize } = props;
  const matches = useMediaQuery('(min-width: 600px)');

  const handleChange = (event) => {
    pageSizeHandler(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 100 }}>
        <InputLabel sx={{top: {xs: '-7px', sm: 0} }} id="select-label">Show</InputLabel>
        <Select
          size={!matches ? 'small' : 'medium'}
          labelId="select-label"
          id="select-label"
          value={value ? value : ''}
          onChange={handleChange}
          autoWidth
          label="Sort by"
        >
          <MenuItem value={4}>4 per page</MenuItem>
          <MenuItem value={16}>16 per page</MenuItem>
          <MenuItem value={32}>32 per page</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}