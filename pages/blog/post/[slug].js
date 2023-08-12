import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Backdrop, Button, CircularProgress, Container, Divider, FormControlLabel, FormHelperText, Grid, List, ListItem, ListItemButton, ListItemText, TextField, TextareaAutosize } from '@mui/material';
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
import { useSession } from '../../../src/utils/SessionProvider';

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
  const { state, dispatch } = React.useContext(Store);
  const { userInfo, snack } = state;

  const {
    query = '',
    sort = '',
    pageSize = 40,
    page = 1
  } = router.query;

  const { slug, blog, blogs, categories, subCategories } = props;

  const { session } = useSession();
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
  const [replyCommentId, setReplyCommentId] = React.useState('false');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [anchor, setAnchor] = React.useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({ ...errors, email: false, authorName: false, replay: false});
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        email: formOutput.get('email'),
        slug: formOutput.get('slug'),
        authorName: formOutput.get('authorName'),
        content: formOutput.get('content'),
        isAdminReply: formOutput.get('isAdminReply') === 'true',
        blogPostId: formOutput.get('blogPostId'),
        replyCommentId: formOutput.get('replyCommentId')
      };
      if (session) {
        const { data } = await axios.post(`/api/blog/postComment/${slug}`, formData);
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully send replay', severity: 'success'}});
        setUpdateEmail('');
        setUpdateName('');
        setUpdateReplay('');
      } else {
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
        const { data } = await axios.post(`/api/blog/postComment/${slug}`, formData);
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully send replay', severity: 'success'}});
        setUpdateEmail('');
        setUpdateName('');
        setUpdateReplay('');
      }
    } catch (error) {
      console.log(error);
    }finally {
      setIsSubmitting(false); // Reset the submission flag
    }
    setShowForm(false);
    setReplyCommentId('false');
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

  function handleShowForm(id, index) {
    setShowForm(true);
    setAnchor(index);
    setReplyCommentId(id);
  }

  function handleCloseForm() {
    setShowForm(false);
    setReplyCommentId('false');
  }

  React.useEffect(() => {
    searchHandler(query);
  }, [query]);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/blog/getComment/${slug}`);
      setComments(data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    // Fetch existing comments from the server on page load
    fetchComments();
  }, []);

  React.useEffect(() => {
    // Fetch existing comments from the server on page load
    if (isSubmitting) {
      setTimeout(() => {
        fetchComments();
        setIsLoading(false);
      }, 1500);
    }


    return () => {
      setErrors({ ...errors, email: false, authorName: false, replay: false, rating: false, content: false });
    }

  }, [isSubmitting]);

  if(!blog) {
    return (
      <Box sx={{ flexGrow: 1, my: 4  }}>
        <Typography gutterBottom variant="h6" component="h3" textAlign="center">
          Blog not found
        </Typography>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <Item>
              <Link href="/blog?counter=10">
                <Button variant="contained" startIcon={<ReplyIcon />}>
                  back to Blogs
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
            <Box>
          {
            comments && comments.length !== 0 && 
            <Box className='comments-area' sx={{bgcolor: theme.palette.badge.bgdLight, p: 3}}>
              {
                comments.map((comment, index) => (
                  comment.replyCommentId === 'false' &&
                <Box key={comment._id}>
                  <Typography sx={{py: 1}}>{comment.authorName}</Typography>
                  <Divider />
                  <Typography sx={{py: 1}}>{comment.content}</Typography>
                  <Button size='small' sx={{ mb: 3 }} variant='outlined' onClick={() => handleShowForm(comment._id, index)}>
                    Reply
                  </Button>
                  {
                    showForm && anchor === index && (
                      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    {
                      userInfo ?        
                      <Box sx={{flexWrap: 'wrap'}}>
                        <input
                          type='hidden'
                          margin="normal"
                          required
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          autoFocus
                          error={errors.email}
                          onChange={handleChangeEmail}
                          value={userInfo.email}
                          sx={{width: {xs: '100%', lg: '50%'}, pr: {xs: 0, lg: 3}}}
                        />
                        {
                          errors.email && 
                          <FormHelperText error>{snack.message}</FormHelperText>
                        }
                        <input
                          type="hidden"
                          margin="normal"
                          required
                          name="authorName"
                          label="Name"
                          id="authorName"
                          autoComplete="first-name"
                          error={errors.authorName}
                          onChange={handleChangeName}
                          value={userInfo.name}
                          sx={{width: {xs: '100%', lg: '50%'}}}
                        />
                        {
                          errors.authorName && 
                          <FormHelperText error>{snack.message}</FormHelperText>
                        }
                      </Box>
                      :
                      <Box sx={{ display: 'flex', flexWrap: 'wrap'}}>
                        <Box sx={{width: {xs: '100%', lg: '50%'}, pr: {xs: 0, lg: 3}, pb: {xs: 0, lg: 1}}}>
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
                            fullWidth
                          />
                          {
                            errors.email && 
                            <FormHelperText error>{snack.message}</FormHelperText>
                          }
                        </Box>
                        <Box sx={{width: {xs: '100%', lg: '50%'}, pr: 0, pb: 1}}>
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
                            fullWidth
                          />
                          {
                            errors.authorName && 
                            <FormHelperText error>{snack.message}</FormHelperText>
                          }
                        </Box>
                      </Box>
                    }
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
                    <input type="hidden" name="slug" id="slug" value={ slug && slug } />
                    <input type="hidden" name="replyCommentId" id="replyCommentId" value={replyCommentId ? replyCommentId : 'false'} />
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mt: 3, mb: 2, '&:hover': {backgroundColor: theme.palette.secondary.main} }}
                    >
                      Submit
                    </Button>
                  </Box>
                    )
                  }
                  {
                    comments
                    .filter((childComment) => childComment.replyCommentId === comment._id)
                    .map((childComment, index) => (
                      <Box className="reply" key={childComment._id} sx={{bgcolor: childComment.isAdminReply ? theme.palette.primary.white : theme.palette.primary.bgdLight, p: 3, mb: 1}}>
                        <Typography sx={{py: 1}}>{childComment.isAdminReply ? childComment.authorName + ' (admin)' : childComment.authorName}</Typography>
                        <Divider />
                        <Typography sx={{py: 1}}>{childComment.content}</Typography>
                        <Button size='small' sx={{ mb: 3 }} variant='outlined' onClick={() => handleShowForm(comment._id, index)}>
                          Reply
                        </Button>
                        {
                          showForm && replyCommentId === comment._id && anchor === index && (
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                              {
                                userInfo ?        
                                <Box sx={{flexWrap: 'wrap'}}>
                                  <input
                                    type='hidden'
                                    margin="normal"
                                    required
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    error={errors.email}
                                    onChange={handleChangeEmail}
                                    value={userInfo.email}
                                    sx={{width: {xs: '100%', lg: '50%'}, pr: {xs: 0, lg: 3}}}
                                  />
                                  {
                                    errors.email && 
                                    <FormHelperText error>{snack.message}</FormHelperText>
                                  }
                                  <input
                                    type="hidden"
                                    margin="normal"
                                    required
                                    name="authorName"
                                    label="Name"
                                    id="authorName"
                                    autoComplete="first-name"
                                    error={errors.authorName}
                                    onChange={handleChangeName}
                                    value={userInfo.name}
                                    sx={{width: {xs: '100%', lg: '50%'}}}
                                  />
                                  {
                                    errors.authorName && 
                                    <FormHelperText error>{snack.message}</FormHelperText>
                                  }
                                </Box>
                                :
                                <Box sx={{ display: 'flex', flexWrap: 'wrap'}}>
                                  <Box sx={{width: {xs: '100%', lg: '50%'}, pr: {xs: 0, lg: 3}, pb: {xs: 0, lg: 1}}}>
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
                                      fullWidth
                                    />
                                    {
                                      errors.email && 
                                      <FormHelperText error>{snack.message}</FormHelperText>
                                    }
                                  </Box>
                                  <Box sx={{width: {xs: '100%', lg: '50%'}, pr: 0, pb: 1}}>
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
                                      fullWidth
                                    />
                                    {
                                      errors.authorName && 
                                      <FormHelperText error>{snack.message}</FormHelperText>
                                    }
                                  </Box>
                                </Box>
                              }
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
                              <input type="hidden" name="slug" id="slug" value={ slug && slug } />
                              <input type="hidden" name="replyCommentId" id="replyCommentId" value={replyCommentId ? replyCommentId : 'false'} />
                              <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 3, mb: 2, '&:hover': {backgroundColor: theme.palette.secondary.main} }}
                              >
                                Submit
                              </Button>
                            </Box>
                          )
                        }
                      </Box>
                    ))
                  }
                </Box>
                ))
                }
                </Box>
              }
              {
                showForm && 
                <Button sx={{ my: 3 }} onClick={handleCloseForm}>
                  Add New Comment
                </Button>
              }
              {
                !showForm &&
                <Box sx={{py: 5}}>
                  <Typography component="h2" variant="h5" sx={{ pb: .25, display: 'inline', borderBottom:  `3px solid ${theme.palette.primary.main}`}}>
                    Leave a Reply
                  </Typography>
                  <Divider />
                  <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                  {
                    userInfo ?        
                    <Box sx={{flexWrap: 'wrap'}}>
                      <input
                        type='hidden'
                        margin="normal"
                        required
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        error={errors.email}
                        onChange={handleChangeEmail}
                        value={userInfo.email}
                        sx={{width: {xs: '100%', lg: '50%'}, pr: {xs: 0, lg: 3}}}
                      />
                      {
                        errors.email && 
                        <FormHelperText error>{snack.message}</FormHelperText>
                      }
                      <input
                        type="hidden"
                        margin="normal"
                        required
                        name="authorName"
                        label="Name"
                        id="authorName"
                        autoComplete="first-name"
                        error={errors.authorName}
                        onChange={handleChangeName}
                        value={userInfo.name}
                        sx={{width: {xs: '100%', lg: '50%'}}}
                      />
                      {
                        errors.authorName && 
                        <FormHelperText error>{snack.message}</FormHelperText>
                      }
                    </Box>
                    :
                    <Box sx={{ display: 'flex', flexWrap: 'wrap'}}>
                      <Box sx={{width: {xs: '100%', lg: '50%'}, pr: {xs: 0, lg: 3}, pb: {xs: 0, lg: 1}}}>
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
                          fullWidth
                        />
                        {
                          errors.email && 
                          <FormHelperText error>{snack.message}</FormHelperText>
                        }
                      </Box>
                      <Box sx={{width: {xs: '100%', lg: '50%'}, pr: 0, pb: 1}}>
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
                          fullWidth
                        />
                        {
                          errors.authorName && 
                          <FormHelperText error>{snack.message}</FormHelperText>
                        }
                      </Box>
                    </Box>
                  }
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
                  <input type="hidden" name="slug" id="slug" value={ slug && slug } />
                  <input type="hidden" name="replyCommentId" id="replyCommentId" value={replyCommentId ? replyCommentId : 'false'} />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2, '&:hover': {backgroundColor: theme.palette.secondary.main} }}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            }
          </Box>
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