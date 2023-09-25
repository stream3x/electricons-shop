import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import FormHelperText from '@mui/material/FormHelperText';
import { Avatar, Typography } from '@mui/material';
import theme from '../../src/theme';
import { Store } from '../../src/utils/Store';
import IconButton from '@mui/material/IconButton';
import ProfileLayout from "../../src/components/ProfileLayout"
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Image from 'next/image';
import RefreshIcon from '@mui/icons-material/Refresh';
import Tooltips from '@mui/material/Tooltip';
import styled from '@emotion/styled';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.white,
  border: 'thin solid lightGrey',
  borderLeft: '5px solid black',
}));

export default function ProfileInfo() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const userInf0 = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const { snack, cart: {cartItems, personalInfo}, uploadImage } = state;
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

  const emptyPersonalInfo = personalInfo !== null ? Object.keys(personalInfo).length === 0 : true;
  const emptyCartItems = Object.keys(cartItems).length === 0;
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [refresh, setRefresh] = React.useState(false);
  const [userInfo, setUserInfo] = useState({});
  const emptyUserInfo = userInfo !== null ? Object.keys(userInfo).length === 0 : true;
  const [changeUserInfo, setChangeUserInfo] = useState(false);
  const [imgFile, setImgFile] = React.useState({
    image: null,
    imageUrl: null
  })
  const [imgCoverFile, setImgCoverFile] = React.useState({
    image: null,
    imageUrl: null
  })

  React.useEffect(() => {
    setError(false);
  }, [refresh])

  React.useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get('/api/users');
        const user = await data.filter(items => items._id === userInf0._id);
        setUserInfo(user[0]);
      } catch (error) {
        console.log(error);
        setError(true)
      }
    }
    fetchData();
  }, [uploadImage?.change]);

  function handleRefresh() {
    setRefresh(true);
  }

  function handleCoverImageChoose(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImgCoverFile({
            ...imgFile,
            image: file,
            imageUrl: reader.result
        })
        e.target.value = ''
    }
    reader.readAsDataURL(file);
  }

  const handleUploadCoverImage = async (event) => {
    event.preventDefault();
    try {
      const outputData = new FormData(event.currentTarget);
      const formData = {
        image_name: imgCoverFile.image?.name,
        cover_photo: imgCoverFile?.imageUrl,
        email: userInf0?.email
      }
      console.log(formData);
      const { data } = await axios.put(`/api/users/upload_profile_cover_photo`, formData, {
        headers: {
          'Content-Type': "application/json", // Set the correct Content-Type header
        },
      });
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'cover photo was uploaded', severity: 'success'}});
      dispatch({ type: 'UPLOAD_IMAGE', payload: {...state.uploadImage, uploadImage: {change: true}} });
    } catch (error) {
      console.error('Error uploading image:', error);
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: `Error uploading image ${error}`, severity: 'error'}});
      setErrorMessage('Error uploading image:', error)
      setError(true)
    }
    setImgCoverFile({
      image: null,
      imageUrl: null
    })
  };
  
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

  const handleUploadImage = async (event) => {
    event.preventDefault();
    try {
      const outputData = new FormData(event.currentTarget);
      const formData = {
        image_name: imgFile.image?.name,
        image: imgFile?.imageUrl,
        email: userInf0?.email
      }
      const { data } = await axios.put(`/api/users/upload_profile_images`, formData, {
        headers: {
          'Content-Type': "application/json", // Set the correct Content-Type header
        },
      });
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'image was uploaded', severity: 'success'}});
      dispatch({ type: 'UPLOAD_IMAGE', payload: {...state.uploadImage, change: true} });
    } catch (error) {
      console.error('Error uploading image:', error);
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: `Error uploading image ${error}`, severity: 'error'}});
      setErrorMessage('Error uploading image:', error)
      setError(true)
    }
    setImgFile({
      image: null,
      imageUrl: null
    })
  };

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
      if(emptyCartItems) {
        dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'sorry, first you must select product', severity: 'warning'}});
        router.push('/');
        return;
      }
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
      const { data } = await axios.put('/api/users/upload', formData);
      dispatch({ type: 'PERSONAL_INFO', payload: formData });
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully added personal info', severity: 'success'}});
      setChangeUserInfo(false);
  };

  const handleEdit = () => {
      dispatch({ type: 'PERSONAL_REMOVE' });
      Cookies.remove('personalInfo');
      setChangeUserInfo(true);
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'now you can edit personal info', severity: 'warning'}});
  };

  return (
    <ProfileLayout>
      <ThemeProvider theme={theme}>
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
          <Container component="div" maxWidth="xl">
            <CssBaseline />
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'left', py: 3, mt: 3, position: 'relative'}}>
              <Box component="form" onSubmit={handleUploadCoverImage} sx={{position: 'relative', width: '100%', height: '200px'}}>
                <Box component="label" onChange={handleCoverImageChoose} htmlFor="cover_photo">
                  {
                    imgCoverFile.imageUrl ?
                      <Box sx={{ overflow: 'hidden', borderRadius: '20px', boxShadow: '0 5px 20px lightGray', '& img': {objectFit: 'cover'}, position: 'relative', width: '100%', height: '200px' }}>
                        <Image
                          fill
                          src={imgCoverFile?.imageUrl !== null ? imgCoverFile?.imageUrl : userInfo?.cover_photo}
                          alt={imgCoverFile.image?.name}
                        />
                      </Box>
                        :
                      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '20px', position: 'relative', overflow: 'hidden', border: 'thin dashed lightGrey', width: '100%', height: '200px', '& img': {objectFit: 'cover'}}}>
                        {
                          userInfo?.cover_photo ?
                          <Box sx={{ overflow: 'hidden', boxShadow: '0 5px 20px lightGray', '& img': {objectFit: 'cover'}, position: 'relative', width: '100%', height: '200px' }}>
                            <Image
                              fill
                              src={userInfo?.cover_photo}
                              alt={userInfo?.name}
                            />
                          </Box>
                          :
                          <Box sx={{width: '50%', height: 'auto'}}>
                            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 3}}>
                              <PhotoSizeSelectActualIcon sx={{color: 'grey', fontSize: '2rem'}} />
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                              <Box sx={{display: 'flex', alignItems: 'baseline', width: '25ch', height: '100%'}} component="label" onChange={handleCoverImageChoose} htmlFor="cover_photo">
                                <Typography sx={{fontSize: '1rem', textAlign: 'center', color: theme.palette.primary.main}} component="span">
                                  Upload a file
                                  <Typography component="span" sx={{fontSize: '.75rem', pl: 1, color: theme.palette.secondary.main}}>
                                    or drag and drop PNG, JPG, GIF up to 10MB
                                  </Typography>
                                </Typography>
                                <Box sx={{display: 'none'}} component="input" type="file" name="cover_photo" id="cover_photo"/>
                              </Box>
                            </Box>
                            
                          </Box>
                        }
                      </Box>
                  }
                  {
                    imgCoverFile.imageUrl === null ?
                    <Box sx={{position: 'absolute', bottom: 10, right: 10, zIndex: 1, width: 40, height: 40, '&:hover button': {bgcolor: theme.palette.primary.bgdLight}, cursor: 'pointer' }} component="span">
                      <IconButton sx={{ bgcolor: theme.palette.primary.white, zIndex: -1 }} color='dashboard' variant="outlined">
                        <PhotoSizeSelectActualIcon />
                      </IconButton>
                    </Box>
                    :
                    <Box sx={{position: 'absolute', bottom: 10, right: 10, width: 40, height: 40, zIndex: 1, '&:hover button': {bgcolor: theme.palette.primary.bgdLight}, cursor: 'pointer' }}>
                      <IconButton type='submit' sx={{ bgcolor: theme.palette.primary.white }} color='dashboard' variant="outlined">
                        <FileUploadIcon />
                      </IconButton>
                    </Box>
                  }
                  <Box sx={{display: 'none'}} component="input" type="file" name="cover_photo" id="cover_photo"/>
                </Box>
              </Box>
              <Box component="form" onSubmit={handleUploadImage} sx={{position: 'absolute', bottom: 0, left: 0}}>
                <Box component="label" onChange={handleImageChoose} htmlFor="photo">
                  {
                    imgFile.imageUrl ?
                      <Box sx={{ borderRadius: '100%', overflow: 'hidden', boxShadow: '0 5px 20px lightGray', '& img': {objectFit: 'cover'}, position: 'relative', width: 100, height: 100 }}>
                        <Image
                          fill
                          src={imgFile.imageUrl !== null ? imgFile.imageUrl : userInfo.image}
                          alt={userInfo.name}
                        />
                      </Box>
                        :
                      <IconButton sx={{ p: 0 }}>
                        <Avatar sx={{ width: 100, height: 100 }} alt={userInf0 ? userInfo.name : 'Avatar'} src={ !userInfo ? (userInf0.image === '' ? '/images/fake.jpg' : userInf0.image) : userInfo?.image } />
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
            </Box>
            <Box
              sx={{
                marginTop: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
            {
              !emptyUserInfo &&
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  defaultValue={userInfo?.name}
                  disabled={!changeUserInfo && !emptyUserInfo}
                  id="name"
                  label="Name"
                  name="name"
                  error={errors.name}
                />
                {
                  errors.name && 
                  <FormHelperText error>{snack.message}</FormHelperText>
                }
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  defaultValue={userInf0?.email}
                  disabled={!changeUserInfo && !emptyUserInfo}
                  id="email"
                  label="Email Address"
                  name="email"
                  error={errors.email}
                />
                {
                  errors.email && 
                  <FormHelperText error>{snack.message}</FormHelperText>
                }
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="text"
                  id="birthday"
                  label="Birthday"
                  name="birthday"
                  defaultValue={userInf0?.birthday}
                  disabled={!changeUserInfo && !emptyUserInfo}
                  error={errors.birthday}
                />
                {
                  errors.birthday && 
                  <FormHelperText error>{snack.message}</FormHelperText>
                }
                <TextField
                  margin="normal"
                  fullWidth
                  id="company"
                  label="Company"
                  name="company"
                  defaultValue={userInf0?.company}
                  disabled={!changeUserInfo && !emptyUserInfo}
                  error={errors.company}
                />
                {
                  errors.company && 
                  <FormHelperText error>{snack.message}</FormHelperText>
                }
                <TextField
                    margin="normal"
                    type="number"
                    fullWidth
                    defaultValue={userInf0 ? userInf0.vatNumber : ''}
                    disabled={!changeUserInfo && !emptyUserInfo}
                    id="vatNumber"
                    label="VAT Number"
                    name="vatNumber"
                  />         
                  {
                    errors.vatNumber && 
                    <FormHelperText error>{snack.message}</FormHelperText>
                  }
                  {
                    changeUserInfo &&
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      type='submit'
                    >
                      Save
                    </Button>
                  }
              </Box>
            }
            {
              !changeUserInfo && !emptyUserInfo &&
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, '&:hover': { backgroundColor: theme.palette.secondary.main, textDecoration: 'none' } }}
                onClick={handleEdit}
              >
                change personal info
              </Button>
            }
            </Box>
          </Container>
        }
      </ThemeProvider>
    </ProfileLayout>
  );
}