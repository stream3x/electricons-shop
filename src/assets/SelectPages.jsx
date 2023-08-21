import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Box, useMediaQuery } from '@mui/material';

export default function SelectPages(props) {
  const { pageSizeHandler, pageSize, values } = props;
  const matches = useMediaQuery('(min-width: 600px)');

  const handleChange = (event) => {
    pageSizeHandler(event.target.value);
  };

  return (
    <Box sx={{ flex: {xs: 1, sm: 0} }}>
      <FormControl sx={{ m: 1, minWidth: {xs: '100%', sm: 100} }}>
        <InputLabel sx={{top: {xs: '-7px', sm: 0} }} id="select-page-size">Show</InputLabel>
        <Select
          size={!matches ? 'small' : 'medium'}
          labelId="select-page-size"
          id="select-label"
          value={pageSize}
          onChange={handleChange}
          autoWidth
          label="Sort by"
        >
          {
            values.map(val => (
              <MenuItem key={val} value={val}>{`${val} per page`}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </Box>
  );
}