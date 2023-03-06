import React, { useState, useContext, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Card, CardActionArea, CardContent, CardMedia, Chip, CircularProgress, List, ListItem, ListItemText, Pagination, Stack, Typography } from '@mui/material';
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
import { useRouter } from 'next/router';
import SelectPages from '../../src/assets/SelectPages';
import SelectSort from '../../src/assets/SelectSort';
import SwipeableFilterDrawer from '../../src/components/SwipeableFilterDrawer';
import ActionCardButtons from '../../src/assets/ActionCardButtons';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { Collapse } from '@mui/material';

const PAGE_SIZE = 40;
let brandArray = [];

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
  
  const categoryFilter = category ? { category } : {};
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
    ? { inStock: -1 }
    : sort === 'lowest'
    ? { price: 1 }
    : sort === 'highest'
    ? { price: -1 }
    : sort === 'namelowest'
    ? { title: 1 }
    : sort === 'namehighest'
    ? { title: -1 } 
    : sort === 'latest'
    ? { createdAt: -1 }
    : { _id: -1 };

  await db.connect();
  const cat = await Category.find({}).lean();

    const categories = await Product.find({categoryUrl: slug[slug.length - 1]}).distinct('categoryUrl');
    const subCategories = await Product.find({categoryUrl: slug[slug.length - 1]}).distinct('subCategoryUrl');
    const brands = await Product.find({categoryUrl: slug[slug.length - 1]}).distinct('brand').lean();
    
    const productDocs = await Product.find(
      {
        ...queryFilter,
        ...categoryFilter,
        ...subCategoryFilter,
        ...priceFilter,
        ...brandFilter,
      },
    ).sort(order).skip(pageSize * (page - 1)).limit(pageSize).lean();
    const productDocsByCategory = productDocs.filter(prod => slug[1] !== undefined ? prod.subCategoryUrl === slug[1] : prod.categoryUrl === slug[0]);

    // const countProducts = await Product.countDocuments({
    //   ...queryFilter,
    //   ...categoryFilter,
    //   ...subCategoryFilter,
    //   ...priceFilter,
    //   ...brandFilter
    // });

    await db.disconnect();
    const products = productDocsByCategory.map(db.convertDocToObject);

    return {
      props: {
        products,
        countProducts: productDocsByCategory.length,
        page,
        pages: Math.ceil(productDocsByCategory.length / pageSize),
        categories,
        subCategories,
        brands,
        slug
      }
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
  const router = useRouter();
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

  const { slug, products, countProducts, categories, subCategories, brands, pages, productDocsCategory } = props;

  const filterSearch = ({
    page,
    pageSize,
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
    if(pageSize) query.pageSize = pageSize;
    if(page) query.page = page;
    if(searchQueary) query.searchQueary = searchQueary;
    if(category) query.category = category;
    if(subCategory) query.subCategory = subCategory.toString().replace(/-/g, ' ');
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

  const [chipData, setChipData] = useState(initialState);

  const objToArray = obj => {
    setChipData(current => [...current, obj]);
  };

  // const handleDelete = (chipToDelete, index, i) => {
  //   const filterLabel = chipToDelete.label.filter(e => e !== index);
  //   const removeQuery = `${router.asPath}`.replace(`query=${query.replace(/ /g, '+')}`, '');
  //   console.log(filterLabel, chipToDelete, index, chipData);
  //   if(chipToDelete.key === 'query') {
  //     if(chipToDelete.label.length !== 0) {
  //       router.push(removeQuery);
  //       setChipData((prev) => (
  //         prev.map(obj => {
  //           if(obj.key === 'query') {
  //             return { ...obj, label: filterLabel };
  //           }
  //           return obj;
  //         })
  //       ));
  //     }else {
  //       setChipData((prev) => (
  //         prev.filter(obj => {
  //           return obj.key !== 'query';
  //         })
  //       ));
  //       objToArray({
  //         key: 'query',
  //         label: []
  //       });
  //     }
  //   }
  //   if(chipToDelete.key === 'brand') {
  //     setChipData((prev) => (
  //       prev.map(obj => {
  //         const filterLabel = obj.label.filter(e => e !== index);
  //         if(obj.key === 'brand') {
  //           filterSearch({ brand: filterLabel });
  //           return { ...obj, label: filterLabel };
  //         }          
  //         return obj;
  //       })
  //     ));
  //   }
  //   if(chipToDelete.key === 'category') {
  //     setChipData((prev) => (
  //       prev.map(obj => {
  //         if(obj.key === 'category') {
  //           const filterLabel = obj.label.filter(e => e !== index);
  //           filterSearch({ category: filterLabel });
  //           return { ...obj, label: filterLabel };
  //         }
  //         return obj;
  //       })
  //     ));
  //   }
  //   if(chipToDelete.key === 'subCategory') {
  //     setChipData((prev) => (
  //       prev.map(obj => {
  //         if(obj.key === 'subCategory') {
  //           const filterLabel = obj.label.filter(e => e !== index);
  //           filterSearch({ subCategory: filterLabel });
  //           return { ...obj, label: filterLabel };
  //         }
  //         return obj;
  //       })
  //     ));
  //   }
  // };

  const pageSizeHandler = (num) => {
    filterSearch({ pageSize: num })
  }
  const categoryHandler = (item, isChecked) => {
    filterSearch({ category: item });
    // if(item.length !== 0 && isChecked) {
    //   setChipData((prev) => (
    //     prev.map(obj => {
    //       if(obj.key === 'category') {
    //         return { ...obj, label: item };
    //       }
    //       return obj;
    //     })
    //   ));
    // }else {
    //   setChipData((prev) => (
    //     prev.filter(obj => {
    //       return obj.key !== 'category';
    //     })
    //   ));
    //   objToArray({
    //     key: 'category',
    //     label: []
    //   });
    // }
  };
  const subCategoryHandler = (item, isChecked) => {
    filterSearch({ subCategory: item });
    // if(item.length !== 0 && isChecked) {
    //   setChipData((prev) => (
    //     prev.map(obj => {
    //       if(obj.key === 'subCategory') {
    //         return { ...obj, label: item };
    //       }
    //       return obj;
    //     })
    //   ));
    // }else {
    //   setChipData((prev) => (
    //     prev.filter(obj => {
    //       return obj.key !== 'subCategory';
    //     })
    //   ));
    //   objToArray({
    //     key: 'subCategory',
    //     label: []
    //   });
    // }
  };
  const pageHandler = (page) => {
    filterSearch({ page });
  };
  const brandHandler = (item, isChecked) => {
    filterSearch({ brand: item });
    // if(item.length !== 0 && isChecked) {
    //   setChipData((prev) => (
    //     prev.map(obj => {
    //       if(obj.key === 'brand') {
    //         return { ...obj, label: item };
    //       }
    //       return obj;
    //     })
    //   ));
    // }else {
    //   setChipData((prev) => (
    //     prev.filter(obj => {
    //       return obj.key !== 'brand';
    //     })
    //   ));
    //   objToArray({
    //     key: 'brand',
    //     label: []
    //   });
    // }
  };
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };

  // const titlePage = slug.query.slug.toString().replace(/-/g, ' ').replace(/^./, function(x){return x.toUpperCase()});
  const [selected, setSelected] = React.useState('');
  const [view, setView] = React.useState('module');

  const handleChangeView = (event, nextView) => {
    setView(nextView);
  };

  const currentPage = [...Array(pages).keys()].map(pageNumber => pageNumber + 1);

  const handlePageChange = (event, value) => {
    pageHandler(value);
  };

  const handleLoading = (product) => {
    setSelected(product._id);
  };

  const [expanded, setExpanded] = React.useState(false);
  const brandState = brands.map(item => item);
  const unique = [...new Set(brandState)];
  const createBooleans = Array(unique.length).fill(false);
  const result = [createBooleans].map(row =>
    row.reduce((acc, cur, i) =>
      (acc[unique[i]] = cur, acc), {})
  );

  const arr = Object.entries(result[0]).map(([name, value]) => {
    return {
      name,
      value
    }
  });
  const [stateBrand, setStateBrand] = React.useState([arr][0]);

  const handleChange = (item) => (event) => {
    const removeDuplicates = [];
    const update = stateBrand.map(x => {
      if(x.name === item.name) {
        return {
          ...x, value: event.target.checked
        }
      }
      return x;
    })
    setStateBrand(update);
  
    if(!item.value) {
      brandArray.push(item.name);
    }else {
      removeDuplicates.push(item.name);
    }
    brandHandler(brandArray = brandArray.filter(val => !removeDuplicates.includes(val)), event.target.checked);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if(!products) {
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
      <BreadcrumbNav categoryData={slug} />
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
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {
                      stateBrand.length > 1 &&
                      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                        <FormLabel component="legend">Brand</FormLabel>
                        {
                          stateBrand.slice(0, 3).map(item => (
                            <FormGroup key={item.name}>
                              <FormControlLabel
                                sx={{'& span': {color: 'secondary.lightGrey'} }}
                                control={
                                  <Checkbox checked={item.value ? item.value : false} onChange={handleChange(item)} />
                                }
                                label={`${item.value}`}
                              />
                            </FormGroup>
                          ))
                        }
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                        {
                            stateBrand.slice(3, stateBrand.length).map(item => (
                              <FormGroup key={item.name}>
                                <FormControlLabel
                                  sx={{'& span': {color: 'secondary.lightGrey'} }}
                                  control={
                                    <Checkbox checked={item.value} onChange={handleChange(item)} />
                                  }
                                  label={item.name}
                                />
                              </FormGroup>
                            ))
                          }
                        </Collapse>
                        {
                          stateBrand.length > 3 &&
                          <FormHelperText sx={{cursor: 'pointer', '&:hover': {color: 'secondary.main'}}} onClick={handleExpandClick}>{!expanded ? "+ show more" : "- show less"}</FormHelperText>
                        }
                      </FormControl>
                    }
                  </Box>
                  
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
                <Toolbar sx={{display: 'flex', flexWrap: 'wrap'}}>
                  <Box sx={{width: {xs: '100%', sm: 'auto'}, flexGrow: 1, display: 'flex', alignItems: 'center'}}>
                    <Typography color="secondary.lightGrey" component="h2" variant="p">
                      Category
                    </Typography>
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
                  <SwipeableFilterDrawer />
                  <ToggleButtons handleChangeView={handleChangeView} view={view} />
                  <SelectSort sort={sort} sortHandler={sortHandler} />
                </Toolbar>
              </AppBar>
            </Grid>
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
                        onDelete={() => handleDelete(data, label)}
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
                  <SelectPages sx={{order: 2}} pageSize={pageSize} pageSizeHandler={pageSizeHandler}  />
                  {
                    countProducts === 0 ?
                    <Typography sx={{ m: {xs: 'auto', sm: 0}, flexGrow: 1, fontSize: {xs: '12px', sm: '16px'}, textAlign: {xs: 'center', sm: 'left'}, width: {xs: '100%', sm: 'auto'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    "No products"
                    </Typography>
                    :
                    <Typography sx={{ m: {xs: 'auto', sm: 0}, fontSize: {xs: '12px', sm: '16px'}, flexGrow: 1, textAlign: {xs: 'center', sm: 'left'}, width: {xs: '100%', sm: 'auto'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    There are {countProducts} {countProducts === 1 ? "product" : "products"}.
                    </Typography>
                  }
                  {
                    countProducts > 0 &&
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
  );
}