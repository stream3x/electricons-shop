import React, { useContext } from 'react'
import DashboardLayout from '../../../src/layout/DashboardLayout'
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormHelperText, Grid, IconButton, Paper, Slide, TextField, Typography } from '@mui/material'
import styled from '@emotion/styled'
import { Store } from '../../../src/utils/Store'
import dynamic from 'next/dynamic'
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

export async function getServerSideProps(context) {
  const { params, query } = context;
  const { id } = params;
  await db.connect();
  const user = await User.find({ email: id }).exec();
  console.log(user);
  await db.disconnect();
  return {
    props: {
      user: JSON.parse(JSON.stringify(user))
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
  border: 'thin solid lightGrey',
  borderLeft: '5px solid black',
}));

function Profile(props) {
  const { user } = props;
  const profileUser = user && user[0];
  const { state, state: {session}, dispatch } = useContext(Store);
  const [error, setError] = React.useState(false);
  const [errors, setErrors] = React.useState({
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
const [activeTab, setActiveTab] = React.useState('1');
const [editProfile, setEditProfile] = React.useState(false);
const [editAddress, setEditAddress] = React.useState(false);
const [selectedFile, setSelectedFile] = React.useState(null);
const [open, setOpen] = React.useState(false);
const [refresh, setRefresh] = React.useState(false);
const [errorMessage, setErrorMessage] = React.useState('');
const [imgFile, setImgFile] = React.useState({
  image: null,
  imageUrl: null
})

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

  React.useEffect(() => {
    setSelectedFile(null);
    setError(false);
  }, [refresh])
  

  const handleTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUploadImage = async (event) => {
    event.preventDefault();
    try {
      const outputData = new FormData(event.currentTarget);
      const formData = {
        image_name: imgFile.image?.name,
        image: imgFile?.imageUrl,
        email: profileUser?.email
      }
      console.log(formData);
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
    console.log('Image removed');
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      console.log(formData);
      await axios.put('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the correct Content-Type header
        },
      });
      console.log(data);
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'image was uploaded', severity: 'success'}});
    } catch (error) {
      console.error('Error uploading image:', error);
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: `Error uploading image ${error}`, severity: 'error'}});
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
        const { data } = await axios.put('/api/upload', formData);
        console.log('Updated user:', formData);
        dispatch({ type: 'PERSONAL_INFO', payload: data });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'Profile was edited', severity: 'success'}});
        setError(false);
        setEditProfile(false)
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
        name: profileUser.name,
        email: profileUser.email,
        birthday: profileUser.birthday,
        company: profileUser.company,
        vatNumber: profileUser.vatNumber,
        address: formOutput.get('address'),
        city: formOutput.get('city'),
        country: formOutput.get('country'),
        postalcode: formOutput.get('postalcode'),
        phone: formOutput.get('phone')
      };
      if(!pattern_phone.test(formData.phone) && formData.phone !== '') {
        setErrors({ ...errors, phone: true });
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'the phone is not valid', severity: 'error'}});
        return;
      }
      try {
        const { data } = await axios.put('/api/upload', formData);
        console.log('Updated user:', data);
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully added address', severity: 'success' } });
        setError(false);
        setEditAddress(false)
      } catch (error) {
        console.error('Error change address:', error);
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: `Error change address: ${error}`, severity: 'error'}});
        setSelectedFile(null);
        setError(true);
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

  const handleEditInfo = () => {
    dispatch({ type: 'PERSONAL_REMOVE' });
    // dispatch({ type: 'ADDRESSES_REMOVE' });
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'now you can edit Profile', severity: 'warning'}});
    localStorage.removeItem('personalInfo');
    localStorage.removeItem('userInfo');
    setEditProfile(true);
  };

  const handleEditAddress = () => {
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'now you can edit Address', severity: 'warning'}});
    localStorage.removeItem('Addresses');
    setEditAddress(true);
  };

  return (
    <DashboardLayout>
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                height: 240,
                gap: 3
              }}
            >
              <Box component="form" onSubmit={handleUploadImage} sx={{position: 'relative'}}>
                  <Box component="label" onChange={handleImageChoose} htmlFor="photo">
                    {
                      imgFile.imageUrl ?
                        <Box sx={{ borderRadius: '100%', overflow: 'hidden', boxShadow: '0 5px 20px lightGray', mt: -5, '& img': {objectFit: 'contain'}, position: 'relative', width: 100, height: 100 }}>
                          <Image
                            fill
                            src={imgFile.imageUrl ? imgFile.imageUrl : profileUser.image}
                            alt={profileUser.name}
                          />
                        </Box>
                          :
                        <IconButton sx={{ p: 0, mt: -5 }}>
                          <Avatar sx={{ width: 100, height: 100 }} alt={profileUser ? profileUser.name : 'Avatar'} src={ profileUser && (profileUser.image === '' ? '/images/fake.jpg' : profileUser.image)} />
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
                  {profileUser.name}
                </Typography>
                {
                  profileUser.company ?
                  <Typography sx={{textAlign: 'center', opacity: .3}} component="span" variant='subtitle2'>
                    {profileUser.company}
                  </Typography>
                :
                  <Typography sx={{opacity: .3}} component="span" variant='subtitle2'>
                  Company name not set
                  </Typography>
                }
              </Box>
              <Box>
                {
                  session?.email === profileUser.email ?
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
                height: 240,
              }}
            >
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
              
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
                <TabPanel value="1">
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                    Activity
                  </Paper>
                </TabPanel>
                <TabPanel sx={{px: {xs: 1}}} value="2">
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                    <Box sx={{width: '100%', mb: 1, p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <Typography variant='subtitle1' component='h2'>Personal Details</Typography>
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
                        defaultValue={profileUser ? profileUser.name : ''}
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
                        defaultValue={profileUser ? profileUser.email : ''}
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
                        defaultValue={profileUser ? profileUser.birthday : ''}
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
                        defaultValue={profileUser ? profileUser.company : ''}
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
                        defaultValue={profileUser ? profileUser.vatNumber : ''}
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
                    <Box sx={{width: '100%', mb: 1, p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <Typography variant='subtitle1' component='h2'>Address</Typography>
                      {
                        !editAddress &&
                        <Button
                          sx={{ '&:hover': { backgroundColor: theme.palette.secondary.main, textDecoration: 'none' } }}
                          onClick={handleEditAddress}
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                      } 
                    </Box>
                    <Divider sx={{mb: 3}} />
                    <Box component="form" onSubmit={handleSubmitAddress} noValidate sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', '& .MuiTextField-root': {flex: {xs: '0 0 100%' , md: '0 0 32%'}, mt: 0, mr: {xs: 0, md: 1}} }}>
                      <TextField
                        margin="normal"
                        fullWidth
                        defaultValue={profileUser ? profileUser.address : ''}
                        disabled={!editAddress && true}
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
                        defaultValue={profileUser ? profileUser.city : ''}
                        disabled={!editAddress && true}
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
                        defaultValue={profileUser ? profileUser.country : ''}
                        disabled={!editAddress && true}
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
                        defaultValue={profileUser ? profileUser.postalcode : ''}
                        disabled={!editAddress && true}
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
                        defaultValue={profileUser ? profileUser.phone : ''}
                        disabled={!editAddress && true}
                        id="phone"
                        label="Phone"
                        name="phone"
                        autoComplete="phone"
                        error={errors.phone}
                        variant="standard"
                      />
                      <Box sx={{width: '100%'}}>
                      {
                        editAddress &&
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
                  </Paper>
                </TabPanel>
                <TabPanel value="3">
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                    Notification
                  </Paper>
                </TabPanel>
                <TabPanel value="4">
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
    </DashboardLayout>
  )
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false });