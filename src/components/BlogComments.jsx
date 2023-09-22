import { Backdrop, Box, Button, CircularProgress, Divider, FormHelperText, TextField, TextareaAutosize, Typography } from '@mui/material'
import React, { useContext } from 'react'
import axios from 'axios';
import theme from '../theme';
import CommentIcon from '@mui/icons-material/Comment';
import { Store } from '../utils/Store';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '4px', transform: 'scale(0.8)' }}
  >
    {"•"}
  </Box>
);

export default function BlogComments({ slug }) {
  const { state, dispatch } = useContext(Store);
  const { session } = state;
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
  const [anchor, setAnchor] = React.useState(0);
  const isEmptyComments = comments.length === 0;
  const [isLoading, setIsLoading] = React.useState(false);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

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

  function handleShowForm(id, index) {
    setShowForm(true);
    setAnchor(index);
    setReplyCommentId(id);
  }

  function handleCloseForm() {
    setShowForm(false);
    setReplyCommentId('false');
  }

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/blog/getComment/${slug}`);
      setComments(data);
      console.log('fetch data');
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (isLoading) {
      return
    }
    setIsLoading(true);
    if (isEmptyComments) {
      setTimeout(() => {
        fetchComments();
        setIsLoading(false);
      }, 1500);
    }
    setIsLoading(false);
  }, [isEmptyComments]);

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
      setUpdateEmail('');
      setUpdateName('');
      setUpdateReplay('');
    }
  }, [isSubmitting]);

  function convertDate(value) {
    const date = new Date(value);
    const formatDate = date.toLocaleDateString("en-US", options);
    return formatDate;
  }

  return (
    <Box>
    {
      comments && comments.length !== 0 && 
      <Box className='comments-area' sx={{bgcolor: theme.palette.badge.bgdLight, p: 3}}>
        {
          comments.map((comment, index) => (
            comment.replyCommentId === 'false' &&
          <Box key={comment._id}>
            <Typography sx={{py: 1}}>
              {comment.authorName}{bull}
              <Typography component='span' variant='caption'>
                {convertDate(comment.createdAt)}
              </Typography>
            </Typography>
            <Divider />
            <Typography sx={{py: 1}}>{comment.content}</Typography>
            <CommentIcon color='primary' sx={{ cursor: 'pointer' }} onClick={() => handleShowForm(comment._id, index)} />
            {
              showForm && anchor === index && (
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
              {
                session ?        
                <Box sx={{flexWrap: 'wrap'}}>
                  <input
                    type='hidden'
                    margin="normal"
                    required
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    error={errors.email}
                    onChange={handleChangeEmail}
                    value={session.email}
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
                    value={session.name}
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
              <input type="hidden" name="isAdminReply" id="isAdminReply" value={ session && session.isAdmin ? 'true' : 'false' } />
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
                  <Typography sx={{py: 1}}>
                    {childComment.isAdminReply ? childComment.authorName + ' (admin)' : childComment.authorName}{bull}
                    <Typography component='span' variant='caption'>
                      {convertDate(comment.createdAt)}
                    </Typography>
                  </Typography>
                  <Divider />
                  <Typography sx={{py: 1}}>{childComment.content}</Typography>
                  <CommentIcon color='primary' sx={{ cursor: 'pointer' }} onClick={() => handleShowForm(comment._id, index)} />
                  {
                    showForm && replyCommentId === comment._id && anchor === index && (
                      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                        {
                          session ?        
                          <Box sx={{flexWrap: 'wrap'}}>
                            <input
                              type='hidden'
                              margin="normal"
                              required
                              id="email"
                              label="Email Address"
                              name="email"
                              autoComplete="email"
                              error={errors.email}
                              onChange={handleChangeEmail}
                              value={session.email}
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
                              value={session.name}
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
              session ?        
              <Box sx={{flexWrap: 'wrap'}}>
                <input
                  type='hidden'
                  margin="normal"
                  required
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={errors.email}
                  onChange={handleChangeEmail}
                  value={session.email}
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
                  value={session.name}
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
            <input type="hidden" name="isAdminReply" id="isAdminReply" value={ session && session.isAdmin ? 'true' : 'false' } />
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
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <Button sx={{position: 'absolute', bottom: '50%', left: '50%', transform: 'translate(-50%, -100px)'}} variant='outline' onClick={() => setIsLoading(false)}>Close</Button>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
}
