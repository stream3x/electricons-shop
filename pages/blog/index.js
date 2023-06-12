import { AppBar, Box, Button, Card, CardActionArea, CardContent, CardMedia, Container, Grid, Pagination, Stack, Toolbar, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import theme from '../../src/theme'
import Image from 'next/image'
import Link from '../../src/Link';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import Blog from '../../models/Blog';
import db from '../../src/utils/db';
import SelectPages from '../../src/assets/SelectPages';

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.default,
  border: 'thin solid lightGrey',
  borderLeft: '3px solid black',
  marginLeft: '10px',
}));

const PAGE_SIZE = 6;

export async function getServerSideProps({ query }) {
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

  const categoryFilter = category && category !== '' ? { category } : {};
  const subCategoryFilter = subCategory && subCategory !== '' ? { subCategory } : {};

    const order = 
    sort === 'namelowest'
    ? { name: 1 }
    : sort === 'namehighest'
    ? { createdAt: -1 }
    : { _id: -1 };

    await db.connect();
    const categories = await Blog.find().distinct('category');
    const subCategories = await Blog.find().distinct('subCategory');
    const blogDocs = await Blog.find(
      {
        ...queryFilter,
        ...categoryFilter,
        ...subCategoryFilter
      },
    ).sort(order).skip(pageSize * (page - 1)).limit(pageSize).lean();

    const countBlogs = await Blog.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...subCategoryFilter
    });

    await db.disconnect();
    const blogs = blogDocs.map(db.convertDocToObject);

    return {
      props: {
        pageSize,
        blogs,
        countBlogs,
        page,
        pages: Math.ceil(countBlogs / pageSize),
        categories,
        subCategories
      }
    }
}

export default function BlogPages(props) {
  const [topCat, setTopCat] = React.useState();
  const [subCat, setSubCat] = React.useState();
  const [searchFilter, setSearchFilter] = React.useState([]);

  const router = useRouter();
  const {
    query = '',
    category = '',
    subCategory = '',
    sort = '',
    pageSize = 6,
    page = 1
  } = router.query;

  const { slug, blogs, countBlogs, categories, subCategories, pages } = props;
console.log(categories);
  const filterSearch = ({
    page,
    pageSize,
    category,
    subCategory,
    sort,
    min,
    max,
    searchQueary
  }) => {
    const { query } = router;
    if(pageSize) query.pageSize = pageSize;
    if(page) query.page = page;
    if(searchQueary) query.searchQueary = searchQueary;
    if(category) query.category = category;
    if(subCategory) query.subCategory = subCategory.toString().replace(/-/g, ' ');
    if(sort) query.sort = sort;
    if(min) query.min ? query.min : query.min === 0 ? 0 : min;
    if(max) query.max ? query.max : query.max === 0 ? 0 : max;

    router.push({
      pathname: router.pathname,
      query: query
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
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };

  const handleDelete = () => {
    router.push('/blog');
  }
  
  return (
    <Box sx={{ my: 4 }}>
      <Box sx={{height: '600px'}}>
        <Box sx={{ bgcolor: theme.palette.primary.main, position: 'absolute', width: '100%', left: '-50%', marginLeft: '50%', marginTop: '-3rem', py: '4rem', px: '1.5rem', height: '500px' }}>
          <Container maxWidth="xl">
            <Box sx={{display: 'flex'}}>
              <Box sx={{ position: 'relative', width: '500px', height: '500px'}}>
                <Image
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  src='/images/amd_desktop/desktop_ryzen.png'
                  alt="amd desktop"
                  quality={75}
                  loading="eager"
                />
              </Box>
              <Box sx={{flexGrow: 1, my: 'auto', ml: '8rem'}}>
                <Typography component="p" variant="h6" color={theme.palette.primary.contrastText}>Gaming 4K*</Typography>
                <Typography component="h1" variant="h2" color={theme.palette.primary.contrastText} sx={{fontWeight: 'bolder'}}>Desktops Computer</Typography>
                <Typography sx={{pt: '2rem'}} component="p" variant="h6">#GamingTechMarket</Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
      <Box component="section" sx={{py: 1, display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
        <Typography sx={{width: '100%', textAlign: 'center', p: 3}} component="h2" variant='h4'>
          Categories
        </Typography>
        {
          categories.map(cat => (
          <LabelButton key={cat._id} onClick={() => categoryHandler(cat)} sx={{width: { xs: '100%', sm: 'auto'}, my: .5}}>
            {cat}
          </LabelButton>
          ))
        }
        {
          subCategories.map(cat => (
          <LabelButton key={cat._id} onClick={() => subCategoryHandler(cat)} sx={{width: { xs: '100%', sm: 'auto'}, my: .5}}>
            {cat}
          </LabelButton>
          ))
        }
        <LabelButton onClick={handleDelete} sx={{width: { xs: '100%', sm: 'auto'}, my: .5}}>
          {'All'}
        </LabelButton>
      </Box>
      <Box component="section" sx={{mt: 5}}>
        <Container maxWidth="xl">
          <Grid container spacing={0}>
            {
              blogs.map(blog => (
                <Grid sx={{display: {xs: 'none', md: 'block'}}} key={blog._id} item xs={12}>
                    <Card sx={{ width: "100%", height: "100%", display: 'flex', boxShadow: 'none!important' }}>
                        <CardActionArea sx={{position: 'relative', width: '100%', display: 'flex', '& a': { width: '100%'} }}>
                          <Link sx={{position: 'relative', display: 'flex', flex: 0}} href={`/post/${blog.slug}`}>
                            <CardMedia sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%','& img': {objectFit: 'contain', width: 'unset!important', height: '168px!important', position: 'relative!important', p: 2} }} component="div">
                              <Image
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority
                                src={blog.images[0].image}
                                alt={blog.title}
                                quality={35}
                              />
                            </CardMedia>
                          </Link>
                          <CardContent sx={{display: 'flex', flex: '0 0 75%', flexWrap: 'wrap'}}>
                            <Typography sx={{width: '100%'}} gutterBottom variant="h6" component="h3" align="left">
                            {blog.title}
                            </Typography>
                            <Typography align="left" variant="body2" color="text.secondary">
                              {blog.shortDescription}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
              ))
            }
            <Grid item xs={12}>
              <AppBar elevation={1} sx={{bgcolor: theme.palette.primary.white}} position="static">
                <Toolbar sx={{display: 'flex', flexWrap: 'wrap'}}>
                  <SelectPages values={['6', '12', '24']} pageSize={pageSize} pageSizeHandler={pageSizeHandler}  />
                  {
                    blogs.length === 0 ?
                    <Typography sx={{ m: {xs: 'auto', sm: 0}, ml: 2, flexGrow: 1, fontSize: {xs: '12px', sm: '16px'}, textAlign: {xs: 'center', sm: 'left'}, py: 3, width: {xs: '100%', sm: 'auto'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    "No products"
                    </Typography>
                    :
                    <Typography sx={{ m: {xs: 'auto', sm: 0}, ml: 2, fontSize: {xs: '12px', sm: '16px'}, flexGrow: 1, py: 3, width: {xs: '100%', sm: 'auto'}, textAlign: {xs: 'center', sm: 'left'} }} color="secondary" gutterBottom variant="p" component="p" align="left">
                    There are {blogs.length} {blogs.length === 1 ? "blog" : "blogs"}.
                  </Typography>
                  }
                  {
                    blogs.length > 0 &&
                    <Stack sx={{width: {xs: '100%', sm: 'auto'}, py: 2 }} spacing={2}>
                      <Pagination sx={{mx: 'auto'}} count={pages} color="primary" showFirstButton showLastButton onChange={(e, value) => pageHandler(value)}  />
                    </Stack>
                  }
                </Toolbar>
              </AppBar>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
