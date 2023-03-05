import * as React from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { Collapse } from '@mui/material';

export default function CheckboxesCategory(props) {
  const { newSubCat, handleChangeSubCat, handleChangeTopCat } = props;
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Categories</FormLabel>
        {
          // resultTopCat && resultTopCat.slice(0, 3).map((item, i) => (
          //   <FormGroup key={item}>
          //     <FormControlLabel
          //       sx={{'& span': {color: 'secondary.lightGrey'} }}
          //       control={
          //         <Checkbox onChange={handleChangeTopCat(item)} />
          //       }
          //       label={item.toString().replace(/-/g, ' ').replace(/^./, function(x){return x.toUpperCase()})}
          //     />
          //   </FormGroup>
          // ))
        }
        <Collapse in={expanded} timeout="auto" unmountOnExit>
        {
          // resultTopCat && resultTopCat.slice(3, resultTopCat.length).map(item => (
          //     <FormGroup key={item}>
          //       <FormControlLabel
          //         sx={{'& span': {color: 'secondary.lightGrey'} }}
          //         control={
          //           <Checkbox onChange={handleChangeTopCat(item)} />
          //         }
          //         label={item.toString().replace(/-/g, ' ').replace(/^./, function(x){return x.toUpperCase()})}
          //       />
          //     </FormGroup>
          //   ))
          }
        </Collapse>
        {
          // categories.length > 3 &&
          // <FormHelperText sx={{cursor: 'pointer', '&:hover': {color: 'secondary.main'}}} onClick={handleExpandClick}>{!expanded ? "+ show more" : "- show less"}</FormHelperText>
        }
      </FormControl>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Brand Categories</FormLabel>
        {
          newSubCat && newSubCat.slice(0, 3).map(item => (
            <FormGroup key={item}>
              <FormControlLabel
                sx={{'& span': {color: 'secondary.lightGrey'} }}
                control={
                  <Checkbox onChange={handleChangeSubCat(item)} />
                }
                label={Object.keys(item)}
              />
            </FormGroup>
          ))
        }
        <Collapse in={expanded} timeout="auto" unmountOnExit>
        {
          newSubCat && newSubCat.slice(3, newSubCat.length).map(item => (
            <FormGroup key={item}>
              <FormControlLabel
                sx={{'& span': {color: 'secondary.lightGrey'} }}
                control={
                  <Checkbox onChange={handleChangeSubCat(item)} />
                }
                label={item.toString().replace(/-/g, ' ').replace(/^./, function(x){return x.toUpperCase()})}
              />
            </FormGroup>
          ))
        }
        </Collapse>
        {
          newSubCat && newSubCat.length > 3 &&
          <FormHelperText sx={{cursor: 'pointer', '&:hover': {color: 'secondary.main'}}} onClick={handleExpandClick}>{!expanded ? "+ show more" : "- show less"}</FormHelperText>
        }
      </FormControl>
    </Box>
  );
}