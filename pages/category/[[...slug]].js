import React, { useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Card, CardActionArea, CardContent, CardMedia, CircularProgress, List, ListItem, ListItemText, Pagination, Stack, Typography } from '@mui/material';
import Link from '../../src/Link';
import ReplyIcon from '@mui/icons-material/Reply';
import Rating from '@mui/material/Rating';
import BreadcrumbNav from '../../src/assets/BreadcrumbNav';
import db from '../../src/utils/db';
import IconButton from '@mui/material/IconButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { Store } from '../../src/utils/Store';
import LoadingButton from '@mui/lab/LoadingButton';
import Category from '../../models/Category';
import Product from '../../models/Product';
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import theme from '../../src/theme';
import RangeSlider from '../../src/assets/RangeSlider';
import ToggleButtons from '../../src/assets/ToggleButtons';
import SelectCategory from '../../src/assets/SelectCategory';
import CheckboxesGroup from '../../src/assets/CheckboxesGroup';
import { useRouter } from 'next/router';
import SelectPages from '../../src/assets/SelectPages';

const PAGE_SIZE = 4;

export async function getServerSideProps(context) {
  const { params, query } = context;
  const { slug } = params;

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
        $toPrice: Number(price.splite('-')[1])
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
  const categoryCat = await Category.find({}).lean();
  const product = await Product.find({}).lean();
  const categoryProducts = product.filter(prod => prod.categoryUrl === slug[0]);
  const subCategoryProducts = product.filter(prod => prod.subCategoryUrl === slug[1]);
  const emptyCategoryProducts = Object.keys(categoryProducts).length === 0;
  const emptySubCategoryProducts = Object.keys(subCategoryProducts).length === 0;
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
    if(emptySubCategoryProducts) {
      const org_value = JSON.stringify(categoryProducts, replacer);
      const newValue = JSON.parse(org_value, reviver);
      return newValue;
    }else {
      const org_value = JSON.stringify(subCategoryProducts, replacer);
      const newValue = JSON.parse(org_value, reviver);
      return newValue;
    }
  }

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

    const products = productDocs.map(db.convertDocToObject);

    return {
      props: {
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
        categories,
        subCategories,
        brands,
        categoryCat: slug,
        categoryProducts: !emptyCategoryProducts && convertToJson(),
        subCategoryProducts: !emptySubCategoryProducts && convertToJson()
      }
    }
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
  const router = useRouter();
  const {
    query = '',
    category = '',
    subCategory = '',
    brand = '',
    price = '',
    sort = '',
    page = 1
  } = router.query;

  const { categoryCat, products, subCategoryProducts, categoryProducts, countProducts, categories, subCategories, brands, pages } = props;

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
  }
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value })
  }
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value })
  }
  const pageSizeHandler = (value) => {
    setPageSize(value)
  }
  const { state, dispatch } = useContext(Store);
  // const titlePage = slug.query.slug.toString().replace(/-/g, ' ').replace(/^./, function(x){return x.toUpperCase()});
  const { snack, cart: {cartItems} } = state;
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = React.useState('');
  const [pageSize, setPageSize] = useState(PAGE_SIZE)

  const currentPage = [...Array(pages).keys()].map(pageNumber => pageNumber + 1);

  const handlePageChange = (event, value) => {
    pageHandler(value);
  };
console.log(pageSize, pages, countProducts, products);
  const handleLoading = (product) => {
    setSelected(product._id);
  };

  if(!categoryCat) {
    return (
      <Box sx={{ flexGrow: 1, my: 4  }}>
        <Typography gutterBottom variant="h6" component="h2" textAlign="center">
          Category not found
        </Typography>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <Item elevation={0}>
              <Link href="/" passHref>
                <Button sx={{'&:hover': {backgroundColor: theme.palette.secondary.main}}} variant="contained" startIcon={<ReplyIcon />}>
                  back to shop
                </Button>
              </Link>
            </Item>
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (    
    <Box sx={{ flexGrow: 1, my: 4  }}>
      <BreadcrumbNav categoryData={categoryCat} />
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
                  <CheckboxesGroup />
                </Toolbar>
              </AppBar>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={9}>
        {
          subCategoryProducts ?
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppBar elevation={1} sx={{bgcolor: theme.palette.primary.white}} position="static">
                <Toolbar>
                  <Typography color="primary" component="h2" variant="p">Category</Typography>
                  {
                    subCategoryProducts.length === 0 ?
                    <Typography sx={{ m: 0, ml: 2, flexGrow: 1, fontSize: {xs: '12px', sm: '16px'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    "No products"
                    </Typography>
                    :
                    <Typography sx={{ m: 0, ml: 2, fontSize: {xs: '12px', sm: '16px'}, flexGrow: 1 }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    There are {subCategoryProducts.length} {subCategoryProducts.length === 1 ? "product" : "products"}.
                  </Typography>
                  }
                  <ToggleButtons />
                  <SelectCategory />
                </Toolbar>
              </AppBar>
            </Grid>
            {subCategoryProducts.slice(0, pageSize).map(prod => (
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
            ))}
            <Grid item xs={12}>
              <AppBar elevation={1} sx={{bgcolor: theme.palette.primary.white}} position="static">
                <Toolbar>
                  <SelectPages pageSize={pageSize} sort={sort} page={page} pageSizeHandler={pageSizeHandler}  />
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
                      <Pagination count={pages} color="primary" showFirstButton showLastButton onChange={handlePageChange}  />
                    </Stack>
                  }
                </Toolbar>
              </AppBar>
            </Grid>
          </Grid>
          :
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppBar elevation={1} sx={{bgcolor: theme.palette.primary.white}} position="static">
                <Toolbar>
                  <Typography color="primary" component="h2" variant="p">
                    Category
                  </Typography>
                  {
                    countProducts === 0 ?
                    <Typography sx={{ m: 0, ml: 2, flexGrow: 1, fontSize: {xs: '12px', sm: '16px'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    "No products"
                    </Typography>
                    :
                    <Typography sx={{ m: 0, ml: 2, fontSize: {xs: '12px', sm: '16px'}, flexGrow: 1 }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    There are {countProducts} {countProducts === 1 ? "product" : "products"}.
                  </Typography>
                  }
                  <ToggleButtons />
                  <SelectCategory sort={sort} sortHandler={sortHandler} />
                </Toolbar>
              </AppBar>
            </Grid>
          {products.map(prod => (
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
          ))}
            <Grid item xs={12}>
              <AppBar elevation={1} sx={{bgcolor: theme.palette.primary.white}} position="static">
                <Toolbar>
                  <SelectPages pageSize={pageSize} sort={sort} page={page} pageSizeHandler={pageSizeHandler}  />
                  {
                    countProducts === 0 ?
                    <Typography sx={{ m: 0, ml: 2, flexGrow: 1, fontSize: {xs: '12px', sm: '16px'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    "No products"
                    </Typography>
                    :
                    <Typography sx={{ m: 0, ml: 2, fontSize: {xs: '12px', sm: '16px'}, flexGrow: 1 }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    There are {countProducts} {countProducts === 1 ? "product" : "products"}.
                    </Typography>
                  }
                  {
                    countProducts > 0 &&
                    <Stack spacing={2}>
                      {
                        
                        console.log(pages, page)
                      }
                      <List sx={{display: 'flex'}}>
                        {
                          products.length > 0 &&
                          [...Array(pages).keys()].map(pageNumber => (
                            <ListItem key={pageNumber}>
                              <Button onClick={() => pageHandler(pageNumber + 1)} size="small" variant='outlined' color={page == pageNumber + 1 ? "primary" : "secondary"}>
                                <ListItemText primary={pageNumber + 1} />
                              </Button>
                            </ListItem>
                          ))
                        }
                      </List>
                      <Pagination count={pages} color="primary" showFirstButton showLastButton onChange={(e, value) => pageHandler(pages[e.target.value + 1])}  />
                    </Stack>
                  }
                </Toolbar>
              </AppBar>
            </Grid>
          </Grid>
        }
        </Grid>
      </Grid>
    </Box>
  );
}