import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, Container, Divider, Grid, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import Image from 'next/image';
import db from '../../../src/utils/db';
import Blog from '../../../models/Blog';
import BreadcrumbNav from '../../../src/assets/BreadcrumbNav';
import styled from '@emotion/styled';
import { alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';
import theme from '../../../src/theme';
import Link from '../../../src/Link';

const PAGE_SIZE = 6;

export async function getServerSideProps(context) {
  const { params, query } = context;
  const { slug } = params;

  const category = query.category || '';
  const subCategory = query.subCategory || '';
  const searchQueary = query.query || '';
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const sort = query.sort || '';
  const tag = query.tag || '';

  const queryFilter = 
    searchQueary && searchQueary !== ''
    ? {
      title: {
        $regex: searchQueary,
        $options: 'i'
      }
    }
    : {}; 

    const order = 
    sort === 'namelowest'
    ? { title: 1 }
    : sort === 'namehighest'
    ? { title: -1 } 
    : sort === 'latest'
    ? { createdAt: -1 }
    : { _id: -1 };
  
  const categories = await Blog.find().distinct('category');
  const subCategories = await Blog.find().distinct('subCategory');
  const tagsFilter = tag.length !== 0 ? { 'tags.tag': tag } : {};
    
    const blogDocs = await Blog.find(
      {
        ...queryFilter,
        ...tagsFilter,
      },
    ).sort(order).skip(pageSize * (page - 1)).limit(pageSize).lean();
    const blogDocsByCategory = blogDocs.filter(prod => slug[1] !== undefined ? prod.subCategory === slug[1] : prod.category === slug[0]);

  await db.connect();

  const blogs = blogDocsByCategory.map(db.convertDocToObject);
  const blog = await Blog.findOne({slug}).lean();

  await db.disconnect();
  return {
    props: {
      blogs,
      blog: db.convertDocToObject(blog),
      subCategories,
      categories,
      slug
    },
  };
}

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', px: 1, transform: 'scale(2)' }}
  >
    {"•"}
  </Box>
);

const Search = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: 'auto',
  [theme.breakpoints.down('sm')]: {
    marginLeft: theme.spacing(0),
    width: '100%',
  },
  border: 'thin solid lightGrey',
  boxSizing: 'border-box',
  display: 'flex',
  margin: '.2rem 0' 
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '22ch',
      },
    },
  },
}));

const StyledInputButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.main,
  margin: '-1px',
  padding: '.5em 2em',
  '&:hover': {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.secondary.main,
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  },
}));

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.default,
  border: 'thin solid lightGrey',
  borderLeft: '3px solid black',
  marginLeft: '10px',
}));


export default function SinglePost(props) {
  const router = useRouter();

  const {
    query = '',
    sort = '',
    pageSize = 40,
    page = 1
  } = router.query;

  const { slug, blog, blogs, categories, subCategories } = props;

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(blog.createdAt);
  const formatDate = date.toLocaleDateString("en-US", options);
  const [searchQueary, setSearchQuery] = React.useState('');
  const [searchFilter, setSearchFilter] = React.useState([]);

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

  const submitHandler = (e) => {
    e.preventDefault();
    const queryRemoveSpace = `${searchQueary.replace(/ /g, '+')}`;
    const addQuery = `query=${queryRemoveSpace}`;
    router.push(`/blog?${addQuery}`);
  };

  const searchHandler = (item) => {
    if(item) {
      setSearchFilter([item])
    }else {
      setSearchFilter([])
    }
    filterSearch({ query: item});
  };

  React.useEffect(() => {
    searchHandler(query);
  }, [query]);

  return (
    <Grid container spacing={3} sx={{my: 5}}>
      <Grid item xs={12} lg={9}>
        <Box sx={{ '& a': {textDecoration: 'none' }, '&:hover a': {textDecoration: 'none' } }}>
          <Container maxWidth="xl">
            <BreadcrumbNav blogPost={blog.title} />
            <Box component="section" sx={{my: 5}}>
              <Box sx={{display: 'flex', justifyContent: 'center', pb: 3}}>
                <Box sx={{ position: 'relative!important', width: {xs: '200px', md: '500px'}, height: {xs: '200px', md: '300px'}, '& > img': {objectFit: 'contain'}}}>
                  <Image
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    src={blog.images[0].image}
                    alt={blog.title}
                    quality={75}
                    loading="eager"
                  />
                </Box>
              </Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{fontWeight: 'bold'}}>
                {blog.title}
              </Typography>
              <Box component="span" variant="caption">
                {blog.category}{bull}
              </Box>
              <Box component="span" variant="caption">
                {blog.subCategory}{bull}
              </Box>
              <Box component="span" variant="caption">
                {formatDate}
              </Box>
              <Box sx={{p: 0, py: 1}}>
                <Divider />
              </Box>
              <Typography variant="p" component="p" gutterBottom>
                {blog.description}
              </Typography>
            </Box>
          </Container>
        </Box>
      </Grid>
      <Grid xs={12} lg={3}>
        <Box sx={{my: 5}} className='sidebar' component="section">
          <Box component="nav">
            <Box sx={{py: 1, display: 'flex', justifyContent: 'left', flexWrap: 'wrap'}}>
              <Search component="form" onSubmit={submitHandler}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                />
                <StyledInputButton type='submit'>Search</StyledInputButton>
              </Search>
            </Box>
          </Box>
          {/* Categories */}
          <Box component="nav">
            <Box sx={{py: 1, display: 'flex', justifyContent: 'left', flexWrap: 'wrap', borderBottom: `thin solid ${theme.palette.badge.bgd}`}}>
              <Typography color="secondary.lightGrey" component="h3" variant='h6'>Categories</Typography>
            </Box>
            <List sx={{ '& a': {textDecoration: 'none'} }}>
              {
                categories.map(cat => (
                <Link color='secondary.lightGrey' key={cat} href={`/blog/category/${cat}`}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemText primary={cat} />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </Link>
                ))
              }
              {
                subCategories.map((sub, i) => (
                <Link color='secondary.lightGrey' key={sub} href={`/blog/category/${categories[i]}/${sub}`}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemText primary={sub} />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </Link>
                ))
              }
            </List>
          </Box>
          {/* Tags */}
          <Box component="nav">
            <Box sx={{py: 1, display: 'flex', justifyContent: 'left', flexWrap: 'wrap', borderBottom: `thin solid ${theme.palette.badge.bgd}`}}>
              <Typography color="secondary.lightGrey" component="h3" variant='h6'>Tags</Typography>
            </Box>
            <List sx={{ '& a': {textDecoration: 'none'} }}>
              {
                blog.tags.map(tag => (
                  <Link key={tag._id} href={`/blog?tag=${tag.tag}`}>
                    <LabelButton sx={{width: { xs: '100%', sm: 'auto'}, my: .5}}>
                      {tag.tag}
                    </LabelButton>
                  </Link>
                ))
              }   
            </List>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}