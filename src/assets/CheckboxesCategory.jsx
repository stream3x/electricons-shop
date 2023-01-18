import * as React from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { Collapse } from '@mui/material';

let catArray = [];
let subCatArray = [];

export default function CheckboxesCategory(props) {
  const [expanded, setExpanded] = React.useState(false);
  const { categories, subCategories, categoryHandler, subCategoryHandler } = props;
  const topCategoryState = categories.map(item => item);
  const subCategoryState = subCategories.map(item => item);
  const uniqueTopCat = [...new Set(topCategoryState)];
  const uniqueSubCat = [...new Set(subCategoryState)];
  const createTopCatBooleans = Array(uniqueTopCat.length).fill(false);
  const createSubCatBooleans = Array(uniqueSubCat.length).fill(false);

  const resultTopCat = [createTopCatBooleans].map(row =>
    row.reduce((acc, cur, i) => (
      acc[uniqueTopCat[i]] = cur, acc
    ), {}
  ));

  const resultSubCat = [createSubCatBooleans].map(row =>
    row.reduce((acc, cur, i) => (
      acc[uniqueSubCat[i]] = cur, acc
    ), {}
  ));

  const [topCat, setTopCat] = React.useState(resultTopCat);
  const [subCat, setSubCat] = React.useState(resultSubCat);
  delete topCat[0];

  const handleChangeTopCat = (item) => (event) => {
    const removeDuplicates = [];

    setTopCat((prev) => ({
      ...prev,
      [item]: event.target.checked,
    }));

    if(!topCat[item]) {
      catArray.push(item);
    }else {
      removeDuplicates.push(item);
    }

    categoryHandler(catArray = catArray.filter(val => !removeDuplicates.includes(val)), event.target.checked);
  };

  const handleChangeSubCat = (item) => (event) => {
    const removeDuplicates = [];

    setSubCat((prev) => ({
      ...prev,
      [item]: event.target.checked,
    }));

    if(!subCat[item]) {
      subCatArray.push(titleCase(item));
    }else {
      removeDuplicates.push(titleCase(item));
    }

    function titleCase(str) {
      str = str.replace(/-/g, ' ');
      var splitStr = str.toLowerCase().split(' ');
      for (var i = 0; i < splitStr.length; i++) {
          splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
      }
      return splitStr.join(' '); 
   }
   
    subCategoryHandler(subCatArray = subCatArray.filter(val => !removeDuplicates.includes(val)), event.target.checked);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Categories</FormLabel>
        {
          uniqueTopCat.slice(0, 3).map((item, i) => (
            <FormGroup key={item}>
              <FormControlLabel
                sx={{'& span': {color: 'secondary.lightGrey'} }}
                control={
                  <Checkbox onChange={handleChangeTopCat(item)} />
                }
                label={item.toString().replace(/-/g, ' ').replace(/^./, function(x){return x.toUpperCase()})}
              />
            </FormGroup>
          ))
        }
        <Collapse in={expanded} timeout="auto" unmountOnExit>
        {
            uniqueTopCat.slice(3, uniqueTopCat.length).map(item => (
              <FormGroup key={item}>
                <FormControlLabel
                  sx={{'& span': {color: 'secondary.lightGrey'} }}
                  control={
                    <Checkbox onChange={handleChangeTopCat(item)} />
                  }
                  label={item.toString().replace(/-/g, ' ').replace(/^./, function(x){return x.toUpperCase()})}
                />
              </FormGroup>
            ))
          }
        </Collapse>
        {
          categories.length > 3 &&
          <FormHelperText sx={{cursor: 'pointer', '&:hover': {color: 'secondary.main'}}} onClick={handleExpandClick}>{!expanded ? "+ show more" : "- show less"}</FormHelperText>
        }
      </FormControl>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Brand Categories</FormLabel>
        {
          uniqueSubCat.slice(0, 3).map(item => (
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
        <Collapse in={expanded} timeout="auto" unmountOnExit>
        {
          uniqueSubCat.slice(3, uniqueSubCat.length).map(item => (
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
          uniqueSubCat.length > 3 &&
          <FormHelperText sx={{cursor: 'pointer', '&:hover': {color: 'secondary.main'}}} onClick={handleExpandClick}>{!expanded ? "+ show more" : "- show less"}</FormHelperText>
        }
      </FormControl>
    </Box>
  );
}