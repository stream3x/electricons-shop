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
import category_data from '../utils/category';

export default function CheckboxesBrand() {
  const [expanded, setExpanded] = React.useState(false);
  const { categories } = category_data;
  // const defaultState = products.filter(product => product.categoryUrl === slug.query.slug.toString());
  const topCategoryState = categories.map(item => item.categoryName);
  const uniqueTopCat = [...new Set(topCategoryState)]
  const createTopCatBooleans = Array(uniqueTopCat.length).fill(false);

  const resultTopCat = [createTopCatBooleans].map(row =>
    row.reduce((acc, cur, i) =>
      (acc[uniqueTopCat[i]] = cur, acc), {}))

  const [topCat, setTopCat] = React.useState(resultTopCat);

  const handleChangeTopCat = (event) => {
    setTopCat({
      ...topCat,
      [event.target.name]: event.target.checked,
    });
  };

  const subCategoryState = categories.map(item => item.subCategory.map(sub => sub.subCategoryName));
  const uniqueSubCatO = [...new Set(subCategoryState[0])]
  const createSubCatOBooleans = Array(uniqueSubCatO.length).fill(false);

  const resultSubCatO = [createSubCatOBooleans].map(row =>
    row.reduce((acc, cur, i) =>
      (acc[uniqueSubCatO[i]] = cur, acc), {}))

  const [subCatO, setSubCatO] = React.useState(resultSubCatO);

  const handleChangeSubCat = (event) => {
    setSubCatO({
      ...subCatO,
      [event.target.name]: event.target.checked,
    });
  };

  const uniqueSubCat1 = [...new Set(subCategoryState[1])]
  const createSubCat1Booleans = Array(uniqueSubCat1.length).fill(false);

  const resultSubCat1 = [createSubCat1Booleans].map(row =>
    row.reduce((acc, cur, i) =>
      (acc[uniqueSubCat1[i]] = cur, acc), {}))

  const [subCat1, setSubCat1] = React.useState(resultSubCat1);

  const handleChangeSubCat1 = (event) => {
    setSubCat1({
      ...subCat1,
      [event.target.name]: event.target.checked,
    });
  };

  const uniqueSubCat2 = [...new Set(subCategoryState[2])]
  const createSubCat2Booleans = Array(uniqueSubCat2.length).fill(false);

  const resultSubCat2 = [createSubCat2Booleans].map(row =>
    row.reduce((acc, cur, i) =>
      (acc[uniqueSubCat2[i]] = cur, acc), {}))

  const [subCat2, setSubCat2] = React.useState(resultSubCat2);

  const handleChangeSubCat2 = (event) => {
    setSubCat2({
      ...subCat2,
      [event.target.name]: event.target.checked,
    });
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Top Category</FormLabel>
        {
          uniqueTopCat.slice(0, 3).map(item => (
            <FormGroup key={item}>
              <FormControlLabel
                sx={{'& span': {color: 'secondary.lightGrey'} }}
                control={
                  <Checkbox checked={resultTopCat.item} onChange={handleChangeTopCat} name={item} />
                }
                label={item}
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
                    <Checkbox checked={resultTopCat.item} onChange={handleChangeTopCat} name={item} />
                  }
                  label={item}
                />
              </FormGroup>
            ))
          }
        </Collapse>
        {
          uniqueTopCat.length > 3 &&
          <FormHelperText sx={{cursor: 'pointer', '&:hover': {color: 'secondary.main'}}} onClick={handleExpandClick}>{!expanded ? "+ show more" : "- show less"}</FormHelperText>
        }
      </FormControl>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Category</FormLabel>
        {
          uniqueSubCatO.slice(0, 1).map(item => (
            <FormGroup key={item}>
              <FormControlLabel
                sx={{'& span': {color: 'secondary.lightGrey'} }}
                control={
                  <Checkbox checked={resultSubCatO.item} onChange={handleChangeSubCat} name={item} />
                }
                label={item}
              />
            </FormGroup>
          ))
        }
        <Collapse in={expanded} timeout="auto" unmountOnExit>
        {
          uniqueSubCatO.slice(1, uniqueSubCatO.length).map(item => (
            <FormGroup key={item}>
              <FormControlLabel
                sx={{'& span': {color: 'secondary.lightGrey'} }}
                control={
                  <Checkbox checked={resultSubCatO.item} onChange={handleChangeSubCat1} name={item} />
                }
                label={item}
              />
            </FormGroup>
          ))
        }
        </Collapse>
        {
          uniqueSubCat1.slice(0, 1).map(item => (
            <FormGroup key={item}>
              <FormControlLabel
                sx={{'& span': {color: 'secondary.lightGrey'} }}
                control={
                  <Checkbox checked={resultSubCat1.item} onChange={handleChangeSubCat2} name={item} />
                }
                label={item}
              />
            </FormGroup>
          ))
        }
        <Collapse in={expanded} timeout="auto" unmountOnExit>
        {
            uniqueSubCat1.slice(1, uniqueSubCat1.length).map(item => (
              <FormGroup key={item}>
                <FormControlLabel
                  sx={{'& span': {color: 'secondary.lightGrey'} }}
                  control={
                    <Checkbox checked={resultSubCat1.item} onChange={handleChangeSubCat2} name={item} />
                  }
                  label={item}
                />
              </FormGroup>
            ))
          }
        </Collapse>
        {
          uniqueSubCat2.slice(0, 1).map(item => (
            <FormGroup key={item}>
              <FormControlLabel
                sx={{'& span': {color: 'secondary.lightGrey'} }}
                control={
                  <Checkbox checked={resultSubCat2.item} onChange={handleChangeSubCat2} name={item} />
                }
                label={item}
              />
            </FormGroup>
          ))
        }
        <Collapse in={expanded} timeout="auto" unmountOnExit>
        {
            uniqueSubCat2.slice(1, uniqueSubCat2.length).map(item => (
              <FormGroup key={item}>
                <FormControlLabel
                  sx={{'& span': {color: 'secondary.lightGrey'} }}
                  control={
                    <Checkbox checked={resultSubCat2.item} onChange={handleChangeSubCat2} name={item} />
                  }
                  label={item}
                />
              </FormGroup>
            ))
          }
        </Collapse>
        {
          uniqueSubCatO.length + uniqueSubCat1.length + uniqueSubCat2.length > 3 &&
          <FormHelperText sx={{cursor: 'pointer', '&:hover': {color: 'secondary.main'}}} onClick={handleExpandClick}>{!expanded ? "+ show more" : "- show less"}</FormHelperText>
        }
      </FormControl>      
    </Box>
  );
}