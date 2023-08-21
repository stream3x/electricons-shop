import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Box, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';

export default function SelectSort(props) {
  const { sortHandler } = props;
  const matches = useMediaQuery('(min-width: 600px)');
  const router = useRouter();
  const isNotCat = router.pathname !== '/blog/category/[[...slug]]';
  const [value, setValue] = React.useState('')

  const handleChange = (event) => {
    sortHandler(event.target.value);
    setValue(event.target.value)
  };

  return (
    <Box sx={{ flex: {xs: 1, sm: 0} }}>
      {
            isNotCat && isNotCat ?
            <FormControl sx={{ m: 1, minWidth: {xs: '100%', sm: 100} }}>
              <InputLabel sx={{top: {xs: '-7px', sm: 0} }} id="select-label">Sort by</InputLabel>
              <Select
                size={!matches ? 'small' : 'medium'}
                labelId="select-label"
                id="select-label"
                value={value}
                onChange={handleChange}
                autoWidth
                label="Sort by"
              >
                <MenuItem value='availability'>{'In Stock'}</MenuItem>
                <MenuItem value="highest">Price: Hight to Low</MenuItem>
                <MenuItem value="lowest">Price: Low to Hight</MenuItem>
                <MenuItem value="namelowest">Name: A - Z</MenuItem>
                <MenuItem value="namehighest">Name: Z - A</MenuItem>
                <MenuItem defaultValue="latest" value="latest">Featured Products</MenuItem>
              </Select>
            </FormControl>
            :
            <FormControl sx={{ m: 1, minWidth: {xs: '100%', sm: 100} }}>
              <InputLabel sx={{top: {xs: '-7px', sm: 0} }} id="select-label">Sort by</InputLabel>
              <Select
                size={!matches ? 'small' : 'medium'}
                labelId="select-label"
                id="select-label"
                value={sort && sort}
                onChange={sortHandler}
                autoWidth
                label="Sort by"
              >
                <MenuItem value="namelowest">Name: A - Z</MenuItem>
                <MenuItem value="namehighest">Name: Z - A</MenuItem>
              </Select>
            </FormControl>
          }
    </Box>
  );
}