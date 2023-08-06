import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, Divider, FormHelperText, Rating, TextField, TextareaAutosize } from '@mui/material';
// import { io } from 'socket.io-client';
import axios from 'axios';
import { Store } from '../utils/Store';
import pusherClient from '../utils/client/pusher';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

// const socket = io('/api/products/comment/', { path: '/api/products/comment/socket.io' }); // Podešavanje putanje za socket.io

export default function ProductTabs({ product, setRatings, setNumReviews, setSumReviews, slug }) {
  const productID = product._id;
  const theme = useTheme();
  const { state, dispatch } = React.useContext(Store);
  const { userInfo, snack } = state;
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [updateEmail, setUpdateEmail] = React.useState('');
  const [updateName, setUpdateName] = React.useState('');
  const [updateReplay, setUpdateReplay] = React.useState('');
  const [updateRating, setUpdateRating] = React.useState('');
  const [showForm, setShowForm] = React.useState(false);
  const [errors, setErrors] = React.useState({
    email: false,
    authorName: false,
    content: false,
    rating: false
  });
  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const [comments, setComments] = React.useState([]);
  const [replyCommentId, setReplyCommentId] = React.useState('false');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({ ...errors, email: false, authorName: false, replay: false, rating: false });
    try {
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        slug: formOutput.get('slug'),
        email: formOutput.get('email'),
        authorName: formOutput.get('authorName'),
        content: formOutput.get('content'),
        rating: Number(formOutput.get('rating')),
        isAdminReply: formOutput.get('isAdminReply') === 'true',
        replyCommentId: formOutput.get('replyCommentId')
      };
      if(!pattern.test(formData.email)) {
        setErrors({
          email: true,
          authorName: false,
          content: false,
          rating: false
        });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "email is not valid", severity: "error" }});
        return;
      }
      if(formData.email === '') {
        setErrors({
          email: true,
          authorName: false,
          content: false,
          rating: false
        });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "email is required", severity: "error" }});
        return;
      }
      if(formData.authorName === '') {
        setErrors({
          email: false,
          authorName: true,
          content: false,
          rating: false
        });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "name is required", severity: "error" }});
        return;
      }
      if(formData.replyCommentId !== 'false' || !userInfo) {
        console.log(formData);
        const { data } = await axios.post(`/api/comments/${slug}`, formData);
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully send review', severity: 'success'}});
      }else {
        if(formData.rating === 0) {
          setErrors({
            email: false,
            authorName: false,
            content: false,
            rating: true
          });
          dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "please leave a rating", severity: "error" }});
          return;
        } else {
          const { data } = await axios.post(`/api/comments/${slug}`, formData);
          dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully send review', severity: 'success'}});
        }
      }
      setUpdateEmail('');
      setUpdateName('');
      setUpdateReplay('');
      setUpdateRating('');
    } catch (error) {
      console.log(error);
    }
    setShowForm(false);
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

  function handleChangeRating(e) {
    setUpdateRating(e.target.value);
  }

  // const fetchComments = async () => {
  //   try {
  //     const { data } = await axios.get('/api/products/comment');
  //     setComments(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // React.useEffect(() => {
  //   if(loading) return;
  //   setLoading(true);
    
  //   try {
  //     fetchComments();
  //   } catch (error) {
  //     console.log(`Error loading comments ${error}`);
  //   }

  //   socket.on('newComment', (newComment) => {
  //     setComments((prevComments) => [...prevComments, newComment]);
  //   });
  //   setLoading(false);
  //   return () => {
  //     socket.off('comment');
  //   };

  // }, [loading]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/${slug}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  React.useEffect(() => {
    // Fetch existing comments from the server on page load
    fetchComments();
  }, [slug]);

  React.useEffect(() => {
    // Function to handle new comments received from Pusher
    const handleNewComment = (newComment) => {
      setComments((prevComments) => [...prevComments, newComment]);
    };

    // Subscribe to the 'new-comment' event from Pusher
    const channel = pusherClient.subscribe('comments');
    channel.bind('new-comment', handleNewComment);

    // Clean up the event listener when the component is unmounted
    return () => {
      channel.unbind('new-comment', handleNewComment);
    };
  }, []);

  React.useEffect(() => {
    showReview();
  }, [comments]);

  function showReview() {
    if (comments) {
      const onlyReviews = comments.filter(review => review.replyCommentId === 'false' && review.rating !== 0);
  
      const sum = onlyReviews.map(item => item.rating).reduce((partialSum, a) => partialSum + a, 0);
  
      setRatings(onlyReviews.map(item => item.rating))
      setNumReviews(onlyReviews.map(item => item.rating).length);
      setSumReviews(sum);
    }
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  function handleShowForm(id) {
    setShowForm(true);
    setReplyCommentId(id);
  }

  function handleCloseForm() {
    setShowForm(false);
  }
  console.log(comments);

  return (
    <Box sx={{ bgcolor: 'background.paper', width: '100%' }}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Description" {...a11yProps(0)} />
          <Tab label="Details" {...a11yProps(1)} />
          <Tab label="Reviews" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Typography gutterBottom variant="p" component="p" align="left" color="secondary.lightGray" sx={{marginRight: 1}}>
          {product.description}
          </Typography>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          {
            product.details.map(detail => (
              <Box key={detail._id}>
                <Typography>{detail.attribute}</Typography>
                <Typography>{detail.detail}</Typography>
              </Box>
            ))
          }
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          {
            comments && comments.length !== 0 && 
            <Box className='comments-area' sx={{bgcolor: theme.palette.badge.bgdLight, p: 3}}>
              {
                comments.map((comment) => (
                  comment.replyCommentId === 'false' && comment.slug === slug &&
                <Box key={comment._id}>
                  <Typography sx={{py: 1}}>{comment.authorName}</Typography>
                  <Divider />
                  {
                    comment.rating !== 0 &&
                    <Box sx={{ mt: 3 }}>
                      <Rating
                        name="rating"
                        value={comment.rating}
                      />
                    </Box>
                  }
                  <Typography sx={{py: 1}}>{comment.content}</Typography>
                  <Button size='small' sx={{ mb: 3 }} variant='outlined' onClick={() => handleShowForm(comment._id)}>
                    Reply
                  </Button>
                  {
                    comments
                    .filter((childComment) => childComment.replyCommentId === comment._id)
                    .map((childComment) => (
                      <Box className="reply" key={childComment._id} sx={{bgcolor: childComment.isAdminReply ? theme.palette.primary.white : theme.palette.primary.bgdLight, p: 3, mb: 1}}>
                        <Typography sx={{py: 1}}>{childComment.isAdminReply ? childComment.authorName + ' (admin)' : childComment.authorName}</Typography>
                        <Divider />
                        <Typography sx={{py: 1}}>{childComment.content}</Typography>
                        <Button size='small' sx={{ mb: 3 }} variant='outlined' onClick={() => handleShowForm(comment._id)}>
                          Reply
                        </Button>
                      </Box>
                    ))
                  }
                  {
                    showForm && replyCommentId === comment._id && (
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
                    <input type="hidden" name="productId" id="productId" value={productID} />
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
                  userInfo && userInfo.isAdmin !== true &&
                  <Box sx={{ mt: 5 }}>
                    <Typography component="legend">Rating</Typography>
                    <Rating
                      name="rating"
                      value={userInfo ? updateRating : 0}
                      onChange={handleChangeRating}
                    />
                  </Box>
                }
                {
                  errors.rating && 
                  <FormHelperText error>{snack.message}</FormHelperText>
                }
                {
                  userInfo ?
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 3 }}>
                    <Box sx={{ display: 'flex',flexWrap: 'wrap', flex: {xs: '0 0 100%', lg: 1}, pr: {xs: 0, lg: 3} }}>
                      <input
                        type='hidden'
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
                        value={userInfo.email}
                        
                      />
                      {
                        errors.email && 
                        <FormHelperText error>{snack.message}</FormHelperText>
                      }
                    </Box>
                    <Box sx={{display: 'flex',flexWrap: 'wrap', flex: 1}}>
                      <input
                        margin="normal"
                        required
                        fullWidth
                        name="authorName"
                        label="Name"
                        type="hidden"
                        id="authorName"
                        autoComplete="first-name"
                        error={errors.authorName}
                        onChange={handleChangeName}
                        value={userInfo.name}
                      />
                      {
                        errors.authorName && 
                        <FormHelperText error>{snack.message}</FormHelperText>
                      }
                    </Box>
                  </Box>
                  :
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
                  <FormHelperText error>{'Replay is required'}</FormHelperText>
                }
                <input type="hidden" name="slug" id="slug" value={ slug } />
                <input type="hidden" name="isAdminReply" id="isAdminReply" value={ userInfo && userInfo.isAdmin ? 'true' : 'false' } />
                <input type="hidden" name="productId" id="productId" value={productID} />
                <input type="hidden" name="replyCommentId" id="replyCommentId" value={'false'} />
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
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
