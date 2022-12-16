import React, { useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Card, CardActionArea, CardContent, CardMedia, CircularProgress, Typography } from '@mui/material';
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

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const category = await Category.find({slug}).lean();
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

  return {
    props: {
      category: slug,
      categoryProducts: !emptyCategoryProducts && convertToJson(),
      subCategoryProducts: !emptySubCategoryProducts && convertToJson()
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
  const { category, categoryProducts, subCategoryProducts } = props;
  const { state, dispatch } = useContext(Store);
  const { snack, cart: {cartItems} } = state;
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = React.useState('');

  const handleLoading = (product) => {
    setSelected(product._id);
  };

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

  return (    
    <Box sx={{ flexGrow: 1, my: 4  }}>
      <BreadcrumbNav categoryData={category} />
      <Grid container spacing={2}>
        <Grid item sx={{display: {xs: 'none', sm: 'block'}}} sm={2}>
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
        <Grid item xs={12} sm={10}>
        {
          subCategoryProducts ?
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppBar elevation={1} sx={{bgcolor: theme.palette.primary.white}} position="static">
                <Toolbar>
                  {
                    subCategoryProducts.length === 0 ?
                    <Typography sx={{ m: 0 }} color="secondary" gutterBottom variant="p" component="p" textAlign="center">
                    "No products"
                    </Typography>
                    :
                    <Typography sx={{ m: 0 }} color="secondary" gutterBottom variant="p" component="p" textAlign="center">
                    There are {subCategoryProducts.length} {subCategoryProducts.length === 1 ? "product" : "products"}.
                  </Typography>
                  }
                  <ToggleButtons />
                  <SelectCategory />
                </Toolbar>
              </AppBar>
            </Grid>
            {subCategoryProducts.map(prod => (
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
          </Grid>
          :
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppBar elevation={1} sx={{bgcolor: theme.palette.primary.white}} position="static">
                <Toolbar>
                  {
                    categoryProducts.length === 0 ?
                    <Typography sx={{ m: 0 }} color="secondary" gutterBottom variant="p" component="p" textAlign="center">
                    "No products"
                    </Typography>
                    :
                    <Typography sx={{ m: 0 }} color="secondary" gutterBottom variant="p" component="p" textAlign="center">
                    There are {categoryProducts.length} {categoryProducts.length === 1 ? "product" : "products"}.
                  </Typography>
                  }
                  <ToggleButtons />
                  <SelectCategory />
                </Toolbar>
              </AppBar>
            </Grid>
          {categoryProducts.map(prod => (
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
          </Grid>
        }
        </Grid>
      </Grid>
    </Box>
  );
}