// components/ProductReviewForm.js
import * as React from 'react';
import { Box, Button, FormHelperText, Rating, TextField, TextareaAutosize, Typography } from '@mui/material';
import { Store } from '../utils/Store';
import axios from 'axios';
import theme from '../theme';
import { useSession } from '../utils/SessionProvider';

const ProductReviewForm = ({ slug, product, setShowForm, replyCommentId }) => {
  const { state, dispatch } = React.useContext(Store);
  const { userInfo, snack, cart: {cartItems} } = state;
  const { session } = useSession();
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
      }else {
        if(formData.rating === 0 && session) {
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

  async function fetchUserOrders() {
    try {
      const { data } = await axios.get(`/api/orders/history/`);
      const purchasedProduct = data.some(order => order.orderItems.find(item => item.slug === product.slug));
      setHasPurchased(purchasedProduct);
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    fetchUserOrders();
  }, []);

  console.log(product, session);

  return (
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
      <input type="hidden" name="replyCommentId" id="replyCommentId" value={replyCommentId ? replyCommentId : 'false'} />
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 3, mb: 2, '&:hover': {backgroundColor: theme.palette.secondary.main} }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default ProductReviewForm;
