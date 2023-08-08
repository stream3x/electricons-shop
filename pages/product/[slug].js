import React, { useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { Accordion, AccordionDetails, AccordionSummary, Button, Divider, Typography } from '@mui/material';
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
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StoreIcon from '@mui/icons-material/Store';
import GppGoodIcon from '@mui/icons-material/GppGood';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import TapAndPlayIcon from '@mui/icons-material/TapAndPlay';
import ProductTabs from '../../src/components/ProductTabs';
import LoadingButton from '@mui/lab/LoadingButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/router';
import theme from '../../src/theme';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import Pusher from 'pusher-js';
import ProductReviewForm from '../../src/components/ProductReviewForm';

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({slug}).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObject(product)
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

export default function SingleProduct(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const { cart: {cartItems}, comparation } = state;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { slug } = router.query;
  const [ratings, setRatings] = React.useState([]);
  const [numReviews, setNumReviews] = useState([]);
  const [sumReviews, setSumReviews] = useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [productWithStoreInfo, setProductWithStoreInfo] = React.useState([]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  React.useEffect(() => {
    // Always do navigations after the first render
    router.push(`/product/${product.slug}?counter=10`, undefined, { shallow: true })
  }, []);

  React.useEffect(() => {
    fetchStoreInfo();
  }, []);

  async function fetchStoreInfo() {
    try {
      const { data } = await axios.get('/api/store_info');

      if (product) {
        const updatedStores = product.stores.map((store) => {
          const foundStore = data.find((info) => info.name === store.store);
          return foundStore;
        });

        const updatedProductWithStoreInfo = {
          ...product,
          stores: updatedStores
        };

        setProductWithStoreInfo(updatedProductWithStoreInfo.stores);
      } else {
        console.log('Proizvod nije pronađen.');
      }
    } catch (error) {
      console.error(error);
    }
  }

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

  async function addToCartHandler() {
    setLoading(true)
    const { data } = await axios.get(`/api/products/${product._id}`)
    if(data.inStock <= 0) {
      dispatch({ type: 'CART_ADD_ITEM', payload: { ...state.snack, message: 'Sorry Product is out of stock', severity: 'success'}});
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: 1 } });
    if(cartItems.find(i => i._id === product._id)) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item already added', severity: 'warning' } });
      setLoading(false);
      return;
    }
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item successfully added', severity: 'success' } });
    setLoading(false);
  }

  async function addToComparasion() {
    const { data } = await axios.get(`/api/products/${product._id}`);
    dispatch({ type: 'COMPARE_ADD_ITEM', payload: { ...product, data }});
    if(comparation && comparation.compareItems.find(i => i._id === data._id)) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item already added', severity: 'warning' } });
      setLoading(false);
      return;
    }
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item successfully added', severity: 'success' } });
  }

  async function addToWishlist() {
    const { data } = await axios.get(`/api/products/${product._id}`);
    dispatch({ type: 'WISHLIST_ADD_ITEM', payload: { ...product, data }});
    if(state.wishlist && state.wishlist.wishItems.find(i => i._id === data._id)) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item already added', severity: 'warning' } });
      setLoading(false);
      return;
    }
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item successfully added', severity: 'success' } });
  }

  return (    
    <Box sx={{ flexGrow: 1, my: 4  }}>
      <BreadcrumbNav productData={product} />
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <Item elevation={0}>
            <VerticalTabs productData={product} />
          </Item>
        </Grid>
        <Grid xs={12} md={6}>
          <Item elevation={0}>
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
                src={product.brandImg ? product.brandImg : '/images/no-image.jpg'}
                alt={product.title}
              />
            </Box>
            <Box sx={{ flexGrow: 1, my: 1, display: 'flex', alignItems: 'center', '& a': {textDecoration: 'none' }, '&:hover a': {textDecoration: 'none' }  }}>
              <Rating align="center" size="small" name="read-only" value={sumReviews/numReviews} readOnly precision={0.5} />
              <Link noLinkStyle href="#reviews">
                <Typography align="center" gutterBottom variant="p" component="span" color="secondary" sx={{marginLeft: 1}}>
                  Reviews ({ratings.length !== 0 ? numReviews : 0})
                </Typography>
              </Link>
            </Box>
          </Item>
          <Item elevation={0}>
            <Typography sx={{fontWeight: 'bolder'}} align="left" component="h3" variant="h4" color="primary">
            {'$'}{product.price}
              <Typography align="right" component="span" variant="body2" color="secondary.lightGrey" sx={{marginLeft: 1}}>
                <del>{'$'}{product.oldPrice && product.oldPrice}</del>
              </Typography>
            </Typography>
          </Item>
          <Item elevation={0}>
            <Typography align="left" component="p" variant="p" color="secondary.lightGray">
              {product.description}
            </Typography>
          </Item>
          <Item elevation={0}>
            <Box sx={{ flexGrow: 1, my: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap'  }}>
                <Typography gutterBottom variant="p" component="span" align="left" color="secondary" sx={{marginLeft: 1, width: {xs: '100%', sm: 'auto'}}}>
                  Avalability: 
                </Typography>
                <LabelButton sx={{width: { xs: '100%', sm: 'auto'}, my: .5}} startIcon={<TapAndPlayIcon />}>
                  online shopping
                </LabelButton>
                <LabelButton href='#available-store' sx={{width: { xs: '100%', sm: 'auto'}, my: .5}} startIcon={<StoreIcon />}>
                  store shopping
                </LabelButton>
            </Box>  
          </Item>
          {
            cartItems.length !== 0 && cartItems.find(item => item._id === product._id) &&
            <Item elevation={0}>
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
          <Item elevation={0}>
            <Box sx={{ flex: 1, my: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: {xs: 'center', sm: 'normal'} }}>
              <Box sx={{ flex: {xs: '0 0 100%', lg: '0 0 35%'}, my: 1, mb: 2, display: 'flex', alignItems: 'center', '& > a': {textDecoration: 'none', width: {xs:'100%', sm: 'auto'}} }}>
              {
                product.inStock !== 0 ? (cartItems.find(item => item._id === product._id) ? 
                  <Link noLinkStyle href="/cart" passHref>
                    <AddToCartButton loading={loading} loadingPosition="start" sx={{width: {xs: '100%', sm: 'auto'}}} variant="contained" startIcon={<VisibilityIcon />}>
                      View Cart
                    </AddToCartButton>
                  </Link>
                : 
                  <AddToCartButton loading={loading} loadingPosition="start" sx={{width: {xs: '100%', sm: 'auto'}}} variant="contained" onClick={addToCartHandler} startIcon={<CartIcon />}>
                    Add To Cart
                  </AddToCartButton>
                )
                :
                <AddToCartButton sx={{width: {xs: '100%', sm: 'auto'}}} startIcon={<RemoveShoppingCartIcon />}>
                  no Stock
                </AddToCartButton>
              }
              </Box>
              <Box sx={{ flex: {xs: '0 0 100%', lg: '0 0 65%'}, my: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <Box sx={{display: 'flex', justifyContent: 'left', width: {xs: '100%', sm: 'auto'}, mb: {xs: 2, sm: 0}}}>
                  <LightTooltip arrow title="add to wishlist" placement="top" TransitionComponent={Zoom}>
                    <ActionButtons onClick={addToWishlist} color="secondary" aria-label="add-to-wishlist" size="small">
                      <Wishlist fontSize="inherit" />
                    </ActionButtons>
                  </LightTooltip>
                  <Typography gutterBottom variant="p" component="span" align="left" color="secondary.lightGray" sx={{marginRight: 1}}>
                    Add to wishlist
                  </Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'left',width: {xs: '100%', sm: 'auto'}}}>
                  <LightTooltip arrow title="add to comparasion" placement="top" TransitionComponent={Zoom}>
                    <ActionButtons onClick={addToComparasion} aria-label="add-to-compare" size="small">
                      <CompareIcon fontSize="inherit" />
                    </ActionButtons>
                  </LightTooltip>
                  <Typography gutterBottom variant="p" component="span" align="left" color="secondary.lightGray" sx={{marginRight: 1}}>
                    Add to comparasion
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Item>
          <Item elevation={0}>
            <Box sx={{ flexGrow: 1, my: 1, display: 'flex', alignItems: 'center'  }}>
              <Typography gutterBottom variant="p" component="span" align="left" color="secondary.lightGray" sx={{marginRight: 1}}>
                Share on:
              </Typography>
              <LightTooltip arrow title="Share to Facebook" placement="top" TransitionComponent={Zoom}>
                <ShareButtons aria-label="Share to Facebook" size="medium">
                  <FacebookRoundedIcon fontSize="inherit" />
                </ShareButtons>
              </LightTooltip>
              <LightTooltip arrow title="Share to LinkedIn" placement="top" TransitionComponent={Zoom}>
                <ShareButtons aria-label="Share to LinkedIn" size="medium">
                  <LinkedInIcon fontSize="inherit" />
                </ShareButtons>
              </LightTooltip>
              <LightTooltip arrow title="Share to Twitter" placement="top" TransitionComponent={Zoom}>
                <ShareButtons aria-label="Share to Twitter" size="medium">
                  <TwitterIcon fontSize="inherit" />
                </ShareButtons>
              </LightTooltip>
            </Box>
          </Item>
          <Item elevation={0}>
            <Box sx={{ flexGrow: 1, my: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <LabelButton sx={{width: { xs: '100%', sm: 'auto'}, my: .5}} startIcon={<LocalShippingIcon />}>
                Delivery policy
              </LabelButton>
              <LabelButton sx={{width: { xs: '100%', sm: 'auto'}, my: .5}} startIcon={<GppGoodIcon />}>
                Security Policy
              </LabelButton>
              <LabelButton sx={{width: { xs: '100%', sm: 'auto'}, my: .5}} startIcon={<CreditCardIcon />}>
                Security Payment
              </LabelButton>
            </Box>  
          </Item>
        </Grid>
        <Grid id="reviews" item xs={12}>
          <ProductTabs product={product} setRatings={setRatings} setNumReviews={setNumReviews} setSumReviews={setSumReviews} slug={slug} />
        </Grid>
        <Grid id="available-store" item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Item elevation={0} sx={{bgcolor: theme.palette.badge.bgdLight}}>
                <Typography gutterBottom variant="h5" component="h2" align="left" color="secondary" sx={{flex: 1, m: 0}}>
                  Available in stores
                </Typography>
              </Item>
            </Grid>
            {
              productWithStoreInfo.map(store => (
                <Grid key={store._id} item xs={12} md={4}>
                  <Item elevation={1}>
                    <Typography gutterBottom variant="h6" component="h3" align="left" color="secondary" sx={{flex: 1}}>
                      {store && store.name}
                    </Typography>
                    <Typography gutterBottom variant="p" component="p" align="left" color="secondary" sx={{flex: 1}}>
                      {store.address}
                    </Typography>
                    <Typography gutterBottom variant="p" component="p" align="left" color="secondary" sx={{flex: 1}}>
                      {store.city}
                    </Typography>
                    <Typography gutterBottom variant="p" component="p" align="left" color="secondary" sx={{flex: 1}}>
                      {store.country}
                    </Typography>
                    <Typography gutterBottom variant="p" component="p" align="left" color="secondary" sx={{flex: 1}}>
                      {store.phone}
                    </Typography>
                    <Typography gutterBottom variant="p" component="p" align="left" color="secondary" sx={{flex: 1}}>
                      {store.phone_two}
                    </Typography>
                    <Typography gutterBottom variant="p" component="p" align="left" color="secondary" sx={{flex: 1}}>
                      {store.email}
                    </Typography>
                    <Box key={store._id} sx={{width: '100%', display: 'flex'}}>
                      <Accordion elevation={0} sx={{width: '100%'}} expanded={expanded === `panel${store._id}`} onChange={handleChange(`panel${store._id}`)}>
                        <AccordionSummary
                          aria-controls="panel1bh-content"
                          id={store._id}
                          sx={{display: 'flex', justifyContent: 'left', p: 0}}
                        >
                          <Button
                            variant='outlined'
                            disableElevation
                            sx={{
                              borderTopLeftRadius: '0',
                              borderTopRightRadius: '0',
                              '&:hover': {backgroundColor: theme.palette.secondary.main}
                            }}
                          >
                            <FmdGoodIcon />
                            see map
                          </Button>
                        </AccordionSummary>
                        <AccordionDetails sx={{p: 0}}>
                            <Box
                              component="iframe"
                              width="100%"
                              height="150px"
                              src={store.map}
                            >
                            </Box>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  </Item>
                </Grid>
              ))
            }
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}