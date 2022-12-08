import React, { useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Typography } from '@mui/material';
import Link from '../../src/Link';
import ReplyIcon from '@mui/icons-material/Reply';
import VerticalTabs from '../../src/components/VerticalTabs';
import Rating from '@mui/material/Rating';
import CountQuantity from '../../src/assets/CountQuantity';
import BreadcrumbNav from '../../src/assets/BreadcrumbNav';
import Product from '../../models/Product';
import db from '../../src/utils/db';
import CartIcon from '@mui/icons-material/ShoppingCartOutlined';
import Wishlist from '@mui/icons-material/FavoriteBorderOutlined';
import CompareIcon from '@mui/icons-material/RepeatOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import axios from 'axios';
import { Store } from '../../src/utils/Store';
import LoadingButton from '@mui/lab/LoadingButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import theme from '../../src/theme';
import Category from '../../models/Category';

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const category = await Category.findOne({slug}).lean();
  await db.disconnect();
  return {
    props: {
      category: db.convertDocToObject(category),
    },
  };
}

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.default,
  border: 'thin solid lightGrey',
  borderLeft: '3px solid black',
  marginLeft: '10px',
}));

const AddToCartButton = styled(LoadingButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.palette.addToCartButtonShape.borderRadius,
  margin: '-1px',
  padding: '.5em 2em',
  '&:hover': {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.secondary.main,
  }
}));

const ActionButtons = styled(IconButton)(({ theme }) => ({
  color: theme.palette.secondary.main,
  backgroundColor: theme.palette.badge.bgd,
  marginRight: 10,
  '&:hover': {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
  }
}));

const ShareButtons = styled(IconButton)(({ theme }) => ({
  color: theme.palette.secondary.lightGrey,
  backgroundColor: theme.palette.badge.bgd,
  marginRight: 10,
  '&:hover': {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
  }
}));

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className, arrow: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.primary.main,    
  },
}));

const Item = styled(Paper)(({ theme }) => ({
backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
...theme.typography.body2,
padding: theme.spacing(1),
textAlign: 'center',
color: theme.palette.text.secondary,
}));

export default function CategoryProducts(props) {
  const { category } = props;
  const { state, dispatch } = useContext(Store);
  const { snack, cart: {cartItems} } = state;
  const [loading, setLoading] = useState(false);

  if(!category) {
    return (
      <Box sx={{ flexGrow: 1, my: 4  }}>
        <Typography gutterBottom variant="h6" component="h3" textAlign="center">
          Category not found
        </Typography>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <Item>
              <Link href="/">
                <Button variant="contained" startIcon={<ReplyIcon />}>
                  back to shop
                </Button>
              </Link>
            </Item>
          </Grid>
        </Grid>
      </Box>
    )
  }

  async function addToCartHandler() {
    setLoading(true)
    const { data } = await axios.get(`/api/products/${product._id}`)
    if(data.inStock <= 0) {
      dispatch({ type: 'CART_ADD_ITEM', payload: { ...state.snack, message: 'Sorry Product is out of stock', severity: 'success'}});
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: 1}});
    if(cartItems.find(i => i._id === product._id)) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item already added', severity: 'warning' } });
      setLoading(false);
      return;
    }
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item successfully added', severity: 'success' } });
    setLoading(false);
  }

  return (    
    <Box sx={{ flexGrow: 1, my: 4  }}>
      {/*<BreadcrumbNav categoryData={category} />*/}
     
    </Box>
  );
}