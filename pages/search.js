import { useContext, useState } from 'react';
import { AppBar, Box, Card, CardActionArea, CardContent, CardMedia, CircularProgress, Grid, Rating, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Product from '../models/Product';
import BreadcrumbNav from '../src/assets/BreadcrumbNav';
import CheckboxesGroup from '../src/assets/CheckboxesGroup';
import RangeSlider from '../src/assets/RangeSlider';
import SelectCategory from '../src/assets/SelectCategory';
import ToggleButtons from '../src/assets/ToggleButtons';
import Link from '../src/Link';
import theme from '../src/theme';
import db from '../src/utils/db';
import { Store } from '../src/utils/Store';

export async function getServerSideProps(context) {
  const { params } = context;
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();

  function replacer(key, value) {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from([...value]),
      };
    } else {
      return value;
    }
  }

  function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  function convertToJson() {
    if(products) {
      const org_value = JSON.stringify(products, replacer);
      const newValue = JSON.parse(org_value, reviver);
      return newValue;
    }else {
      const org_value = JSON.stringify(subCategoryProducts, replacer);
      const newValue = JSON.parse(org_value, reviver);
      return newValue;
    }
  }

  return {
    props: {
      products: convertToJson()
    },
  };
}

export default function Search(props) {
  const router = useRouter();
  const { ...slug } = router;
  // const titlePage = slug.query.slug.toString().replace(/-/g, ' ').replace(/^./, function(x){return x.toUpperCase()});
  const [selected, setSelected] = useState('');

  const handleLoading = (product) => {
    setSelected(product._id);
  };

  const {
    query = '',
    category = '',
    brand = '',
    price = '',
    sort = '',
    page = 1
  } = router.query;

  const { products, countProducts, categories, brands, pages } = props;

  const filterSearch = ({
    page,
    category,
    brand,
    sort,
    min,
    max,
    searchQueary,
    price
  }) => {
    const { query } = router;
    if(page) query.page = page;
    if(searchQueary) query.searchQueary = searchQueary;
    if(category) query.category = category;
    if(brand) query.brand = brand;
    if(sort) query.sort = sort;
    if(price) query.price = price;
    if(min) query.min ? query.min : query.min === 0 ? 0 : min;
    if(max) query.max ? query.max : query.max === 0 ? 0 : max;

    router.push({
      pathname: router.pathname,
      query: query
    })
  }

  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value })
  }
  const pageHandler = (e) => {
    filterSearch({ page })
  }
  const brandHandler = (e) => {
    filterSearch({ brand: e.target.value })
  }
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value })
  }
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value })
  }

  const { state, dispatch } = useContext(Store);

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find(item => item._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if(data.inStock < quantity) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'product is out of stock', severity: 'warning' } });
      return
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: 1}});
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item successfully added', severity: 'success' } });
  }

  return (
    <Box sx={{ flexGrow: 1, my: 4  }}>
      <BreadcrumbNav />
      <Grid container spacing={2}>
        <Grid item sx={{display: {xs: 'none', lg: 'block'}}} lg={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppBar elevation={1} sx={{bgcolor: theme.palette.primary.white}} position="static">
                <Toolbar>
                  <Typography sx={{width: '100%', m: 0}} color="secondary" gutterBottom variant="h6" component="h2" textAlign="center">
                    Filters
                  </Typography>
                </Toolbar>
                <Toolbar>
                  <RangeSlider />
                </Toolbar>
                <Toolbar>
                  
                </Toolbar>
              </AppBar>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={9}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppBar elevation={1} sx={{bgcolor: theme.palette.primary.white}} position="static">
                <Toolbar>
                  <Typography color="secondary.lightGrey" component="h2" variant="p">Category</Typography>
                  {
                    products.length === 0 ?
                    <Typography sx={{ m: 0, ml: 2, flexGrow: 1, fontSize: {xs: '12px', sm: '16px'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    "No products"
                    </Typography>
                    :
                    <Typography sx={{ m: 0, ml: 2, fontSize: {xs: '12px', sm: '16px'}, flexGrow: 1 }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    There are {products.length} {products.length === 1 ? "product" : "products"}.
                  </Typography>
                  }
                  <ToggleButtons />
                  <SelectCategory />
                </Toolbar>
              </AppBar>
            </Grid>
            {
              products.map(prod => (

                <Grid key={prod._id} item xs={12} sm={4} md={3}>
                    <Card sx={{ width: "100%", height: "100%" }}>
                        <CardActionArea sx={{position: 'relative'}}>
                          <Link href={`/product/${prod.slug}`} onClick={() => handleLoading(prod)}>
                          {
                            prod._id === selected &&
                            <CircularProgress sx={{position: 'absolute', left: '45%', top: '20%', zIndex: 1, transform: 'translateX(-50%)'}} size={50} />
                          }
                            <CardMedia sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center','& img': {objectFit: 'contain', width: 'unset!important', height: '168px!important', position: 'relative!important', p: 2} }} component="div">
                              <Image
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority
                                src={prod.images[0].image}
                                alt={prod.title}
                                quality={35}
                              />
                            </CardMedia>
                          </Link>
                          <CardContent>
                            {
                              prod.inStock > 0 ? 
                              ( <Typography color="primary" gutterBottom variant="caption" component="p" align="center">
                              in Stock
                              </Typography>) :
                              ( <Typography color="secondary" gutterBottom variant="caption" component="p" align="center">
                              out of Stock
                              </Typography>)
                            }
                            <Typography gutterBottom variant="h6" component="h3" align="center">
                            {prod.title}
                            </Typography>
                            <Typography align="center" variant="body2" color="text.secondary">
                              {prod.shortDescription}
                            </Typography>
                            <Box
                              sx={{
                                textAlign: 'center',
                                my: 1,
                              }}
                              >
                              <Rating size="small" name="read-only" value={prod.rating} readOnly precision={0.5} />
                            </Box>
                            <Typography align="center" component="h3" variant="h6" color="secondary">
                              {prod.price}
                              <Typography align="right" component="span" variant="body2" color="secondary.lightGrey" sx={{marginLeft: 1}}>
                                <del>
                                {prod.oldPrice && prod.oldPrice}
                                </del>
                              </Typography>
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
              ))
            }
           
          </Grid>
         
        </Grid>
      </Grid>
    </Box>
  )
}

