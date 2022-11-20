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
  const min = 1;
  const max = maxItem;

  const handleChange = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`)
    if(data.inStock <= 0) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'product is out of stock', severity: 'warning' } });
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity: quantity < 1 ? Math.max(quantity, min) : Math.min(quantity, max) }});
    
  };

  async function incrementItem(item) {
    const { data } = await axios.get(`/api/products/${item._id}`)
    if(data.inStock <= 0) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'product is out of stock', severity: 'warning' } });
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity: Math.min(item.quantity + 1, max) }});
  }

  async function decrementItem(item) {
    const { data } = await axios.get(`/api/products/${item._id}`)
    if(data.inStock <= 0) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'product is out of stock', severity: 'warning' } });
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity: Math.max(item.quantity - 1, 1) }});
  }

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
              decrementItem(item)
            }}
          >
            <RemoveIcon fontSize="small" />
          </Button>
          <Button
            size={size}
            aria-label="increase"
            onClick={() => {
              incrementItem(item)
            }}
          >
            <AddIcon fontSize="small" />
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
}
