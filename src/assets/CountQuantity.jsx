import * as React from 'react';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import axios from 'axios';
import { Store } from '../utils/Store';

export default function CountQuantity({size, maxItem, quantityItem, item}) {
  const { state, dispatch } = React.useContext(Store);
  const [count, setCount] = React.useState(quantityItem);
  const min = 1;
  const max = maxItem;

  const handleChange = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`)
    if(data.inStock <= 0) {
      console.log('Sorry Product is out of stock')
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity }});
    const value = Math.max(min, Math.min(max, Number(quantity)));
    setCount(value)
  };

  console.log(item.quantity)

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
      <Box>
        <FormControl sx={{ width: '7ch', ml: 2 }}>
          <OutlinedInput sx={{height: size ? '1.75em' : '2em'}} value={quantityItem} onChange={(e) => handleChange(item, e.target.value)}/>
        </FormControl>
        <ButtonGroup>
          <Button
          size={size}
            aria-label="reduce"
            onClick={() => {
              setCount(Math.max(count - 1, 1))
            }}
          >
            <RemoveIcon fontSize="small" />
          </Button>
          <Button
            size={size}
            aria-label="increase"
            onClick={() => {
              setCount(Math.min(count + 1, max))
            }}
          >
            <AddIcon fontSize="small" />
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
}
