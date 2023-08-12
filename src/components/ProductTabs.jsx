import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Backdrop, Button, CircularProgress, Divider, FormHelperText, Rating, TextField, TextareaAutosize } from '@mui/material';
import { Store } from '../utils/Store';
import axios from 'axios';
import { useSession } from '../utils/SessionProvider';
import theme from '../theme';
import CommentIcon from '@mui/icons-material/Comment';

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

export default function ProductTabs({ product, setRatings, setNumReviews, setSumReviews, slug, comments, setComments }) {
  const { state, dispatch } = React.useContext(Store);
  const { userInfo, snack } = state;
  const { session } = useSession();
  const [value, setValue] = React.useState(0);
  const [replyCommentId, setReplyCommentId] = React.useState('false');
  const [showForm, setShowForm] = React.useState(false);
  const [anchor, setAnchor] = React.useState(0);
  const [updateEmail, setUpdateEmail] = React.useState('');
  const [updateName, setUpdateName] = React.useState('');
  const [updateReplay, setUpdateReplay] = React.useState('');
  const [updateRating, setUpdateRating] = React.useState('');
  const [errors, setErrors] = React.useState({
    email: false,
    authorName: false,
    content: false,
    rating: false
  });
  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const [hasPurchased, setHasPurchased] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({ ...errors, email: false, authorName: false, replay: false, rating: false, content: false });

    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setIsLoading(true);
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

      if (!hasPurchased && formData.rating === 0 && formData.content === '') {
        setErrors({
          email: false,
          authorName: false,
          content: true,
          rating: false
        });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "Content is required", severity: "error" }});
        return;
      }

      if (session) {
        if (hasPurchased && formData.rating === 0 && formData.replyCommentId !== 'false') {
          const { data } = await axios.post(`/api/products/postComments/${slug}`, formData);
          dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully send review', severity: 'success'}});
        }else if (hasPurchased && formData.rating === 0 && formData.replyCommentId === 'false') {
          setErrors({
            email: false,
            authorName: false,
            content: false,
            rating: true
          });
          dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "please leave a rating", severity: "error" }});
          return;
        } else {
          const { data } = await axios.post(`/api/products/postComments/${slug}`, formData);
          dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully send review', severity: 'success'}});
        }
      } else {
        if (!hasPurchased && formData.rating !== 0) {
          dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: "You cannot rate this product", severity: "error" }});
          return;
        }
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
        if(formData.replyCommentId !== 'false' || !session) {
          console.log(formData);
          const { data } = await axios.post(`/api/products/postComments/${slug}`, formData);
          dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully send review', severity: 'success'}});
        }
      }
      console.log('send comment');
      setUpdateEmail('');
      setUpdateName('');
      setUpdateReplay('');
      setUpdateRating('');
      console.log(formData);
    } catch (error) {
      console.log(error);
    }finally {
      setIsSubmitting(false); // Reset the submission flag
    }
    setShowForm(false);
    setReplyCommentId('false');
  }

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
    const fetchUserOrders = async () => {
      if (session) {
        try {
          const response = await axios.get('/api/orders/history', {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          });

          const userOrders = response.data;
          const purchasedProduct = userOrders.some((order) =>
            order.orderItems.some((item) => item.slug === product.slug)
          );

          setHasPurchased(purchasedProduct);
        } catch (error) {
          console.error('Error fetching user orders:', error);
        }
      }
    };

    fetchUserOrders();
  }, [session, product.slug]);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/products/getComments/${slug}`);

      setComments(data);
      console.log('fetch comment');
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  React.useEffect(() => {
    // Fetch existing comments from the server on page load
    fetchComments();
  }, [slug]);

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
              <Box key={detail._id} sx={{display: 'flex', alignItems: 'baseline'}}>
                <Typography variant='h6' component="h6">{detail.attribute}{':'}</Typography>
                <Typography sx={{pl: 3}}>{detail.detail}</Typography>
              </Box>
            ))
          }
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
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
                  <CommentIcon color='primary' sx={{ cursor: 'pointer' }} onClick={() => handleShowForm(comment._id, index)} />                  
                  {
                    showForm && anchor === index && (
                      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    {
                      hasPurchased &&
                      <Box sx={{ mt: 5, display: 'none' }}>
                        <Typography component="legend">Rating</Typography>
                        <Rating
                          name="rating"
                          value={0}
                          onChange={handleChangeRating}
                        />
                      </Box>
                    }
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
                        <CommentIcon color='primary' sx={{ cursor: 'pointer' }} onClick={() => handleShowForm(comment._id, index)} />
                        {
                          showForm && replyCommentId === comment._id && anchor === index && (
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                              {
                                hasPurchased &&
                                <Box sx={{ mt: 5, display: 'none' }}>
                                  <Typography component="legend">Rating</Typography>
                                  <Rating
                                    name="rating"
                                    value={0}
                                  />
                                </Box>
                              }
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
                    hasPurchased &&
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
        </TabPanel>
      </SwipeableViews>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <Button sx={{position: 'absolute', bottom: '50%', left: '50%', transform: 'translate(-50%, -100px)'}} variant='outline' onClick={() => setIsLoading(false)}>Close</Button>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
