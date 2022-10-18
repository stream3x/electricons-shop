import * as React from 'react';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

export default function CountQuantity() {
  const [count, setCount] = React.useState(1);
  const min = 1;
  const max = 100;
  const handleChange = (event) => {
    const value = Math.max(min, Math.min(max, Number(event.target.value)));
    setCount(value);
  };

  return (
    <Box
      sx={{
        color: 'action.active',
        display: 'flex',
        flexDirection: 'column',
        '& > *': {
          marginBottom: 0,
        },
        '& .MuiBadge-root': {
          marginRight: 5,
        },
      }}
    >
      <div>
        <FormControl sx={{ width: '7ch', ml: 2 }}>
          <OutlinedInput sx={{height: '2em', borderColor: 'secondary.lightGray'}} value={count} onChange={handleChange}/>
        </FormControl>
        <ButtonGroup>
          <Button
            aria-label="reduce"
            onClick={() => {
              setCount(Math.max(count - 1, 1));
            }}
          >
            <RemoveIcon fontSize="small" />
          </Button>
          <Button
            aria-label="increase"
            onClick={() => {
              setCount(count + 1);
            }}
          >
            <AddIcon fontSize="small" />
          </Button>
        </ButtonGroup>
      </div>
    </Box>
  );
}
