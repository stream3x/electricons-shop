import * as React from 'react';
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
import Zoom from '@mui/material/Zoom';
import axios from 'axios';
import { Store } from '../../src/utils/Store';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import GoogleIcon from '@mui/icons-material/Google';
import TwitterIcon from '@mui/icons-material/Twitter';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StoreIcon from '@mui/icons-material/Store';
import GppGoodIcon from '@mui/icons-material/GppGood';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import TapAndPlayIcon from '@mui/icons-material/TapAndPlay';
import ProductTabs from '../../src/components/ProductTabs';

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({slug}).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObject(product),
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

const AddToCartButton = styled(Button)(({ theme }) => ({
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
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  },
}));

const ShareButtons = styled(IconButton)(({ theme }) => ({
  color: theme.palette.secondary.lightGrey,
  backgroundColor: theme.palette.badge.bgd,
  marginRight: 10,
  '&:hover': {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  },
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

export default function SingleProduct(props) {
  const { product } = props;
  const { state, dispatch } = React.useContext(Store);
  const { cart: {cartItems} } = state;

  if(!product) {
    return (
      <Box sx={{ flexGrow: 1, my: 4  }}>
        <Typography gutterBottom variant="h6" component="h3" textAlign="center">
          Product not found
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

  async function addToCardHandler() {
    const { data } = await axios.get(`/api/products/${product._id}`)
    if(data.inStock <= 0) {
      console.log('Sorry Product is out of stock')
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: 1 }});
  }

  return (    
    <Box sx={{ flexGrow: 1, my: 4  }}>
      <BreadcrumbNav productData={product} />
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <Item>
            <VerticalTabs productData={product} />
          </Item>
        </Grid>
        <Grid xs={12} md={6}>
          <Item>
            <Box sx={{ flexGrow: 0, my: 1, display: 'flex'  }}>
              <Typography gutterBottom variant="h6" component="h1" align="left" color="secondary" sx={{flex: 1}}>
                {product.title}
              </Typography>
              <Box
                component="img"
                sx={{
                  height: 50,
                  display: 'block',
                  maxWidth: 400,
                  overflow: 'hidden',
                  width: 'auto',
                  margin: 'auto'
                }}
                src={product.brandImg}
                alt={product.title}
              />
            </Box>
            <Box sx={{ flexGrow: 1, my: 1, display: 'flex', alignItems: 'center'  }}>
              <Rating align="center" size="small" name="read-only" value={product.rating} readOnly precision={0.5} />
              <Link href="#reviews">
                <Typography align="center" gutterBottom variant="p" component="span" color="secondary" sx={{marginLeft: 1}}>
                  Reviews ({product.reviews})
                </Typography>
              </Link>
            </Box>
          </Item>
          <Item>
            <Typography align="left" component="h3" variant="h5" color="primary">
              {product.price}
              <Typography align="right" component="span" variant="body2" color="secondary.lightGrey" sx={{marginLeft: 1}}>
                <del>{product.oldPrice && product.oldPrice}</del>
              </Typography>
            </Typography>
          </Item>
          <Item>
            <Typography align="left" component="p" variant="p" color="secondary.lightGray">
              {product.description}
            </Typography>
          </Item>
          <Item>
            <Box sx={{ flexGrow: 1, my: 1, display: 'flex', alignItems: 'center'  }}>
                <Typography gutterBottom variant="p" component="span" align="left" color="secondary" sx={{marginLeft: 1}}>
                  Avalability: 
                </Typography>
                <LabelButton startIcon={<TapAndPlayIcon />}>
                  online shoping
                </LabelButton>
                <LabelButton startIcon={<StoreIcon />}>
                  store shoping
                </LabelButton>
            </Box>  
          </Item>
          {
            cartItems.length !== 0 && cartItems.find(item => item._id === product._id) &&
            <Item>
              <Box sx={{ flexGrow: 1, my: 1, display: 'flex', alignItems: 'center'  }}>
                <Typography gutterBottom variant="p" component="span" align="left" color="secondary" sx={{marginLeft: 1}}>
                Quantity :
                </Typography>
                {
                  cartItems.map(item => item._id === product._id && (
                    <CountQuantity maxItem={item.inStock} quantityItem={item.quantity} item={item}/>
                  ))
                }
              </Box>  
            </Item>
          }
          <Item>
            <Box sx={{ flex: 1, my: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap'  }}>
              <Box sx={{ flex: {xs: '0 0 100%', lg: '0 0 35%'}, my: 1, display: 'flex', alignItems: 'center' }}>
              {
                product.inStock !== 0 ? 
                <AddToCartButton onClick={addToCardHandler} variant="variant" startIcon={<CartIcon />}>
                  Add To Cart
                </AddToCartButton>
                :
                <AddToCartButton sx={{cursor: 'no-drop'}} variant="variant" startIcon={<RemoveShoppingCartIcon />}>
                  no Stock
                </AddToCartButton>
              }
              </Box>
              <Box sx={{ flex: {xs: '0 0 100%', lg: '0 0 65%'}, my: 1, display: 'flex', alignItems: 'center' }}>
                <LightTooltip arrow title="add to wishlist" placement="top" TransitionComponent={Zoom}>
                  <ActionButtons color="secondary" aria-label="add-to-wishlist" size="small">
                    <Wishlist fontSize="inherit" />
                  </ActionButtons>
                </LightTooltip>
                <Typography gutterBottom variant="p" component="span" align="left" color="secondary.lightGray" sx={{marginRight: 1}}>
                  Add to wishlist
                </Typography>
                <LightTooltip arrow title="add to comparasion" placement="top" TransitionComponent={Zoom}>
                  <ActionButtons aria-label="add-to-compare" size="small">
                    <CompareIcon fontSize="inherit" />
                  </ActionButtons>
                </LightTooltip>
                <Typography gutterBottom variant="p" component="span" align="left" color="secondary.lightGray" sx={{marginRight: 1}}>
                  Add to comparasion
                </Typography>
              </Box>
            </Box>
          </Item>
          <Item>
            <Box sx={{ flexGrow: 1, my: 1, display: 'flex', alignItems: 'center'  }}>
              <Typography gutterBottom variant="p" component="span" align="left" color="secondary.lightGray" sx={{marginRight: 1}}>
                Share on:
              </Typography>
              <LightTooltip arrow title="add to wishlist" placement="top" TransitionComponent={Zoom}>
                <ShareButtons aria-label="add-to-wishlist" size="medium">
                  <FacebookRoundedIcon fontSize="inherit" />
                </ShareButtons>
              </LightTooltip>
              <LightTooltip arrow title="add to comparasion" placement="top" TransitionComponent={Zoom}>
                <ShareButtons aria-label="add-to-compare" size="medium">
                  <GoogleIcon fontSize="inherit" />
                </ShareButtons>
              </LightTooltip>
              <LightTooltip arrow title="add to comparasion" placement="top" TransitionComponent={Zoom}>
                <ShareButtons aria-label="add-to-compare" size="medium">
                  <TwitterIcon fontSize="inherit" />
                </ShareButtons>
              </LightTooltip>
            </Box>
          </Item>
          <Item>
            <Box sx={{ flexGrow: 1, my: 1, display: 'flex', alignItems: 'center'  }}>
                <LabelButton startIcon={<LocalShippingIcon />}>
                  Delivery policy
                </LabelButton>
                <LabelButton startIcon={<GppGoodIcon />}>
                  Security Policy
                </LabelButton>
                <LabelButton startIcon={<CreditCardIcon />}>
                  Security Payment
                </LabelButton>
            </Box>  
          </Item>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <ProductTabs product={product} />
        </Grid>
      </Grid>
    </Box>
  );
}