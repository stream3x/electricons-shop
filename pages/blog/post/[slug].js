import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, Container, Divider, FormControlLabel, FormHelperText, Grid, List, ListItem, ListItemButton, ListItemText, TextField, TextareaAutosize } from '@mui/material';
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
import { Store } from '../../../src/utils/Store';
import axios from 'axios';
import Comment from '../../../models/Comment';

const PAGE_SIZE = 6;

export async function getServerSideProps(context) {
  const { params, query } = context;
  const { slug } = params;
  
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
  const comments = await Comment.find().lean();
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
  const postComments = comments.map(db.convertDocToObject);

  await db.disconnect();
  return {
    props: {
      blogs,
      blog: db.convertDocToObject(blog),
      subCategories,
      categories,
      slug,
      postComments
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
  const { state, dispatch } = React.useContext(Store);
  const { userInfo, snack } = state;

  const {
    query = '',
    sort = '',
    pageSize = 40,
    page = 1
  } = router.query;

  const { slug, blog, blogs, categories, subCategories, postComments } = props;

  const blogID = blog._id;
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(blog.createdAt);
  const formatDate = date.toLocaleDateString("en-US", options);
  const [searchQueary, setSearchQuery] = React.useState('');
  const [searchFilter, setSearchFilter] = React.useState([]);
  const [updateEmail, setUpdateEmail] = React.useState('');
  const [updateName, setUpdateName] = React.useState('');
  const [updateReplay, setUpdateReplay] = React.useState('');
  const [showForm, setShowForm] = React.useState(false);
  const [errors, setErrors] = React.useState({
    email: false,
    authorName: false,
    content: false
  });
  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const [comments, setComments] = React.useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({ ...errors, email: false, authorName: false, replay: false});
    try {
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        email: formOutput.get('email'),
        authorName: formOutput.get('authorName'),
        content: formOutput.get('content'),
        isAdminReply: formOutput.get('isAdminReply') === 'true',
        parentCommentId: formOutput.get('parentCommentId')
      };
      if(!pattern.test(formData.email)) {
        setErrors({
          email: true,
          authorName: false,
          content: false
        });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "email is not valid", severity: "error" }});
        return;
      }
      if(formData.email === '') {
        setErrors({
          email: true,
          authorName: false,
          content: false
        });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "email is required", severity: "error" }});
        return;
      }
      if(formData.authorName === '') {
        setErrors({
          email: false,
          authorName: true,
          content: false
        });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "name is required", severity: "error" }});
        return;
      }
      if(formData.content === '') {
        setErrors({
          email: false,
          authorName: false,
          content: true
        });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "please leave a replay", severity: "error" }});
        return;
      }
      const { data } = await axios.post(`/api/blog/${blogID}`, formData);
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully send replay', severity: 'success'}});
      setUpdateEmail('');
      setUpdateName('');
      setUpdateReplay('');
    } catch (error) {
      console.log(error);
    }
  }

  function handleChangeEmail(e) {
    setUpdateEmail(e.target.value)
  }
  function handleChangeName(e) {
    setUpdateName(e.target.value)
  }

  function handleChangeReplay(e) {
    setUpdateReplay(e.target.value);
  }

  React.useEffect(() => {
    const eventSource = new EventSource('/api/blog/comment');

    eventSource.onmessage = (event) => {
      const newComment = JSON.parse(event.data);
      setComments((prevComments) => {
        // Filtriraj samo unikatne komentare na osnovu _id
        const filteredComments = prevComments.filter(
          (comment) => comment._id !== newComment._id
        );
        // Dodaj novi komentar na početak niza
        return [newComment, ...filteredComments];
      });
    };

    return () => {
      eventSource.close();
    };
  }, []);

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

  function handleShowForm() {
    setShowForm(prev => !prev);
  }

  React.useEffect(() => {
    searchHandler(query);
  }, [query]);
 
  return (
    <Grid container spacing={3} sx={{my: 5}}>
      <Grid item xs={12} lg={9}>
        <Box sx={{ '& a': {textDecoration: 'none' }, '&:hover a': {textDecoration: 'none' } }}>
          <Container maxWidth="xl">
            <BreadcrumbNav blogPost={blog.title} />
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
            {
              blog.comments && blog.comments.length !== 0 &&
              <Box className='comments-area' sx={{bgcolor: theme.palette.badge.bgdLight, p: 3}}>
                {
                  comments && comments.map(replay => (
                    replay.isAdminReply === false &&
                    <Box key={replay._id}>
                      <Typography color={theme.palette.primary.main}>{replay._id ? 'live' : ''}</Typography>
                      
                      <Typography>{replay.authorName}</Typography>
                      <Divider sx={{mt: 3, mb: 1}} />
                      <Typography>{replay.content}</Typography>
                      <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button
                          onClick={handleShowForm}
                          variant="contained"
                          sx={{ mt: 3, mb: 2, '&:hover': {backgroundColor: theme.palette.secondary.main} }}
                        >
                          Replay
                        </Button>
                      </Box>
                    </Box>
                  ))
                }
                
                <Box>
                {
                  blog.comments && blog.comments.length !== 0 &&
                  <Box>
                    {
                      postComments && postComments.map(replay => (
                        replay.isAdminReply === "true" &&
                        <Box key={replay._id} sx={{bgcolor: theme.palette.primary.white, p: 3}}>
                          <Typography>{replay.authorName}</Typography>
                          <Divider sx={{mt: 3, mb: 1}} />
                          <Typography>{replay.content}</Typography>
                          <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                          <Button
                            onClick={handleShowForm}
                            variant="contained"
                            sx={{ mt: 3, mb: 2, '&:hover': {backgroundColor: theme.palette.secondary.main} }}
                          >
                            Replay
                          </Button>
                          </Box>
                        </Box>
                      ))
                    }
                  </Box>
                }
                </Box>
                {
                  showForm &&
                  <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <Box sx={{flexWrap: 'wrap'}}>
                      <TextField
                        margin="normal"
                        required
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        error={errors.email}
                        onChange={handleChangeEmail}
                        value={updateEmail}
                        sx={{width: {xs: '100%', lg: '50%'}, pr: {xs: 0, lg: 3}}}
                      />
                      {
                        errors.email && 
                        <FormHelperText error>{snack.message}</FormHelperText>
                      }
                      <TextField
                        margin="normal"
                        required
                        name="authorName"
                        label="Name"
                        type="text"
                        id="authorName"
                        autoComplete="first-name"
                        error={errors.authorName}
                        onChange={handleChangeName}
                        value={updateName}
                        sx={{width: {xs: '100%', lg: '50%'}}}
                      />
                      {
                        errors.authorName && 
                        <FormHelperText error>{snack.message}</FormHelperText>
                      }
                    </Box>
                    <TextareaAutosize
                      name="content"
                      id='content'
                      required
                      placeholder="Content"
                      maxRows={10}
                      minRows={4}
                      onChange={handleChangeReplay}
                      value={updateReplay}
                      aria-label="replay textarea"
                      style={{ width: '100%', resize: 'vertical', padding: '8px' }}
                    />
                    {
                      errors.content && 
                      <FormHelperText error>{'Content is required'}</FormHelperText>
                    }
                    <input type="hidden" name="isAdminReply" id="isAdminReply" value={ userInfo && userInfo.isAdmin ? 'true' : 'false' } />
                    <input type="hidden" name="parentCommentId" id="parentCommentId" value={null} />
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mt: 3, mb: 2, '&:hover': {backgroundColor: theme.palette.secondary.main} }}
                    >
                      Submit
                    </Button>
                  </Box>
                  
                }
              </Box>
            }
            {
              !showForm &&
              <Box sx={{py: 5}}>
                <Typography component="h1" variant="h5" sx={{mt: 5, pt: 5, display: 'inline', borderBottom:  `3px solid ${theme.palette.primary.main}`}}>
                  Leave a Reply
                </Typography>
                <Divider />
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 3 }}>
                    <Box sx={{ display: 'flex',flexWrap: 'wrap', flex: {xs: '0 0 100%', lg: 1}, pr: {xs: 0, lg: 3} }}>
                      <TextField
                        margin="normal"
                        fullWidth
                        required
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        error={errors.email}
                        onChange={handleChangeEmail}
                        value={updateEmail}
                        
                      />
                      {
                        errors.email && 
                        <FormHelperText error>{snack.message}</FormHelperText>
                      }
                    </Box>
                    <Box sx={{display: 'flex',flexWrap: 'wrap', flex: 1}}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="authorName"
                        label="Name"
                        type="text"
                        id="authorName"
                        autoComplete="first-name"
                        error={errors.authorName}
                        onChange={handleChangeName}
                        value={updateName}
                      />
                      {
                        errors.authorName && 
                        <FormHelperText error>{snack.message}</FormHelperText>
                      }
                    </Box>
                  </Box>
                  <TextareaAutosize
                    name="content"
                    id='content'
                    required
                    placeholder="Content"
                    maxRows={10}
                    minRows={4}
                    onChange={handleChangeReplay}
                    value={updateReplay}
                    aria-label="replay textarea"
                    style={{ width: '100%', resize: 'vertical', padding: '8px' }}
                  />
                  {
                    errors.content && 
                    <FormHelperText error>{'Replay is required'}</FormHelperText>
                  }
                  <input type="hidden" name="isAdminReply" id="isAdminReply" value={ userInfo && userInfo.isAdmin ? 'true' : 'false' } />
                  <input type="hidden" name="parentCommentId" id="parentCommentId" value={ blog._id } />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2, '&:hover': {backgroundColor: theme.palette.secondary.main}, width: '50%' }}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            }
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
    </Grid>
  );
}