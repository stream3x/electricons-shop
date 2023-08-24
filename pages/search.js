import React, { useEffect, useState } from 'react';
import { AppBar, Box, Button, Card, CardActionArea, CardContent, CardMedia, Checkbox, Chip, CircularProgress, Collapse, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, Input, ListItem, Pagination, Paper, Rating, Slider, Stack, Toolbar, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Product from '../models/Product';
import BreadcrumbNav from '../src/assets/BreadcrumbNav';
import SelectSort from '../src/assets/SelectSort';
import ToggleButtons from '../src/assets/ToggleButtons';
import Link from '../src/Link';
import theme from '../src/theme';
import db from '../src/utils/db';
import SelectPages from '../src/assets/SelectPages';
import SwipeableFilterDrawer from '../src/components/SwipeableFilterDrawer';
import ActionCardButtons from '../src/assets/ActionCardButtons';

const minDistance = 10;
let brandArry = [];
let catArray = [];
let subCatArray = [];

function FilterRow(props) {
  const { items, title, handleChange } = props;
  const [expanded, setExpanded] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    // The counter changed!
  }, [router.query.counter]);
  
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
      <FormLabel component="legend">{title}</FormLabel>
        {
          items && items.slice(0, 3).map(item => (
            <FormGroup key={Object.keys(item)}>
              <FormControlLabel
                sx={{'& span': {color: 'secondary.lightGrey'} }}
                control={
                  Object.values(item)[0] ?
                  <Checkbox checked={Object.values(item)[0]} onChange={handleChange(item)} />
                  :
                  <Checkbox checked={false} onChange={handleChange(item)} />
                }
                label={Object.keys(item)}
              />
            </FormGroup>
          ))
        }
        <Collapse in={expanded} timeout="auto" unmountOnExit>
        {
          items && items.slice(3, items.length).map(item => (
            <FormGroup key={Object.keys(item)}>
              <FormControlLabel
                sx={{'& span': {color: 'secondary.lightGrey'} }}
                control={
                  Object.values(item)[0] ?
                  <Checkbox checked={Object.values(item)[0]} onChange={handleChange(item)} />
                  :
                  <Checkbox checked={false} onChange={handleChange(item)} />
                }
                label={Object.keys(item)}
              />
            </FormGroup>
          ))
        }
        </Collapse>
        {
          items && items.length > 3 &&
          <FormHelperText sx={{cursor: 'pointer', '&:hover': {color: 'secondary.main'}}} onClick={() => setExpanded(!expanded)}>{!expanded ? "+ show more" : "- show less"}</FormHelperText>
        }
      </FormControl>
    </Box>
  )
}

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
    pageSize = 40,
    page = 1
  } = router.query;

  const { products, countProducts, categories, subCategories, brands, pages } = props;

  const filterSearch = ({
    page,
    pageSize = 12,
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
    if(pageSize) query.pageSize = pageSize || PAGE_SIZE;
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

  const [view, setView] = React.useState('module');

  const handleChangeView = (event, nextView) => {
    setView(nextView);
  };

  const topCategoryState = categories.map(item => item);
  const subCategoryState = subCategories.map(item => item);
  const uniqueTopCat = [...new Set(topCategoryState)];
  const uniqueSubCat = [...new Set(subCategoryState)];
  const createBrandBooleans = Array(brands.length).fill(false);
  const createTopCatBooleans = Array(uniqueTopCat.length).fill(false);
  const createSubCatBooleans = Array(uniqueSubCat.length).fill(false);

  const memoPrice = React.useMemo(() => getAllPrice(products), [products])

  function getAllPrice(prodz) {
    const allPrices = [];
    for (const key in prodz) {
      const element = prodz[key].price;
      allPrices.push(element)
    }
    return allPrices;
  }

  const minPrice = Math.min(...memoPrice);
  const maxPrice = Math.max(...memoPrice);
  const [value, setValue] = React.useState([]);
  const [priceChip, setPriceChip] = React.useState([]);

  const handlePriceDelete = () => {
    setPriceChip([]);
    priceHandler(priceChip);
  };

  const renderChipPrice = () => {
    return priceChip.map(item => {
      if(priceChip.length >= 1) {
        return (
          <ListItem sx={{width: 'auto'}} key={Object.keys(item)}>
            <Chip
              label={item && `price from: ${Number(item.price_one)} price to: ${Number(item.price_two)}`}
              onDelete={handlePriceDelete}
            />
          </ListItem>
        )
      }else {
        return null;
      }
    })
  }

  const handleChangePrice = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue([newValue[0] - minDistance, value[1]]);
    } else {
      setValue([value[0], newValue[1] + minDistance]);
    }
  };

  function setPriceFilter() {
    priceHandler(value.join('-'));
    if(value.length !== 0) {
      setPriceChip([{price_one: value[0], price_two: value[1]}])
    }else {
      setPriceChip([])
    }
  }

  const handleInputMinChange = (event) => {
    setValue([Number(event.target.value), value[1]]);
  };
  const handleInputMaxChange = (event) => {
    setValue([value[0], Number(event.target.value)]);
  };

  const resultBrands = [createBrandBooleans].map(row =>
    row.reduce((acc, cur, i) => (
      acc[brands[i]] = cur, acc
    ), {}
  ));

  const resultTopCat = [createTopCatBooleans].map(row =>
    row.reduce((acc, cur, i) => (
      acc[uniqueTopCat[i]] = cur, acc
    ), {}
  ));

  const resultSubCat = [createSubCatBooleans].map(row =>
    row.reduce((acc, cur, i) => (
      acc[uniqueSubCat[i]] = cur, acc
    ), {}
  ));

  const newBrands = [];

  for (const key in resultBrands[0]) {
    let temp = {};
      temp[key] = resultBrands[0][key];
      newBrands.push(temp);
  }

  const newCat = [];

  for (const key in resultTopCat[0]) {
    let temp = {};
      temp[key] = resultTopCat[0][key];
      newCat.push(temp);
  }
  
  const newSubCat = [];

  for (const key in resultSubCat[0]) {
    let temp = {};
      temp[key] = resultSubCat[0][key];
      newSubCat.push(temp);
  }

  const [brandFilter, setBrandFilter] = React.useState(newBrands);
  const [topCat, setTopCat] = React.useState(newCat);
  const [subCat, setSubCat] = React.useState(newSubCat);
  const [searchFilter, setSearchFilter] = React.useState([]);

  const handleChangeBrand = (item) => (event) => {
    const removeDuplicates = [];
    setBrandFilter(prev => {
      return prev.map(sub => {
        if (Object.keys(sub).toString() === Object.keys(item).toString()) {
          return { ...sub, [`${Object.keys(sub).toString()}`]: !Object.values(item)[0] }
        }else {
          return { ...sub }
        }
      })
    })
    if(!Object.values(item)[0]) {
      brandArry.push(Object.keys(item)[0])
    }else {
      removeDuplicates.push(Object.keys(item)[0])
    }
    // brandHandler(brandArry = brandArry.filter(val => !removeDuplicates.includes(val)));
    console.log(item, removeDuplicates, brandFilter);
  };

  const handleDelete = () => {
    setSearchFilter([]);
    const queryRemoveSpace = `${query.replace(/ /g, '+')}`;
    const addQuery = `query=${queryRemoveSpace}`;
    router.push(
      router.asPath.replace(addQuery, '')
    );
  };
 
  const renderChipSearch = () => {
    return searchFilter.map(item => {
      if(searchFilter.length >= 1) {
        return (
          <ListItem sx={{width: 'auto'}} key={Object.keys(item)}>
            <Chip
              label={item && item}
              onDelete={handleDelete}
            />
          </ListItem>
        )
      }else {
        return null;
      }
    })
  }

  const renderChipsBrand = () => {
    return brandFilter.map(item => {
      if(Object.values(item)[0]) {
        return (
          <ListItem sx={{width: 'auto'}} key={Object.keys(item).toString()}>
            <Chip
              label={Object.keys(item).toString()}
              onDelete={handleChangeBrand(item)}
            />
        </ListItem>
        )
      }else {
        return null;
      }
    })
  }

  const handleChangeTopCat = (item) => (event) => {
    const removeDuplicates = [];
    setTopCat(prev => {
      return prev.map(sub => {
        if (Object.keys(sub).toString() === Object.keys(item).toString()) {
          return { ...sub, [`${Object.keys(sub).toString()}`]: !Object.values(item)[0] }
        }else {
          return { ...sub }
        }
      })
    })
    if(!Object.values(item)[0]) {
      catArray.push(Object.keys(item)[0])
    }else {
      removeDuplicates.push(Object.keys(item)[0])
    }
    categoryHandler(catArray = catArray.filter(val => !removeDuplicates.includes(val)))
  };

  const renderChipsCat = () => {
    return topCat.map(item => {
      if(Object.values(item)[0]) {
        return (
          <ListItem sx={{width: 'auto'}} key={Object.keys(item).toString()}>
          <Chip
            label={Object.keys(item).toString()}
            onDelete={handleChangeTopCat(item)}
          />
        </ListItem>
        )
      }else {
        return null;
      }
    })
  }

  const handleChangeSubCat = (item) => (event) => {
    const removeDuplicates = [];
    setSubCat(prev => {
      return prev.map(sub => {
        if (Object.keys(sub).toString() === Object.keys(item).toString()) {
          return { ...sub, [`${Object.keys(sub).toString()}`]: !Object.values(item)[0] }
        }else {
          return { ...sub }
        }
      })
    })
    if(!Object.values(item)[0]) {
      subCatArray.push(Object.keys(item)[0])
    }else {
      removeDuplicates.push(Object.keys(item)[0])
    }
    subCategoryHandler(subCatArray = subCatArray.filter(val => !removeDuplicates.includes(val)))
  };

  const renderChips = () => {
    return subCat.map(item => {
      if(Object.values(item)[0]) {
        return (
          <ListItem sx={{width: 'auto'}} key={Object.keys(item).toString()}>
          <Chip
            label={Object.keys(item).toString()}
            onDelete={handleChangeSubCat(item)}
          />
        </ListItem>
        )
      }else {
        return null;
      }
    })
  }

  const searchHandler = (item) => {
    if(item) {
      setSearchFilter([item])
    }else {
      setSearchFilter([])
    }
    filterSearch({ query: item});
  };

  useEffect(() => {
    searchHandler(query);
  }, [query]);

  const pageSizeHandler = (num) => {
    filterSearch({ pageSize: num });
  };

  const categoryHandler = (item) => {
    filterSearch({ category: item });
  };
  const subCategoryHandler = (item) => {
    filterSearch({ subCategory: item });
  };
  const pageHandler = (page) => {
    filterSearch({ page });
  };
  const brandHandler = (item) => {
    filterSearch({ brand: item });
  };
  const sortHandler = (value) => {
    filterSearch({ sort: value });
  };
  const priceHandler = (val) => {
    filterSearch({ price: val });
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
                <Toolbar sx={{display: 'flex', flexWrap: 'wrap'}}>
                  <Box sx={{ width: 300 }}>
                    <Typography component="p" color="secondary" id="input-slider" gutterBottom>
                      Filter by price
                    </Typography>
                    <Box sx={{ my: 2, display: 'flex' }}>
                      <Input
                        sx={{ '& input': {textAlign: 'center'}, flex: 1 }}
                        value={value.length ? value[0] : minPrice}
                        size="small"
                        onChange={handleInputMinChange}
                        inputProps={{
                          min: minPrice,
                          max: maxPrice,
                          type: 'number',
                          'aria-labelledby': 'input-slider',
                        }}
                      />
                      <Typography component="span" color="secondary">
                        -
                      </Typography>
                      <Input
                        sx={{ '& input': {textAlign: 'center'}, flex: 1 }}
                        value={value.length ? value[1] : maxPrice}
                        size="small"
                        onChange={handleInputMaxChange}
                        inputProps={{
                          min: minPrice,
                          max: maxPrice,
                          type: 'number',
                          'aria-labelledby': 'input-slider',
                        }}
                      />
                    </Box>
                    <Slider
                      getAriaLabel={() => 'Filter by price'}
                      value={[value[0] ? value[0] : minPrice, value[1] ? value[1] : maxPrice]}
                      onChange={handleChangePrice}
                      min={minPrice}
                      max={maxPrice}
                    />
                </Box>
                <Box>
                  <Button variant='outlined' onClick={setPriceFilter}>set price</Button>
                </Box>
                </Toolbar>
                <Toolbar>
                  <FilterRow items={brandFilter} title={"Brand"} handleChange={handleChangeBrand} />
                </Toolbar>
                <Toolbar>
                  <FilterRow items={topCat} title={"Top Categories"} handleChange={handleChangeTopCat} />
                </Toolbar>
                <Toolbar>
                  <FilterRow items={subCat} title={"Categories"} handleChange={handleChangeSubCat} />
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
                      There {products.length === 1 ? " is" : " are"} {products.length} {products.length === 1 ? " product" : " products"}.
                    </Typography>
                    }
                  </Box>
                  <SwipeableFilterDrawer
                    value={value}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    setPriceFilter={setPriceFilter}
                    handleInputMaxChange={handleInputMaxChange}
                    handleInputMinChange={handleInputMinChange}
                    handleChangePrice={handleChangePrice}
                    countProducts={countProducts}
                    handleChange={handleChangeBrand}
                    brandFilter={brandFilter}
                    topCat={topCat}
                    subCat={subCat}
                    handleChangeTopCat={handleChangeTopCat}
                    handleChangeSubCat={handleChangeSubCat}
                  />
                  <ToggleButtons handleChangeView={handleChangeView} view={view} />
                  <SelectSort value={sort} sortHandler={sortHandler} />
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
                {renderChipsBrand()} {renderChips()} {renderChipsCat()} {renderChipSearch()} {renderChipPrice()}
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
                                src={prod.images.length > 1 ? prod.images[1].image : '/images/no-image.jpg'}
                                alt={prod.title}
                                quality={35}
                              />
                            </CardMedia>
                          </Link>
                          <Box className='hover-buttons' sx={{opacity: {xs: 1, sm: 0}, transform: {xs: 'translateX(0px)', sm: 'translateX(-200px)'}}}>
                            <ActionCardButtons product={prod} view={view} />
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
                              {"$"}{prod.price}
                              <Typography align="right" component="span" variant="body2" color="secondary.lightGrey" sx={{marginLeft: 1}}>
                                <del>
                                {"$"}{prod.oldPrice && prod.oldPrice}
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
                            <ActionCardButtons product={prod} view={view} />
                          </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
              ))
            }
           <Grid item xs={12}>
              <AppBar elevation={1} sx={{bgcolor: theme.palette.primary.white}} position="static">
                <Toolbar sx={{display: 'flex', flexWrap: 'wrap'}}>
                  <SelectPages values={['6', '12', '24', '36']} pageSize={pageSize} pageSizeHandler={pageSizeHandler}  />
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
  const PAGE_SIZE = 12;
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
        $gte: Number(price.split('-')[0]),
        $lte:  Number(price.split('-')[1])
      }
    }
    : {};

    const order = 
    sort === 'availability'
    ? { isAvalable: -1 }
    : sort === 'highest'
    ? { price: -1 }
    : sort === 'lowest'
    ? { price: 1 }
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
