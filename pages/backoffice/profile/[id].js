import React, { useContext, useEffect, useState } from 'react'
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormHelperText, Grid, IconButton, Paper, Slide, TextField, Tooltip, Typography } from '@mui/material'
import styled from '@emotion/styled'
import { Store } from '../../../src/utils/Store'
import axios from 'axios'
import theme from '../../../src/theme'
import db from '../../../src/utils/db'
import User from '../../../models/User'
import Image from 'next/image'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import Tooltips from '@mui/material/Tooltip';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useRouter } from 'next/router'
import SingleUserOrders from '../../../src/components/SingleUserOrders'
import UserActivities from '../../../src/components/UserActivities'
import Order from '../../../models/Order'
import Guest from '../../../models/Guest'
import Wishlist from '../../../models/Wishlist'
import ProductComment from '../../../models/ProductComment'
import PayLogo from '../../../src/assets/PayLogo'

export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;
  await db.connect();
  const user = await User.find({ email: id }).exec();
  const orders = await Order.find({ 'personalInfo.email': id }).exec();
  const guest_orders = await Guest.find({ 'personalInfo.email': id }).exec();
  const favorites = await Wishlist.find({ 'userId': user[0]._id }).exec();
  const reviews = await ProductComment.find({ 'email': id }).exec();
  await db.disconnect();
  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      orders: JSON.parse(JSON.stringify(orders)),
      guest_orders: JSON.parse(JSON.stringify(guest_orders)),
      favorites: JSON.parse(JSON.stringify(favorites)),
      reviews: JSON.parse(JSON.stringify(reviews))
    }
  };
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AlertDialogSlide(props) {
  const { open, handleRemoveImage, handleUploadImage, handleClose } = props;

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Now you can change profile picture"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You can upload image as .jpg | .png | .gif .etc | try to upload image size about 50kb
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadImage}>Save image as profile picture</Button>
          <Button onClick={handleRemoveImage}>Remove image</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.white,
  border: 'thin dashed lightGrey',
  height: '100%',
  width: '100%',
  borderRadius: 10,
  padding: '.5rem 1rem'
}));

const LabelBox = styled(Box)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.bgdLight,
  border: `thin solid ${theme.palette.secondary.borderColor}`,
  borderRadius: 10,
  height: '100%',
  padding: '.5rem 1rem'
}));

export default function Profile(props) {
  const { user, orders, guest_orders, favorites, reviews } = props;
  const router = useRouter();
  const userInf0 = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const [profileUser, setProfileUser] = useState({});
  const { state, dispatch } = useContext(Store);
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    birthday: false,
    company: false,
    vatNumber: false,
    address: false,
    city: false,
    country: false,
    postalcode: false,
    phone: false
  });
  const pattern= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const pattern_phone = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
  const [activeTab, setActiveTab] = useState('1');
  const [editProfile, setEditProfile] = useState(false);
  const [editAddress, setEditAddress] = useState({
    addressId: '',
    email: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imgFile, setImgFile] = useState({
    image: null,
    imageUrl: null
  });
  const [addNewAddress, setAddNewAddress] = useState(false);
  const sumOrders = orders.map(item => item.total);
  const totalSumOrders = sumOrders.reduce((sum, order) => sum + order, 0);
  const sumGuest = guest_orders.map(item => item.total);
  const totalSumGuest = sumGuest.reduce((sum, order) => sum + order, 0);
  const total_spend = Math.floor(totalSumOrders + totalSumGuest);

  useEffect(() => {
    if (!userInf0) {
      router.push('/login');
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'you are denied and logged out', severity: 'warning'}});
      return;
    }
    async function fetchData() {
      const user_data = await user;
      setProfileUser(user_data[0])
    }
    fetchData();
  }, [])

  function handleImageChoose(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        setImgFile({
            ...imgFile,
            image: file,
            imageUrl: reader.result
        })
        e.target.value = ''
    }
    reader.readAsDataURL(file);
  }

  function handleRefresh() {
    setRefresh(true);
  }

  useEffect(() => {
    setSelectedFile(null);
    setError(false);
  }, [refresh])
  

  const handleTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUploadImage = async (event) => {
    event.preventDefault();
    try {
      const formData = {
        image_name: imgFile.image?.name,
        image: imgFile?.imageUrl,
        email: profileUser?.email
      }
      const { data } = await axios.put(`/api/users/upload_profile_images`, formData, {
        headers: {
          'Content-Type': "application/json", // Set the correct Content-Type header
        },
      });
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'image was uploaded', severity: 'success'}});
    } catch (error) {
      console.error('Error uploading image:', error);
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: `Error uploading image ${error}`, severity: 'error'}});
      setErrorMessage('Error uploading image:', error)
      setSelectedFile(null);
      setError(true)
    }
  };

  const handleRemoveImage = async () => {
    setSelectedFile(null);
    setOpen(false);
    try {
      const formData = {
        image_name: '',
        image: '',
        email: profileUser?.email
      }
      await axios.put('/api/users/upload_profile_images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the correct Content-Type header
        },
      });
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'image was removed', severity: 'success'}});
    } catch (error) {
      console.error('Error remove image:', error);
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: `Error remove image ${error}`, severity: 'error'}});
      setSelectedFile(null);
      setError(true);
    }
  };

  function handleClose() {
    setOpen(false);
    setSelectedFile(null);
    setImgFile({image: null, imageUrl: null})
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        name: formOutput.get('name'),
        email: formOutput.get('email'),
        birthday: formOutput.get('birthday'),
        company: formOutput.get('company'),
        vatNumber: formOutput.get('vatNumber'),
      };

      setErrors({ ...errors, name: false, email: false, birthday: false, password: false, company: false, vatNumber: false });
      if(formOutput.get('name') === '') {
        setErrors({ ...errors, firstName: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'please fill name', severity: 'error'}});
        return;
      }
      if(formOutput.get('vatNumber') !== '' && formOutput.get('vatNumber').length < 9) {
        setErrors({ ...errors, vatNumber: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'can\'t contain less then 9 numbers', severity: 'error'}});
        return;
      }
      if(formOutput.get('vatNumber') !== '' && formOutput.get('vatNumber').length > 9) {
        setErrors({ ...errors, vatNumber: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'can\'t contain more than 9 numbers', severity: 'error'}});
        return;
      }
      if(!pattern.test(formData.email)) {
        setErrors({ ...errors, email: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the email is not valid', severity: 'error'}});
        return;
      }
      if(formData.email === '') {
        setErrors({ ...errors, email: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the email is not valid', severity: 'error'}});
        return;
      }
      try {
        const { data } = await axios.put('/api/users/upload', formData);
        dispatch({ type: 'PERSONAL_INFO', payload: data });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'Profile was edited', severity: 'success'}});
        setError(false);
        setEditProfile(false)
        const update_user = await data;
        setProfileUser(update_user);
      } catch (error) {
        console.error('Error change personal info:', error);
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: `Error change personal info: ${error}`, severity: 'error'}});
        setSelectedFile(null);
        setError(true);
      }
  };

  const handleSubmitAddress = async (event) => {
    event.preventDefault();
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        email: editAddress.email,
        addressId: editAddress.addressId,
        addresses: [
          {
            address: formOutput.get('address'),
            city: formOutput.get('city'),
            country: formOutput.get('country'),
            postalcode: formOutput.get('postalcode'),
            phone: formOutput.get('phone'),
          }
        ]
      };
      if(event.target.id === editAddress && formOutput.get('country') === '') {
        setErrors({ ...errors, country: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the country is required', severity: 'warning'}});
        return;
      }
      if(event.target.id === editAddress && formOutput.get('postalcode') === '') {
        setErrors({ ...errors, postalcode: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the postal code is required', severity: 'warning'}});
        return;
      }
      if(event.target.id === editAddress && formOutput.get('address') === '') {
        setErrors({ ...errors, address: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'please fill address', severity: 'warning'}});
        return;
      }
      if(event.target.id === editAddress && formOutput.get('city') === '') {
        setErrors({ ...errors, city: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'city is required field', severity: 'warning'}});
        return;
      }
      if(event.target.id === editAddress && !pattern_phone.test(formData.phone) && formData.phone !== '') {
        setErrors({ ...errors, phone: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the phone is not valid', severity: 'error'}});
        return;
      }
      try {
        const { data } = await axios.put(`/api/users/edit_address`, formData);
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully added address', severity: 'success' } });
        setError(false);
        setEditAddress('');
        const update_user = await data;
        setProfileUser(update_user);
      } catch (error) {
        console.error('Error change address:', error);
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: `Error change address: ${error}`, severity: 'error'}});
        setSelectedFile(null);
        setError(true);
        setEditAddress('');
      }
      setErrors({ 
        ...errors, 
        address: false,
        city: false,
        country: false,
        postalcode: false,
        phone: false
      });
  };

  const submitNewAddress = async (event) => {
    event.preventDefault();
    try {
      const formOutput = new FormData(event.currentTarget);
      const formData = {
        name: profileUser?.name,
        email: profileUser?.email,
        birthday: profileUser?.birthday,
        company: profileUser?.company,
        vatNumber: profileUser?.vatNumber,
        addresses: [
          {
            address: formOutput.get('address'),
            city: formOutput.get('city'),
            country: formOutput.get('country'),
            postalcode: formOutput.get('postalcode'),
            phone: formOutput.get('phone')
          }
        ]
      };
      if(formOutput.get('address') === '') {
        setErrors({ ...errors, address: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'please fill address', severity: 'warning'}});
        return;
      }
      if(formOutput.get('city') === '') {
        setErrors({ ...errors, city: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'city is required field', severity: 'warning'}});
        return;
      }
      if(!pattern_phone.test(formOutput.get('phone'))) {
        setErrors({ ...errors, phone: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the phone is not valid', severity: 'error'}});
        return;
      }
      if(formData.phone === '') {
        setErrors({ ...errors, phone: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the phone is required', severity: 'warning'}});
        return;
      }
      if(formOutput.get('country') === '') {
        setErrors({ ...errors, country: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the country is required', severity: 'warning'}});
        return;
      }
      if(formOutput.get('postalcode') === '') {
        setErrors({ ...errors, postalcode: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the postal code is required', severity: 'warning'}});
        return;
      }
      const { data } = await axios.put('/api/users/upload', formData);
      const update_user = await data;
      setProfileUser(update_user);
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully added address', severity: 'success' } });
      setAddNewAddress(!addNewAddress)
      setErrors({ 
        ...errors, 
        address: false,
        city: false,
        country: false,
        postalcode: false,
        phone: false
      });
    } catch (error) {
      console.log(error);
      setError(true);
      setErrorMessage('error add new address');
      setAddNewAddress(!addNewAddress)
    }
  };

  const handleEditInfo = () => {
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'now you can edit Profile', severity: 'warning'}});
    setEditProfile(true);
  };

  const handleEditAddress = (e, item) => {
    setAddNewAddress(false);
    setEditAddress({...editAddress, addressId: item._id, email: profileUser.email});
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'now you can edit Address', severity: 'warning'}});
  };

  const handleNewAddress = () => {
    setAddNewAddress(!addNewAddress)
    setEditAddress({...editAddress, addressId: '', email: ''});
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'now you can add new Address', severity: 'warning'}});
  }

  const handleDelete = async (item) => {
    const formData = {
      email: profileUser?.email,
      addressId: item._id
    }
    const { data } = await axios.delete(`/api/users/delete_address`, {data: formData});
    setProfileUser(user[0]);
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack,message: 'address successfully deleted', severity: 'warning'}});
  };

  return (
    <Box>
      {
        error ?
          <LabelButton sx={{width: '100%', my: 5, p: 2}}>
            <Typography sx={{m: 0, p: 1, fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h5" component="h1" gutterBottom>
              {errorMessage}
              <Tooltips title='Refresh'>
                <IconButton onClick={handleRefresh} aria-label="delete">
                  <RefreshIcon />
                </IconButton>
              </Tooltips>
            </Typography>
          </LabelButton>
         : 
        <Grid sx={{pt: 3}} container spacing={3}>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                height: 240,
                gap: 2
              }}
            >
              <Box component="form" onSubmit={handleUploadImage} sx={{position: 'relative'}}>
                  <Box component="label" onChange={handleImageChoose} htmlFor="photo">
                    {
                      imgFile?.imageUrl ?
                        <Box sx={{ borderRadius: '100%', overflow: 'hidden', boxShadow: '0 5px 20px lightGray', mt: -5, '& img': {objectFit: 'contain'}, position: 'relative', width: 100, height: 100 }}>
                          <Image
                            fill
                            src={imgFile.imageUrl ? imgFile?.imageUrl : profileUser?.image}
                            alt={profileUser?.name}
                          />
                        </Box>
                          :
                        <IconButton sx={{ p: 0, mt: -5 }}>
                          <Avatar sx={{ width: 100, height: 100 }} alt={profileUser ? profileUser?.name : 'Avatar'} src={ profileUser && (profileUser?.image === '' ? '/images/fake.jpg' : profileUser?.image)} />
                        </IconButton>
                    }
                    {
                      imgFile.imageUrl === null ?
                      <Box sx={{position: 'absolute', bottom: -10, right: -10, zIndex: 1, width: 40, height: 40, '&:hover button': {bgcolor: theme.palette.primary.bgdLight}, cursor: 'pointer' }} component="span">
                        <IconButton sx={{ bgcolor: theme.palette.primary.white, zIndex: -1 }} color='dashboard' variant="outlined">
                          <AddAPhotoIcon />
                        </IconButton>
                      </Box>
                      :
                      <Box sx={{position: 'absolute', bottom: -10, right: -10, width: 40, height: 40, '&:hover button': {bgcolor: theme.palette.primary.bgdLight}, cursor: 'pointer' }}>
                        <IconButton type='submit' sx={{ bgcolor: theme.palette.primary.white }} color='dashboard' variant="outlined">
                          <FileUploadIcon />
                        </IconButton>
                      </Box>
                    }
                    <Box sx={{display: 'none'}} component="input" type="file" name="photo" id="photo"/>
                  </Box>
              </Box>
              <Box>
                <Typography sx={{textAlign: 'center'}} component="h3" variant='body'>
                  {profileUser?.name}
                </Typography>
                {
                  profileUser?.company ?
                  <Typography sx={{textAlign: 'center', opacity: .3}} variant='subtitle2'>
                    {profileUser?.company}
                  </Typography>
                :
                  <Typography sx={{opacity: .3}} variant='subtitle2'>
                  Company name not set
                  </Typography>
                }
              </Box>
              <Box>
                {
                  userInf0?.email === profileUser?.email ?
                  <IconButton>
                    <ChatIcon />
                  </IconButton>
                  :
                  <Box>
                    <Button sx={{mr: 3}} variant="contained" endIcon={<SendIcon />}>
                      Send
                    </Button>
                    <Button color='dashboard' variant="outlined" startIcon={<DeleteIcon />}>
                      Delete
                    </Button>
                  </Box>
                }
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 'auto',
              }}
            >
              <UserActivities orders={{total_orders: [{orders: orders, guest: guest_orders}]}} favorites={favorites} reviews={reviews} />
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', overflow: 'hidden' }}>
              <Typography variant="h6" gutterBottom component="div">
                Saved Cards
              </Typography>
              <Divider sx={{ml: -50, position: 'relative', left: 50, py: 1, mb: 3}} />
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <LabelBox sx={{display: 'flex', flexWrap: 'wrap'}}>
                    <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                      <Box sx={{ mr: 3, width: '80px', height: '40px', border: `thin solid ${theme.palette.primary.borderColor}`, borderRadius: '.5rem', display: 'flex', justifyContent: 'center' }}>
                        <PayLogo />
                      </Box>
                      <Box>
                        <Typography variant='h6'>•••• 6879</Typography>
                        <Typography variant='caption'>Expires: 12/24</Typography>
                      </Box>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', width: '100%', pt: 2}}>
                      <IconButton color='error'>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </LabelBox>
                </Grid>
                <Grid item xs={12} md={6}>
                  <LabelBox sx={{display: 'flex', flexWrap: 'wrap'}}>
                    <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                      <Box sx={{ mr: 3, width: '80px', height: '40px', border: `thin solid ${theme.palette.primary.borderColor}`, borderRadius: '.5rem', display: 'flex', justifyContent: 'center', position: 'relative' }}>
                        <Box sx={{position: 'relative', width: '90%!important', height: 'auto'}}>
                          <Image
                            fill
                            src="/logo/dina-card.png"
                            alt="Dina Card"
                          />
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant='h6'>•••• 6879</Typography>
                        <Typography variant='caption'>Expires: 12/24</Typography>
                      </Box>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', width: '100%', pt: 2}}>
                      <IconButton color='error'>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </LabelBox>
                </Grid>
                <Grid item xs={12} md={6}>
                  <LabelButton sx={{display: 'flex', flexWrap: 'wrap'}}>
                    <Tooltip title="add new card">
                      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', py: 3}}>
                        <IconButton color='primary'>
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Tooltip>
                  </LabelButton>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
              <LabelBox sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant='h6' component="span">total spend:</Typography>
                <Typography color="primary" variant='h6' component="span">{'$'}{total_spend}</Typography>
              </LabelBox>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={activeTab}>
                <Box>
                  <TabList variant="scrollable" onChange={handleTab} aria-label="lab API tabs example">
                    <Tab label="Activity" value="1" />
                    <Tab label="Edit Profile" value="2" />
                    <Tab label="Notification" value="3" />
                    <Tab label="Security" value="4" />
                  </TabList>
                </Box>
                <TabPanel sx={{p: 0, pt: 3}} value="1">
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                    <SingleUserOrders rows={orders} rowsGuest={guest_orders} />
                  </Paper>
                </TabPanel>
                <TabPanel sx={{p: 0, pt: 3}} value="2">
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                    <Box sx={{width: '100%', mb: 1, p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <Typography variant='subtitle1' component='h2'>
                        Personal Details
                      </Typography>
                      {
                        !editProfile &&
                        <Button
                          sx={{ '&:hover': { backgroundColor: theme.palette.secondary.main, textDecoration: 'none' } }}
                          onClick={handleEditInfo}
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                      } 
                    </Box>
                    <Divider sx={{mb: 3}} />
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', '& .MuiTextField-root': {flex: {xs: '0 0 100%' , md: '0 0 32%'}, mt: 0, mr: {xs: 0, md: 1}} }}>
                      <TextField
                        margin="normal"
                        defaultValue={profileUser ? profileUser?.name : ''}
                        disabled={!editProfile && true}
                        required
                        id="name"
                        label="Name"
                        name="name"
                        autoComplete="name"
                        variant="standard"
                      />
                      {
                        errors.name && 
                        <FormHelperText error>{snack.message && snack.message}</FormHelperText>
                      }
                      <TextField
                        margin="normal"
                        defaultValue={profileUser ? profileUser?.email : ''}
                        disabled={!editProfile && true}
                        required
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        variant="standard"
                      />
                      {
                        errors.email && 
                        <FormHelperText error>{snack.message && snack.message}</FormHelperText>
                      }
                      <TextField
                        margin="normal"
                        type="date"
                        defaultValue={profileUser ? profileUser?.birthday : ''}
                        disabled={!editProfile && true}
                        id="birthday"
                        label="Birthday (optional)"
                        name="birthday"
                        autoComplete="birthday"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        margin="normal"
                        defaultValue={profileUser ? profileUser?.company : ''}
                        disabled={!editProfile && true}
                        id="company"
                        label="Company (optional)"
                        name="company"
                        autoComplete="company"
                        variant="standard"
                      />
                      <TextField
                        margin="normal"
                        type="number"
                        defaultValue={profileUser ? profileUser?.vatNumber : ''}
                        disabled={!editProfile && true}
                        id="vatNumber"
                        label="VAT Number (optional)"
                        name="vatNumber"
                        variant="standard"
                      />         
                      {
                        errors.vatNumber && 
                        <FormHelperText error>{snack.message && snack.message}</FormHelperText>
                      }
                      <Box sx={{width: '100%'}}>
                      {
                        editProfile &&
                        <Button
                          type='submit'
                          variant="contained"
                          sx={{ '&:hover': { backgroundColor: theme.palette.secondary.main, textDecoration: 'none' } }}
                        >
                          Save
                        </Button>
                      } 
                      </Box>
                    </Box>
                    <Box sx={{width: '100%', mt: 1, p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <Typography variant='subtitle1' component='h2'>
                        Address
                      </Typography>
                    </Box>
                    <Divider sx={{mb: 3}} />
                    <Box component="form" onSubmit={handleSubmitAddress} noValidate sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', '& .MuiTextField-root': {flex: {xs: '0 0 100%' , md: '0 0 32%'}, mt: 0, mr: {xs: 0, md: 1}} }}>
                      {
                        profileUser?.addresses?.map(item => (
                          <Box sx={{width: '100%'}} key={item._id}>
                            <TextField
                              margin="normal"
                              fullWidth
                              defaultValue={item.address}
                              disabled={editAddress.addressId !== item._id}
                              id="address"
                              label="Address"
                              name="address"
                              autoComplete="address"
                              error={errors.address}
                              variant="standard"
                            />
                            <TextField
                              margin="normal"
                              fullWidth
                              defaultValue={item.city}
                              disabled={editAddress.addressId !== item._id}
                              id="city"
                              label="city"
                              name="city"
                              autoComplete="address-level2"
                              error={errors.city}
                              variant="standard"
                            />
                            <TextField
                              margin="normal"
                              fullWidth
                              defaultValue={item.country}
                              disabled={editAddress.addressId !== item._id}
                              id="country"
                              label="Country"
                              name="country"
                              error={errors.country}
                              variant="standard"
                            />
                            <TextField
                              margin="normal"
                              type="number"
                              fullWidth
                              defaultValue={item.postalcode}
                              disabled={editAddress.addressId !== item._id}
                              id="postalcode"
                              label="Zip/Postal Code"
                              name="postalcode"
                              autoComplete="postalcode"
                              error={errors.postalcode}
                              variant="standard"
                            />
                            <TextField
                              margin="normal"
                              type="number"
                              fullWidth
                              defaultValue={item.phone}
                              disabled={editAddress.addressId !== item._id}
                              id="phone"
                              label="Phone"
                              name="phone"
                              autoComplete="phone"
                              error={errors.phone}
                              variant="standard"
                            />
                            <Box sx={{width: '100%', mb: 1, p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              {
                                editAddress.addressId !== item._id &&
                                <Box sx={{display: 'flex'}}>
                                  <Button
                                    size="small"
                                    type='button'
                                    sx={{ '&:hover': { backgroundColor: theme.palette. secondary.main, textDecoration: 'none' } }}
                                    onClick={(e) => handleEditAddress(e, item)}
                                    startIcon={<EditIcon />}
                                  >
                                    Edit
                                  </Button>
                                  {
                                    profileUser?.addresses?.length > 1 &&
                                    <Button
                                      size="small"
                                      fullWidth
                                      color="secondary"
                                      onClick={() => handleDelete(item)}
                                      startIcon={<DeleteIcon />}
                                    >
                                      delete
                                    </Button>
                                  }
                                </Box>
                              } 
                              {
                                editAddress.addressId == item._id &&
                                <Button
                                  type='submit'
                                  variant="contained"
                                  sx={{ '&:hover': { backgroundColor: theme.palette.secondary.main, textDecoration: 'none' } }}
                                >
                                  Save
                                </Button>
                              }
                            </Box>
                          </Box>
                        ))
                      }
                    </Box>
                    {/* New Address */}
                    <Grid container space={2}>
                      <Grid sx={{p: 2, textAlign: 'left'}} item xs={12} sm={6}>
                        <Button onClick={handleNewAddress} size="small" startIcon={!addNewAddress ? <AddIcon /> : <RemoveIcon />}>
                        { addNewAddress ? 'cancel' : 'Add new address'}
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Box component="form" onSubmit={submitNewAddress} noValidate sx={{ mt: 1, width: '100%' }}>
                        {
                          addNewAddress &&
                          <Box>
                            <TextField
                              margin="normal"
                              fullWidth
                              required
                              id="address"
                              label="Address"
                              name="address"
                              autoComplete="address"
                              error={errors.address}
                            />
                            <TextField
                              margin="normal"
                              fullWidth
                              required
                              id="city"
                              label="city"
                              name="city"
                              autoComplete="address-level2"
                              error={errors.city}
                            />
                            <TextField
                              margin="normal"
                              fullWidth
                              required
                              id="country"
                              label="Country"
                              name="country"
                              error={errors.country}
                            />
                            <TextField
                              margin="normal"
                              type="number"
                              fullWidth
                              required
                              id="postalcode"
                              label="Zip/Postal Code"
                              name="postalcode"
                              autoComplete="postalcode"
                              error={errors.postalcode}
                            />
                            <TextField
                              margin="normal"
                              type="number"
                              fullWidth
                              required
                              id="phone"
                              label="Phone"
                              name="phone"
                              autoComplete="phone"
                              error={errors.phone}
                            />
                            <Button
                              type="submit"
                              fullWidth
                              variant="contained"
                              sx={{ mt: 3, mb: 2, '&:hover': { backgroundColor: theme.palette.secondary.main } }}
                            >
                              save
                            </Button>
                          </Box>
                        }
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </TabPanel>
                <TabPanel sx={{p: 0, pt: 3}} value="3">
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                    Notification
                  </Paper>
                </TabPanel>
                <TabPanel sx={{p: 0, pt: 3}} value="4">
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                    Security
                  </Paper>
                </TabPanel>
              </TabContext>
            </Box>
          </Grid>
        </Grid>
      }
      <AlertDialogSlide open={open} handleUploadImage={handleUploadImage} handleRemoveImage={handleRemoveImage} handleClose={handleClose} />
    </Box>
  )
}