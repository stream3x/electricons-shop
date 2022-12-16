import * as React from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import theme from '../theme';

export default function CheckboxesGroup() {
  const [state, setState] = React.useState({
    AMD: true,
    Dell: false,
    Lenovo: false,
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { AMD, Dell, Lenovo } = state;

  return (
    <Box sx={{ display: 'flex' }}>
      <FormControl sx={{ my: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Brands</FormLabel>
        <FormGroup sx={{ width: '100%' }}>
          <FormControlLabel
            sx={{ '& span:last-child': { color: theme.palette.secondary.main } }}
            control={
              <Checkbox checked={AMD} onChange={handleChange} name="AMD" />
            }
            label="AMD"
          />
          <FormControlLabel
            sx={{ '& span:last-child': { color: theme.palette.secondary.main } }}
            control={
              <Checkbox checked={Dell} onChange={handleChange} name="Dell" />
            }
            label="Dell"
          />
          <FormControlLabel
            sx={{ '& span:last-child': { color: theme.palette.secondary.main } }}
            control={
              <Checkbox checked={Lenovo} onChange={handleChange} name="Lenovo" />
            }
            label="Lenovo"
          />
        </FormGroup>
        <FormHelperText>+ show more</FormHelperText>
      </FormControl>
    </Box>
  );
}