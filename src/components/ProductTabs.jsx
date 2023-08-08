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
import { Store } from '../utils/Store';
import pusherClient from '../utils/client/pusher';
import ProductReviewForm from './ProductReviewForm';

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
                      <ProductReviewForm product={product} slug={slug} setShowForm={setShowForm} setComments={setComments} replyCommentId={replyCommentId} />
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
              <ProductReviewForm product={product} slug={slug} setShowForm={setShowForm} setComments={setComments} replyCommentId={replyCommentId} />
            </Box>
          }
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
