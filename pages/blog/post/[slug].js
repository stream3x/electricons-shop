import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Backdrop, Button, CircularProgress, Container, Divider, Grid, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import Image from 'next/image';
import db from '../../../src/utils/db';
import Blog from '../../../models/Blog';
import BreadcrumbNav from '../../../src/assets/BreadcrumbNav';
import { alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';
import theme from '../../../src/theme';
import Link from '../../../src/Link';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ReplyIcon from '@mui/icons-material/Reply';
import dynamic from 'next/dynamic';
import BlogComments from '../../../src/components/BlogComments';

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const categories = await Blog.find().distinct('category');
  const subCategories = await Blog.find().distinct('subCategory');

  const blog = await Blog.findOne({slug}).lean();
  await db.disconnect();

  return {
    props: {
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
    [theme.breakpoints.up('xl')]: {
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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  }));

function SinglePost(props) {
  const router = useRouter();

  const {
    query = '',
  } = router.query;

  const { slug, blog, categories, subCategories } = props;

  const [searchFilter, setSearchFilter] = React.useState([]);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(blog.createdAt);
  const formatDate = date.toLocaleDateString("en-US", options);
  const [searchQueary, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    // Always do navigations after the first render
    router.push(`/blog/post/${slug}?counter=10`, undefined, { shallow: true })
  }, []);
console.log(router.pathname);
  const filterSearch = ({
    category,
    subCategory,
    tag,
    searchQueary
  }) => {
    const { query } = router;
    if(searchQueary) query.searchQueary = searchQueary;
    if(category) query.category = category;
    if(subCategory) query.subCategory = subCategory.toString().replace(/-/g, ' ');
    if(tag) query.tag = tag.toString().replace(/-/g, ' ');

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


  if(!blog) {
    return (
      <Box sx={{ flexGrow: 1, my: 5, py: 5 }}>
      <BreadcrumbNav blogData={''}/>
        <Typography gutterBottom component="p" variant="h6" textAlign="center">
          Blog not found
        </Typography>
        <Grid container spacing={2} sx={{py: 3}}>
          <Grid xs={12}>
            <Item sx={{ '& a': {textDecoration: 'none' } }} elevation={0}>
              <Link noLinkStyle href="/" passHref>
                <Button sx={{ '&:hover': {color: theme.palette.secondary.main}}} size="large" startIcon={<ReplyIcon />}>
                  back to blog posts
                </Button>
              </Link>
            </Item>
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <Grid container spacing={3} sx={{my: 5}}>
      <Grid item xs={12} lg={9}>
        <Box sx={{ '& a': {textDecoration: 'none' }, '&:hover a': {textDecoration: 'none' } }}>
          <Container maxWidth="xl">
            <BreadcrumbNav blogPost={blog} />
            <Box component="section" sx={{my: 5, pb: 5}}>
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
            <BlogComments slug={slug} />
          </Container>
        </Box>
      </Grid>
      <Grid xs={12} lg={3}>
        <Box sx={{my: 5, px: 5}} className='sidebar' component="section">
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
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <Button sx={{position: 'absolute', bottom: '50%', left: '50%', transform: 'translate(-50%, -100px)'}} variant='outline' onClick={() => setIsLoading(false)}>Close</Button>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Grid>
  );
}

export default dynamic(() => Promise.resolve(SinglePost), { ssr: false });