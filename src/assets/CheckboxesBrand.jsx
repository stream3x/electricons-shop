import * as React from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { Collapse } from '@mui/material';
import { useRouter } from 'next/router';
import data from '../utils/data';

export default function CheckboxesBrand() {
  const [expanded, setExpanded] = React.useState(false);
  const { products } = data;
  // const defaultState = products.filter(product => product.categoryUrl === slug.query.slug.toString());
  const brandState = products.map(item => item.brand);
  const unique = [...new Set(brandState)]
  const createBooleans = Array(unique.length).fill(false);

  const result = [createBooleans].map(row =>
    row.reduce((acc, cur, i) =>
      (acc[unique[i]] = cur, acc), {}))

  const [state, setState] = React.useState(result);

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Brand</FormLabel>
        {
          unique.slice(0, 3).map(item => (
            <FormGroup key={item}>
              <FormControlLabel
                sx={{'& span': {color: 'secondary.lightGrey'} }}
                control={
                  <Checkbox checked={result.item} onChange={handleChange} name={item} />
                }
                label={item}
              />
            </FormGroup>
          ))
        }
        <Collapse in={expanded} timeout="auto" unmountOnExit>
        {
            unique.slice(3, unique.length).map(item => (
              <FormGroup key={item}>
                <FormControlLabel
                  sx={{'& span': {color: 'secondary.lightGrey'} }}
                  control={
                    <Checkbox checked={result.item} onChange={handleChange} name={item} />
                  }
                  label={item}
                />
              </FormGroup>
            ))
          }
        </Collapse>
        {
          unique.length > 3 &&
          <FormHelperText sx={{cursor: 'pointer', '&:hover': {color: 'secondary.main'}}} onClick={handleExpandClick}>{!expanded ? "+ show more" : "- show less"}</FormHelperText>
        }
      </FormControl>
      
    </Box>
  );
}