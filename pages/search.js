import React, { useContext, useEffect, useState } from 'react';
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
import SwipeableFilterDrawer from '../src/components/SwipeableFilterDrawer';
import ActionCardButtons from '../src/assets/ActionCardButtons';

let PAGE_SIZE = 40;
const ratings = [1, 2, 3, 4, 5];

export default function Search(props) {
  const router = useRouter();
  const [selected, setSelected] = useState('');
  const { state, dispatch } = useContext(Store);

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
    });
  };

  const initialState = [
    { key: 'query', label: [...query] },
    { key: 'category', label: [...category] },
    { key: 'brand', label: [...brand] },
    { key: 'subCategory', label: [...subCategory] },
    { key: 'price', label: [price] }
  ];

  const [chipData, setChipData] = useState(initialState);
  const [view, setView] = React.useState('module');

  const handleChangeView = (event, nextView) => {
    setView(nextView);
  };

  // function onCheck(e) {
  //   let tags = [...uncheckState.tags];
  //   tags = tags.filter(tag => tag !== e.target.value);
  //   e.target.checked && tags.push(e.target.value);
  //   setUncheckState({ tags });
  // }
  
  const objToArray = obj => {
    setChipData(current => [...current, obj]);
  };
  
  const handleDelete = (chipToDelete, index, i) => {
    const filterLabel = chipToDelete.label.filter(e => e !== index);
    const removeQuery = `${router.asPath}`.replace(`query=${query.replace(/ /g, '+')}`, '');
    if(chipToDelete.key === 'query') {
      if(chipToDelete.label.length !== 0) {
        router.push(removeQuery);
        setChipData((prev) => (
          prev.map(obj => {
            if(obj.key === 'query') {
              return { ...obj, label: filterLabel };
            }
            return obj;
          })
        ));
      }else {
        setChipData((prev) => (
          prev.filter(obj => {
            return obj.key !== 'query';
          })
        ));
        objToArray({
          key: 'query',
          label: []
        });
      }
    }
    if(chipToDelete.key === 'brand') {
      setChipData((prev) => (
        prev.map(obj => {
          const filterLabel = obj.label.filter(e => e !== index);
          if(obj.key === 'brand') {
            filterSearch({ brand: filterLabel });
            return { ...obj, label: filterLabel };
          }          
          return obj;
        })
      ));
      dispatch({ type: 'CHIPS', payload: { ...state.chips, chips: index}});
    }
    if(chipToDelete.key === 'category') {
      setChipData((prev) => (
        prev.map(obj => {
          if(obj.key === 'category') {
            const filterLabel = obj.label.filter(e => e !== index);
            filterSearch({ category: filterLabel });
            return { ...obj, label: filterLabel };
          }
          return obj;
        })
      ));
    }
    if(chipToDelete.key === 'subCategory') {
      setChipData((prev) => (
        prev.map(obj => {
          if(obj.key === 'subCategory') {
            const filterLabel = obj.label.filter(e => e !== index);
            filterSearch({ subCategory: filterLabel });
            return { ...obj, label: filterLabel };
          }
          return obj;
        })
      ));
    }
  };

  const searchHandler = (item) => {
    if(item.length !== 0) {
      filterSearch({ query: item});
      setChipData((prev) => (
        prev.map(obj => {
          if(obj.key === 'query') {
            return { ...obj, label: [item] };
          }
          return obj;
        })
      ));
    }else {
      setChipData((prev) => (
        prev.filter(obj => {
          return obj.key !== 'query';
        })
      ));
      objToArray({
        key: 'query',
        label: []
      });
    }
  };

  useEffect(() => {
    searchHandler(query);
  }, [query]);

  const categoryHandler = (item, isChecked) => {
    filterSearch({ category: item });
    if(item.length !== 0 && isChecked) {
      setChipData((prev) => (
        prev.map(obj => {
          if(obj.key === 'category') {
            return { ...obj, label: item };
          }
          return obj;
        })
      ));
    }else {
      setChipData((prev) => (
        prev.filter(obj => {
          return obj.key !== 'category';
        })
      ));
      objToArray({
        key: 'category',
        label: []
      });
    }
  };
  const subCategoryHandler = (item, isChecked) => {
    filterSearch({ subCategory: item });
    if(item.length !== 0 && isChecked) {
      setChipData((prev) => (
        prev.map(obj => {
          if(obj.key === 'subCategory') {
            return { ...obj, label: item };
          }
          return obj;
        })
      ));
    }else {
      setChipData((prev) => (
        prev.filter(obj => {
          return obj.key !== 'subCategory';
        })
      ));
      objToArray({
        key: 'subCategory',
        label: []
      });
    }
  };
  const pageHandler = (page) => {
    filterSearch({ page });
  };
  const brandHandler = (item, isChecked, event) => {
    filterSearch({ brand: item });
    if(item.length !== 0 && isChecked) {
      setChipData((prev) => (
        prev.map(obj => {
          if(obj.key === 'brand') {
            return { ...obj, label: item };
          }
          return obj;
        })
      ));
    }else {
      setChipData((prev) => (
        prev.filter(obj => {
          return obj.key !== 'brand';
        })
      ));
      objToArray({
        key: 'brand',
        label: []
      });
    }
  };
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find(item => item._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if(data.inStock < quantity) {
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'product is out of stock', severity: 'warning' } });
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: 1}});
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'item successfully added', severity: 'success' } });
  };

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
                <Toolbar sx={{display: 'flex', flexWrap: 'wrap'}}>
                  <Box sx={{width: {xs: '100%', sm: 'auto'}, flexGrow: 1, display: 'flex', alignItems: 'center'}}>
                    <Typography color="secondary.lightGrey" component="h2" variant="p">Search</Typography>
                    {
                      products.length === 0 ?
                      <Typography sx={{ m: 0, ml: 2, fontSize: {xs: '12px', sm: '16px'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                      "No products"
                      </Typography>
                      :
                      <Typography sx={{ m: 0, ml: 2, fontSize: {xs: '12px', sm: '16px'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                      There are {products.length} {products.length === 1 ? "product" : "products"}.
                    </Typography>
                    }
                  </Box>
                  <SwipeableFilterDrawer countProducts={countProducts} brands={brands} brandHandler={brandHandler} categories={categories} subCategories={subCategories} subCategoryHandler={subCategoryHandler} categoryHandler={categoryHandler} />
                  <ToggleButtons handleChangeView={handleChangeView} view={view} />
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
                  chipData.map((data, i) => (
                    data.label.map((label, index) => (
                    label !== '' &&
                    <ListItem sx={{width: 'auto'}} key={data.key + index}>
                      <Chip
                        label={`${data.key} : ${label}`}
                        onDelete={() => handleDelete(data, label, index)}
                      />
                    </ListItem>
                    ))
                  ))
                }
              </Paper>
            </Grid>
            {
              view === 'module' &&
              products.map(prod => (
                <Grid key={prod._id} item xs={12} sm={4} md={3}>
                    <Card sx={{ width: "100%", height: "100%", '&:hover .hover-buttons': {opacity: 1, transform: 'translateX(0px)', transition: 'all .5s'} }}>
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
                          <Box className='hover-buttons' sx={{opacity: {xs: 1, sm: 0}, transform: {xs: 'translateX(0px)', sm: 'translateX(-200px)'}}}>
                            <ActionCardButtons view={view} />
                          </Box>
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
            {
              view === 'list' &&
              products.map(prod => (
                <Grid sx={{display: {xs: 'none', md: 'block'}}} key={prod._id} item xs={12}>
                    <Card sx={{ width: "100%", height: "100%", display: 'flex' }}>
                        <CardActionArea sx={{position: 'relative', width: '100%', display: 'flex', '& a': { width: '100%'} }}>
                          <Link sx={{position: 'relative', display: 'flex', flex: 0}} href={`/product/${prod.slug}`} onClick={() => handleLoading(prod)}>
                          {
                            prod._id === selected &&
                            <CircularProgress sx={{position: 'absolute', left: '45%', top: '20%', zIndex: 1, transform: 'translateX(-50%)'}} size={50} />
                          }
                            <CardMedia sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%','& img': {objectFit: 'contain', width: 'unset!important', height: '168px!important', position: 'relative!important', p: 2} }} component="div">
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
                          <CardContent sx={{display: 'flex', flex: '0 0 75%', flexWrap: 'wrap'}}>
                            <Typography sx={{width: '100%'}} gutterBottom variant="h6" component="h3" align="left">
                            {prod.title}
                            </Typography>
                            <Typography align="center" variant="body2" color="text.secondary">
                              {prod.shortDescription}
                            </Typography>
                            {
                              prod.inStock > 0 ? 
                              ( <Typography sx={{width: '100%', py: 2}} color="primary" gutterBottom variant="caption" component="p" align="left">
                              in Stock
                              </Typography>) :
                              ( <Typography sx={{width: '100%', py: 2}} color="secondary" gutterBottom variant="caption" component="p" align="left">
                              out of Stock
                              </Typography>)
                            }
                            <Box
                              sx={{
                                textAlign: 'left',
                                my: 1,
                                width: '100%'
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
                            <ActionCardButtons view={view} />
                          </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
              ))
            }
           <Grid item xs={12}>
              <AppBar elevation={1} sx={{bgcolor: theme.palette.primary.white}} position="static">
                <Toolbar sx={{display: 'flex', flexWrap: 'wrap'}}>
                  <SelectPages pageSize={pageSize} sort={sort} page={page}  />
                  {
                    products.length === 0 ?
                    <Typography sx={{ m: {xs: 'auto', sm: 0}, ml: 2, flexGrow: 1, fontSize: {xs: '12px', sm: '16px'}, textAlign: {xs: 'center', sm: 'left'}, py: 3, width: {xs: '100%', sm: 'auto'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    "No products"
                    </Typography>
                    :
                    <Typography sx={{ m: {xs: 'auto', sm: 0}, ml: 2, fontSize: {xs: '12px', sm: '16px'}, flexGrow: 1, py: 3, width: {xs: '100%', sm: 'auto'}, textAlign: {xs: 'center', sm: 'left'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    There are {products.length} {products.length === 1 ? "product" : "products"}.
                  </Typography>
                  }
                  {
                    products.length > 0 &&
                    <Stack sx={{width: {xs: '100%', sm: 'auto'}, py: 2 }} spacing={2}>
                      <Pagination sx={{mx: 'auto'}} count={pages} color="primary" showFirstButton showLastButton onChange={(e, value) => pageHandler(value)}  />
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
