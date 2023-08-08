import * as React from 'react';
import { Box, Divider, FormHelperText, Rating, TextField, TextareaAutosize, Typography, Button } from '@mui/material';
import theme from '../src/theme';
import ProductReviewForm from '../src/components/ProductReviewForm';
import { useRouter } from 'next/router';
import Pusher from 'pusher-js';
import Link from '../src/Link';
import axios from 'axios';
import { useSession } from '../src/utils/SessionProvider';
import { Store } from '../src/utils/Store';

export default function Mobile() {
  const { state, dispatch } = React.useContext(Store);
  const { userInfo, snack, cart: {cartItems} } = state;
  const { session } = useSession();
  const router = useRouter();
  const { slug } = router.query;
  const [comments, setComments] = React.useState([]);
  const [replyCommentId, setReplyCommentId] = React.useState('false');
  const [showForm, setShowForm] = React.useState(false);
  const [anchor, setAnchor] = React.useState(0);
  const [ratings, setRatings] = React.useState([]);
  const [numReviews, setNumReviews] = React.useState([]);
  const [sumReviews, setSumReviews] = React.useState(0);
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
  const [ isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/comments/nokia-spring-mobile`);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  React.useEffect(() => {
    // Fetch existing comments from the server on page load
    fetchComments();
  }, []);

  React.useEffect(() => {

    const pusher = new Pusher("55281f94f1d8b452636d", {
      cluster: 'eu',
    });

    const channel = pusher.subscribe('comments');
    // Function to handle new comments received from Pusher
    const handleNewComment = (newComment) => {
      setComments((prevComments) => [...prevComments, newComment]);
      console.log('New comment:', newComment);
    };

    // Subscribe to the 'new-comment' event from Pusher
    
    channel.bind('new-comment', handleNewComment);

    // Clean up the event listener when the component is unmounted
    return () => {
      channel.unbind('new-comment', handleNewComment);
      pusher.unsubscribe('comments');
    };
  }, []);

  React.useEffect(() => {
    showReview();
  }, []);

  function showReview() {
    if (comments) {
      const onlyReviews = comments.filter(review => review.replyCommentId === 'false' && review.rating !== 0);
  
      const sum = onlyReviews.map(item => item.rating).reduce((partialSum, a) => partialSum + a, 0);
  
      setRatings(onlyReviews.map(item => item.rating))
      setNumReviews(onlyReviews.map(item => item.rating).length);
      setSumReviews(sum);
    }
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({ ...errors, email: false, authorName: false, replay: false, rating: false });

    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
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

      if (session) {
        if (hasPurchased && formData.rating === 0) {
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
    }finally {
      setIsSubmitting(false); // Reset the submission flag
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

  async function fetchUserOrders() {
    try {
      if(userInfo) {
        const { data } = await axios.get(`/api/orders/history/`);
        setHasPurchased(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    fetchUserOrders();
    console.log('userInfo', userInfo);
  }, []);

  return (
    <Box>
      <Box sx={{ flexGrow: 1, my: 1, display: 'flex', alignItems: 'center', '& a': {textDecoration: 'none' }, '&:hover a': {textDecoration: 'none' }  }}>
        <Rating align="center" size="small" name="read-only" value={sumReviews/numReviews} readOnly precision={0.5} />
        <Link noLinkStyle href="#reviews">
          <Typography align="center" gutterBottom variant="p" component="span" color="secondary" sx={{marginLeft: 1}}>
            Reviews ({ratings.length !== 0 ? numReviews : 0})
          </Typography>
        </Link>
      </Box>
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
              <Button size='small' sx={{ mb: 3 }} variant='outlined' onClick={() => handleShowForm(comment._id, index)}>
                Reply
              </Button>
              {
                showForm && anchor === index && (
                  <ProductReviewForm slug={"nokia-spring-mobile"} setShowForm={setShowForm} setComments={setComments} replyCommentId={replyCommentId} />
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
  )
}