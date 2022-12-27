import { useContext, useState } from 'react';
import { AppBar, Box, Button, Card, CardActionArea, CardContent, CardMedia, Chip, CircularProgress, Grid, ListItem, Pagination, Paper, Rating, Stack, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Product from '../models/Product';
import BreadcrumbNav from '../src/assets/BreadcrumbNav';
import RangeSlider from '../src/assets/RangeSlider';
import SelectCategory from '../src/assets/SelectSort';
import ToggleButtons from '../src/assets/ToggleButtons';
import Link from '../src/Link';
import theme from '../src/theme';
import db from '../src/utils/db';
import { Store } from '../src/utils/Store';
import CheckboxesBrand from '../src/assets/CheckboxesBrand';
import CheckboxesCategory from '../src/assets/CheckboxesCategory';
import SelectPages from '../src/assets/SelectPages';

let PAGE_SIZE = 40;
const ratings = [1, 2, 3, 4, 5];

export default function Search(props) {
  const router = useRouter();
  const [selected, setSelected] = useState('');

  const handleLoading = (product) => {
    setSelected(product._id);
  };

  const {
    query = '',
    category = '',
    subCategory = '',
    brand = '',
    price = '',
    sort = '',
    page = 1
  } = router.query;

  const { products, countProducts, categories, subCategories, brands, pages, pageSize } = props;

  const filterSearch = ({
    page,
    category,
    subCategory,
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
    if(subCategory) query.subCategory = subCategory;
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

  const [chipData, setChipData] = useState([
    { key: 0, label: [query] },
    { key: 1, label: [category] },
    { key: 2, label: [brand] },
    { key: 3, label: [subCategory] },
    { key: 4, label: [price] }
  ]);

  const handleDelete = (chipToDelete) => {
    console.log(chipToDelete, chipData);
    setChipData(chips => chips.filter((chip) => chip.key !== chipToDelete.key));
    // router.push(`/search?`);
  };

  const categoryHandler = (item) => {
    filterSearch({ category: item })
  }
  const subCategoryHandler = (item) => {
    filterSearch({ subCategory: item })
  }
  const pageHandler = (page) => {
    filterSearch({ page })
  }
  const brandHandler = (item) => {
    filterSearch({ brand: item })
    setChipData((prev) => [...prev, { label: item }]);
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
                  <RangeSlider countProducts={countProducts} />
                </Toolbar>
                <Toolbar>
                  <CheckboxesBrand brands={brands} brandHandler={brandHandler} />
                </Toolbar>
                <Toolbar>
                  <CheckboxesCategory categories={categories} subCategories={subCategories} subCategoryHandler={subCategoryHandler} categoryHandler={categoryHandler} />
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
                  <Typography color="secondary.lightGrey" component="h2" variant="p">Search</Typography>
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
                  <SelectCategory value={sort} sortHandler={sortHandler} />
                </Toolbar>
              </AppBar>
            </Grid>
            {
              products.length === 0 &&
              <Grid item xs={12} sm={4} md={3}>
                <Typography color="secondary.lightGrey" gutterBottom variant="h6" component="h6" align="center">
                  Products not found
                </Typography>
              </Grid>
            }
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap',
                  listStyle: 'none',
                  p: 0.5,
                  m: 0,
                }}
                component="ul"
              >
                {
                  chipData.map((data) => (
                    data.label.map(label => (
                    <ListItem sx={{width: 'auto'}} key={data.key}>
                      <Chip
                        label={label}
                        onDelete={() => handleDelete(data)}
                      />
                    </ListItem>
                    ))
                  ))
                }
              </Paper>
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
           <Grid item xs={12}>
              <AppBar elevation={1} sx={{bgcolor: theme.palette.primary.white}} position="static">
                <Toolbar>
                  <SelectPages pageSize={pageSize} sort={sort} page={page}  />
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
                  {
                    products.length > 0 &&
                    <Stack spacing={2}>
                      <Pagination count={pages} color="primary" showFirstButton showLastButton onChange={(e, value) => pageHandler(value)}  />
                    </Stack>
                  }
                </Toolbar>
              </AppBar>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export async function getServerSideProps({ query }) {
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || '';
  const subCategory = query.subCategory || '';
  const brand = query.brand || '';
  const price = query.price || '';
  const sort = query.sort || '';
  const searchQueary = query.query || '';

  const queryFilter = 
    searchQueary && searchQueary !== ''
    ? {
      title: {
        $regex: searchQueary,
        $options: 'i'
      }
    }
    : {};
  
  const categoryFilter = category && category !== '' ? { category } : {};
  const subCategoryFilter = subCategory && subCategory !== '' ? { subCategory } : {};
  const brandFilter = brand && brand !== '' ? { brand } : {};
  const priceFilter =
    price && price !== ''
    ? {
      price: {
        $fromPrice: Number(price.split('-')[0]),
        $toPrice: Number(price.split('-')[1])
      }
    }
    : {};
  
  const order = 
    sort === 'availability'
    ? { isAvalable: -1 }
    : sort === 'lowest'
    ? { price: 1 }
    : sort === 'highest'
    ? { price: -1 }
    : sort === 'namelowest'
    ? { name: 1 }
    : sort === 'namehighest'
    ? { createdAt: -1 }
    : { _id: -1 };

    await db.connect();
    const categories = await Product.find().distinct('category');
    const subCategories = await Product.find().distinct('subCategory');
    const brands = await Product.find().distinct('brand');
    const productDocs = await Product.find(
      {
        ...queryFilter,
        ...categoryFilter,
        ...subCategoryFilter,
        ...priceFilter,
        ...brandFilter,
      },
    ).sort(order).skip(pageSize * (page - 1)).limit(pageSize).lean();

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...subCategoryFilter,
      ...priceFilter,
      ...brandFilter
    });

    await db.disconnect();
    const products = productDocs.map(db.convertDocToObject);

    return {
      props: {
        pageSize,
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
        categories,
        subCategories,
        brands
      }
    }
}
