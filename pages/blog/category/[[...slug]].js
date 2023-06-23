import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Card, CardActionArea, CardContent, CardMedia, Chip, CircularProgress, Input, ListItem, Pagination, Slider, Stack, Typography } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import Rating from '@mui/material/Rating';
import IconButton from '@mui/material/IconButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import LoadingButton from '@mui/lab/LoadingButton';
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useRouter } from 'next/router';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { Collapse } from '@mui/material';
import Blog from '../../../models/Blog';
import db from '../../../src/utils/db';
import Link from '../../../src/Link';
import SelectSort from '../../../src/assets/SelectSort';
import BreadcrumbNav from '../../../src/assets/BreadcrumbNav';
import theme from '../../../src/theme';
import SelectPages from '../../../src/assets/SelectPages';

const PAGE_SIZE = 6;
let subCatArray = [];

export async function getServerSideProps(context) {
  const { params, query } = context;
  const { slug } = params;

  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || '';
  const subCategory = query.subCategory || '';
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

  const order = 
    sort === 'namelowest'
    ? { title: 1 }
    : sort === 'namehighest'
    ? { title: -1 } 
    : sort === 'latest'
    ? { createdAt: -1 }
    : { _id: -1 };

  await db.connect();

    const subCategories = await Blog.find().distinct('subCategory');
    
    const productDocs = await Blog.find(
      {
        ...queryFilter,
        ...categoryFilter,
        ...subCategoryFilter
      },
    ).sort(order).skip(pageSize * (page - 1)).limit(pageSize).lean();
    const productDocsByCategory = productDocs.filter(prod => slug[1] !== undefined ? prod.subCategory === slug[1] : prod.category === slug[0]);

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
        subCategories,
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
  const isNotCat = router.pathname !== '/blog/category/[[...slug]]';
  const {
    query = '',
    sort = '',
    pageSize = 40,
    page = 1
  } = router.query;

  const { slug, products, countProducts, categories, subCategories, brands, pages } = props;

  const filterSearch = ({
    page,
    pageSize,
    category,
    subCategory,
    sort,
    searchQueary
  }) => {
    const { query } = router;
    if(pageSize) query.pageSize = pageSize;
    if(page) query.page = page;
    if(searchQueary) query.searchQueary = searchQueary;
    if(category) query.category = category;
    if(subCategory) query.subCategory = subCategory.toString().replace(/-/g, ' ');
    if(sort) query.sort = sort;

    router.push({
      pathname: router.pathname,
      query: query
    })
  }

  const pageSizeHandler = (num) => {
    filterSearch({ pageSize: num })
  }
  const pageHandler = (page) => {
    filterSearch({ page });
  };
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };

  const [selected, setSelected] = React.useState('');
  const currentPage = [...Array(pages).keys()].map(pageNumber => pageNumber + 1);

  const handlePageChange = (event, value) => {
    pageHandler(value);
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
      <BreadcrumbNav blogData={slug} />
      <Grid container spacing={2}>
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
                  <SelectSort isNotCat={isNotCat} sort={sort} sortHandler={sortHandler} />
                </Toolbar>
              </AppBar>
            </Grid>
        {
          products.map(prod => (
            <Grid key={prod._id} item xs={12}>
                <Card sx={{ width: "100%", height: "100%", display: 'flex' }}>
                    <CardActionArea sx={{position: 'relative', width: '100%', display: 'flex', '& a': { width: '100%', textDecoration: 'none'} }}>
                      <Link sx={{position: 'relative', display: 'flex', flex: 0, flexWrap: {xs: 'wrap', md: 'nowrap'} }} href={`/blog/post/${prod.slug}`} onClick={() => handleLoading(prod)}>
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
                        <CardContent sx={{display: 'flex', flex: {xs: '0 0 100%', md: '0 0 75%'}, flexWrap: 'wrap'}}>
                          <Typography sx={{width: '100%'}} gutterBottom variant="h6" component="h3" align="left">
                          {prod.title}
                          </Typography>
                          <Typography align="justify" variant="body2" color="text.secondary">
                            {prod.shortDescription}
                          </Typography>
                        </CardContent>
                      </Link>
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