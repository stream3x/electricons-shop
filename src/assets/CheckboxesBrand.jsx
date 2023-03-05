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
  const brandState = brands && brands.map(item => item);
  const unique = [...new Set(brandState)];
  const createBooleans = Array(unique.length).fill(false);
  const result = [createBooleans].map(row =>
    row.reduce((acc, cur, i) =>
      (acc[unique[i]] = cur, acc), {})
  );

  const arr = Object.entries(result[0]).map(([name, value]) => {
    return {
      name,
      value
    }
  });
  
  const [stateBrand, setStateBrand] = React.useState([arr][0]);

  // const { state, dispatch } = React.useContext(Store);
  // const { chips } = state;

  const handleChange = (item) => (event) => {
    const removeDuplicates = [];
    const update = stateBrand.map(x => {
      if(x.name === item.name) {
        return {
          ...x, value: event.target.checked
        }
      }
      return x;
    })
    setStateBrand(update);
  
    if(!item.value) {
      brandArray.push(item.name);
    }else {
      removeDuplicates.push(item.name);
    }
    brandHandler(brandArray = brandArray.filter(val => !removeDuplicates.includes(val)));
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // const handleRemoveChekedBox = React.useCallback(() => {
  //   setRun(() => false);
  //   const update = stateBrand.map(x => {
  //     if(x.name === [...Object.values(chips)][0]) {
  //       return {
  //         ...x, value: false
  //       }
  //     }
  //     return x;
  //   })
  //   setStateBrand(update);
  //   dispatch({ type: 'CHIPS', payload: { ...state.chips, chips: {}}});
  // }, [chips])

  // React.useEffect(() => {
  //   handleRemoveChekedBox();
  // }, [run]);

  // console.log(stateBrand, stateBrand.map(name => name.value));

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Brand</FormLabel>
        {
          brands.slice(0, 3).map(item => (
            <FormGroup key={Object.keys(item)}>
              <FormControlLabel
                sx={{'& span': {color: 'secondary.lightGrey'} }}
                control={
                  <Checkbox onChange={handleChange(item)} name={Object.keys(item)} value={Object.keys(item)} />
                }
                label={`${item}`}
              />
            </FormGroup>
          ))
        }
        <Collapse in={expanded} timeout="auto" unmountOnExit>
        {
          brands.slice(3, brands.length).map(item => (
              <FormGroup key={item.name}>
                <FormControlLabel
                  sx={{'& span': {color: 'secondary.lightGrey'} }}
                  control={
                    <Checkbox checked={item.value} onChange={handleChange(item.name)} name={item.name} value={item.name} />
                  }
                  label={item}
                />
              </FormGroup>
            ))
          }
        </Collapse>
        {
          brands.length > 3 &&
          <FormHelperText sx={{cursor: 'pointer', '&:hover': {color: 'secondary.main'}}} onClick={handleExpandClick}>{!expanded ? "+ show more" : "- show less"}</FormHelperText>
        }
      </FormControl>
      
    </Box>
  );
}