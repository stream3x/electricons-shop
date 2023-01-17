import * as React from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { Collapse } from '@mui/material';
import { Store } from '../utils/Store';

let brandArray = [];

export default function CheckboxesBrand(props) {
  const { brands, brandHandler } = props;
  const [expanded, setExpanded] = React.useState(false);
  const brandState = brands.map(item => item);
  const unique = [...new Set(brandState)];
  const createBooleans = Array(unique.length).fill(false);
  const result = [createBooleans].map(row =>
    row.reduce((acc, cur, i) =>
      (acc[unique[i]] = cur, acc), {})
  );
  const [stateBrand, setStateBrand] = React.useState(result[0]);
  delete stateBrand[0];
  const { state, dispatch } = React.useContext(Store);
  const { chips } = state;

  const handleChange = (item) => (event) => {
    const removeDuplicates = [];
    setStateBrand((prev) => ({
      ...prev,
      [item]: event.target.checked,
    }));
  
    if(!stateBrand[item]) {
      brandArray.push(item);
    }else {
      removeDuplicates.push(item);
    }
    
    brandHandler(brandArray = brandArray.filter(val => !removeDuplicates.includes(val)), event.target.checked);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // React.useEffect(() => {
  //     setStateBrand((prev) => ({
  //       ...prev,
  //       [Object.values(chips)]: false,
  //     }));
  //     dispatch({ type: 'CHIPS', payload: { ...state.chips, chips: {}}});
  // }, [chips])

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
                  <Checkbox name={item} checked={stateBrand[item]} onChange={handleChange(item)} />
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
                    <Checkbox onChange={handleChange(item)} name={item} value={item} />
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