import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Card, CardActionArea, CardContent, CardMedia, Chip, CircularProgress, Input, ListItem, Pagination, Slider, Stack, Typography } from '@mui/material';
import Link from '../../src/Link';
import ReplyIcon from '@mui/icons-material/Reply';
import Rating from '@mui/material/Rating';
import BreadcrumbNav from '../../src/assets/BreadcrumbNav';
import IconButton from '@mui/material/IconButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import LoadingButton from '@mui/lab/LoadingButton';
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import theme from '../../src/theme';
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
import axios from 'axios';

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

export default function CategoryProducts() {
  const router = useRouter();
  const { slug } = router.query;
  const category = slug && slug[0];
  const subcategory = slug ? slug[1] : undefined;
  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState('');
  const [categories, setCategories] = useState([]);
  const [lte, setLte] = useState('');
  const [gte, setGte] = useState('');
  const [sort, setSort] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [checkBrand, setCheckBrand] = useState([]);
  const [pageSize, setPageSize] = useState('12');
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  const memoPrice = React.useMemo(() => getAllPrice(products), [products]);
  let brandArry = [];
  let subCatArray = [];
  const minDistance = 10;
  const newSubCat = [];
  const newBrands = [];

  function getAllPrice(stores) {
    const allPrices = [];
    for (const key in stores) {
      const element = stores[key].price;
      allPrices.push(element)
    }
    return allPrices;
  }

  const minPrice = Math.min(...memoPrice);
  const maxPrice = Math.max(...memoPrice);
  const [value, setValue] = React.useState([minPrice, maxPrice]);
  const [priceChip, setPriceChip] = React.useState([]);

  useEffect(() => {
    async function fetchingData(pageSize, page) {
      try {
        const { data } = await axios.get(`/api/products/fetchByCategories?${subcategory === undefined ? `categoryUrl=${category}` : `subCategoryUrl=${subcategory}`}&minPrice=${gte}&maxPrice=${lte}`, {
          params: {
            pageSize: pageSize,
            page: page,
            brand: checkBrand.toString(),

          }
        });
        setProducts(data.products);
        setCategories(data.categories);
        setSubCategories(data.subcategories);
        setBrands(data.brands);
        setPages(data.totalPages);
        setValue([minPrice, maxPrice])
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    }
    fetchingData();
  }, [category, subcategory, priceChip, checkBrand]);
console.log(selectedSubcategory, subcategory ? subcategory : selectedSubcategory);
  async function fetchingData(pageSize, page, sort) {
    try {
      const { data } = await axios.get(`/api/products/fetchByCategories?${subcategory === undefined ? `categoryUrl=${category}` : `subCategoryUrl=${subcategory}`}`, {
        params: {
          pageSize: pageSize,
          page: page,
          sort: sort
        }
      });
      setProducts(data.products);
      setPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  function FilterRow(props) {
    const { items, title, handleChange } = props;
    const [expanded, setExpanded] = React.useState(false);

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
                  label={`${Object.keys(item)}`}
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

  const handlePriceDelete = () => {
    setPriceChip([]);
    setValue([]);
    setLte('');
    setGte('');
    setIsFilterApplied(false);
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
      setGte(newValue[0] - minDistance);
    } else {
      setValue([value[0], newValue[1] + minDistance]);
      setLte(newValue[1] + minDistance);
    }
  };

  function setPriceFilter() {
    if(value.length !== 0) {
      setPriceChip([{price_one: value[0], price_two: value[1]}]);
      setIsFilterApplied(true);
    }else {
      setPriceChip([])
      setIsFilterApplied(false);
    }
  }

  const handleInputMinChange = (event) => {
    setValue([Number(event.target.value), value[1]]);
    setGte(Number(event.target.value));
  };
  const handleInputMaxChange = (event) => {
    setValue([value[0], Number(event.target.value)]);
    setLte(Number(event.target.value));
  };

  const subCategoryState = subCategories?.map(item => item);
  const brandsState = brands?.map(item => item);
  const uniqueSubCat = [...new Set(subCategoryState)];
  const uniqueBrand = [...new Set(brandsState)];
  const createBrandBooleans = Array(uniqueBrand?.length).fill(false);
  const createSubCatBooleans = Array(uniqueSubCat.length).fill(false);
  const [brandFilter, setBrandFilter] = React.useState([]);
  const [subCat, setSubCat] = React.useState([]);

  const resultBrands = [createBrandBooleans].map(row =>
    row.reduce((acc, cur, i) => (
      acc[brands && brands[i]] = cur, acc
    ), {}
  ));

  const resultSubCat = [createSubCatBooleans].map(row =>
    row.reduce((acc, cur, i) => (
      acc[subCategoryState[i]] = cur, acc
    ), {}
  ));

  for (const key in resultBrands[0]) {
    let temp = {};
      temp[key] = resultBrands[0][key];
      newBrands.push(temp);
  }
  
  for (const key in resultSubCat[0]) {
    let temp = {};
      temp[key] = resultSubCat[0][key];
      newSubCat.push(temp);
  }

  useEffect(() => {
    setBrandFilter(newBrands);
    setSubCat(newSubCat);
  }, [])
  

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
    brandHandler(brandArry = brandArry.filter(val => !removeDuplicates.includes(val)))
  };

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

  const pageSizeHandler = (newPageSize) => {
    setPageSize(newPageSize);
    fetchingData(newPageSize, 1);
  };
  const subCategoryHandler = (item) => {
    setSelectedSubcategory(item.toString());
  };
  const pageHandler = (page) => {
    fetchingData(pageSize, page);
  };
  const brandHandler = (item) => {
    setCheckBrand(item)
  };
  const sortHandler = (e) => {
    console.log(e);
  };

  const [selected, setSelected] = React.useState('');
  const [view, setView] = React.useState('module');

  const handleChangeView = (event, nextView) => {
    setView(nextView);
  };

  const handleLoading = (product) => {
    setSelected(product._id);
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
                  <Toolbar sx={{display: 'flex', flexWrap: 'wrap'}}>
                    <Box sx={{ width: 300 }}>
                      <Typography align='center' component="p" color="secondary" id="input-slider" gutterBottom>
                        Filter by price
                      </Typography>
                      <Box sx={{ my: 2, display: 'flex' }}>
                        <Input
                          sx={{ '& input': {textAlign: 'center'}, flex: 1 }}
                          value={gte ? gte : minPrice}
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
                          value={lte ? lte : maxPrice}
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
                        value={value}
                        onChange={handleChangePrice}
                        min={minPrice}
                        max={maxPrice}
                        disabled={isFilterApplied}
                      />
                    </Box>
                  <Box>
                  <Button variant='outlined' onClick={setPriceFilter}>set price</Button>
                  </Box>
                </Toolbar>
                <Toolbar>
                  <FilterRow items={brandFilter.length > 0 ? brandFilter : newBrands} title={"Brands"} handleChange={handleChangeBrand} />
                </Toolbar>
                <Toolbar>
                  <FilterRow items={subCat.length > 0 ? subCat : newSubCat} title={"Categories"} handleChange={handleChangeSubCat} />
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
                    countProducts={pages}
                    handleChange={handleChangeBrand}
                    brandFilter={brandFilter}
                    subCat={subCat}
                    handleChangeSubCat={handleChangeSubCat}
                  />
                  <ToggleButtons handleChangeView={handleChangeView} view={view} />
                  <SelectSort sortHandler={sortHandler} />
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
                {renderChipsBrand()} {renderChips()} {renderChipPrice()}
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
                            src={prod.images.length > 1 ? `${prod.images.slice(1, 2).map(img => img.image)}` : '/images/no-image.jpg'}
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
                  <SelectPages values={['6', '12', '24', '36']} sx={{order: 2}} pageSize={pageSize} pageSizeHandler={pageSizeHandler}  />
                  {
                    products.length === 0 ?
                    <Typography sx={{ m: {xs: 'auto', sm: 0}, flexGrow: 1, fontSize: {xs: '12px', sm: '16px'}, textAlign: {xs: 'center', sm: 'left'}, width: {xs: '100%', sm: 'auto'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    "No products"
                    </Typography>
                    :
                    <Typography sx={{ m: {xs: 'auto', sm: 0}, fontSize: {xs: '12px', sm: '16px'}, flexGrow: 1, textAlign: {xs: 'center', sm: 'left'}, width: {xs: '100%', sm: 'auto'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
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
  );
}