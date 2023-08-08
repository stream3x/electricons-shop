import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// import { Button, Divider, FormHelperText, Rating, TextField, TextareaAutosize } from '@mui/material';
// import axios from 'axios';
// import pusherClient from '../utils/client/pusher';
// import ProductReviewForm from './ProductReviewForm';
// import Pusher from 'pusher-js';

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

  const [showForm, setShowForm] = React.useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [comments, setComments] = React.useState([]);
  const [replyCommentId, setReplyCommentId] = React.useState('false');
  const [anchor, setAnchor] = React.useState(0);

  // const fetchComments = async () => {
  //   try {
  //     const { data } = await axios.get(`/api/comments/${slug}`);
  //     setComments(data);
  //   } catch (error) {
  //     console.error('Error fetching comments:', error);
  //   }
  // };

  // React.useEffect(() => {
  //   // Fetch existing comments from the server on page load
  //   fetchComments();
  // }, [slug]);

  // React.useEffect(() => {

  //   const pusher = new Pusher("55281f94f1d8b452636d", {
  //     cluster: 'eu',
  //   });

  //   const channel = pusher.subscribe('comments');
  //   // Function to handle new comments received from Pusher
  //   const handleNewComment = (newComment) => {
  //     setComments((prevComments) => [...prevComments, newComment]);
  //     console.log('New comment:', newComment);
  //   };

  //   // Subscribe to the 'new-comment' event from Pusher
    
  //   channel.bind('new-comment', handleNewComment);

  //   // Clean up the event listener when the component is unmounted
  //   return () => {
  //     channel.unbind('new-comment', handleNewComment);
  //     pusher.unsubscribe('comments');
  //   };
  // }, []);

  // React.useEffect(() => {
  //   showReview();
  // }, [comments]);

  // function showReview() {
  //   if (comments) {
  //     const onlyReviews = comments.filter(review => review.replyCommentId === 'false' && review.rating !== 0);
  
  //     const sum = onlyReviews.map(item => item.rating).reduce((partialSum, a) => partialSum + a, 0);
  
  //     setRatings(onlyReviews.map(item => item.rating))
  //     setNumReviews(onlyReviews.map(item => item.rating).length);
  //     setSumReviews(sum);
  //   }
  // }

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
          {/* <Tab label="Reviews" {...a11yProps(2)} /> */}
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
        {/* <TabPanel value={value} index={2} dir={theme.direction}>
        </TabPanel> */}
      </SwipeableViews>
    </Box>
  );
}
