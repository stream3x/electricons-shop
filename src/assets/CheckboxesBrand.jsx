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

let brandArray = [];

export default function CheckboxesBrand(props) {
  const { brands, brandHandler, chipData } = props;
  const [expanded, setExpanded] = React.useState(false);
  const brandState = brands.map(item => item);
  const unique = [...new Set(brandState)];
  const createBooleans = Array(unique.length).fill(false);
  const result = [createBooleans].map(row =>
    row.reduce((acc, cur, i) =>
      (acc[unique[i]] = cur, acc), {})
  );
  const router = useRouter();
  const query = router.query;

  const arr = Object.entries(result[0]).map(([name, value]) => {
    return {
      name,
      value
    }
  });
  const [stateBrand, setStateBrand] = React.useState([arr][0]);
  const [checkStatus, setCheckStatus] = React.useState(true);
  // const removeQuery = `${router.asPath}`.replace(`query=${query.replace(/ /g, '+')}`, '');
  React.useEffect(() => {
    chipData && chipData.map(chip => {
      stateBrand.map(brand => {
        if(chip.label.toString() === brand.name) {
          setCheckStatus(false)
          console.log(checkStatus)
          console.log(chipData);
        }
        setCheckStatus(true)
      })
    })
  }, [chipData])

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
    brandHandler(brandArray = brandArray.filter(val => !removeDuplicates.includes(val)), event.target.checked);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {
        stateBrand.length > 1 &&
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormLabel component="legend">Brand</FormLabel>
          {
            stateBrand.slice(0, 3).map(item => (
              <FormGroup key={item.name}>
                <FormControlLabel
                  sx={{'& span': {color: 'secondary.lightGrey'} }}
                  control={
                    <Checkbox checked={item.value ? item.value : false} onChange={handleChange(item)} />
                  }
                  label={`${item.value}`}
                />
              </FormGroup>
            ))
          }
          <Collapse in={expanded} timeout="auto" unmountOnExit>
          {
              stateBrand.slice(3, stateBrand.length).map(item => (
                <FormGroup key={item.name}>
                  <FormControlLabel
                    sx={{'& span': {color: 'secondary.lightGrey'} }}
                    control={
                      <Checkbox checked={item.value} onChange={handleChange(item)} />
                    }
                    label={item.name}
                  />
                </FormGroup>
              ))
            }
          </Collapse>
          {
            stateBrand.length > 3 &&
            <FormHelperText sx={{cursor: 'pointer', '&:hover': {color: 'secondary.main'}}} onClick={handleExpandClick}>{!expanded ? "+ show more" : "- show less"}</FormHelperText>
          }
        </FormControl>
      }
    </Box>
  );
}