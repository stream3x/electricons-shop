import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import FormHelperText from '@mui/material/FormHelperText';
import { Avatar } from '@mui/material';
import theme from '../../src/theme';
import { Store } from '../../src/utils/Store';
import IconButton from '@mui/material/IconButton';
import ProfileLayout from "../../src/components/ProfileLayout"
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

export default function ProfileInfo() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const userInf0 = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const { snack, cart: {cartItems, personalInfo} } = state;
  const [willLogin, setWillLogin] = useState(false);
  const [willRegister, setWillRegister] = useState(false);
  const [forInvoice, setForInvoice] = useState(0);
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
  const [confirmPassword, setConfirmPassword] = useState({
    showPassword: false,
    confirmError: false
  });
  const pattern= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const emptyPersonalInfo = personalInfo !== null ? Object.keys(personalInfo).length === 0 : true;
  const emptyUserInfo = userInf0 !== null ? Object.keys(userInf0).length === 0 : true;
  const emptyCartItems = Object.keys(cartItems).length === 0;
  const [error, setError] = React.useState(false);
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

      setConfirmPassword({
        confirmError: false,
      });

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
      dispatch({ type: 'PERSONAL_INFO', payload: formData });
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'successfully added personal info', severity: 'success'}});
  };

  const handleEdit = () => {
      dispatch({ type: 'PERSONAL_REMOVE' });
      Cookies.remove('personalInfo');
      dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'now you can edit personal info', severity: 'warning'}});
  };

  return (
    <ProfileLayout>
      <ThemeProvider theme={theme}>
        <Container component="div" maxWidth="xl">
          <CssBaseline />
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'left', py: 3, mt: 3}}>
            <Box component="form" onSubmit={handleUploadImage} sx={{position: 'relative'}}>
              <Box component="label" onChange={handleImageChoose} htmlFor="photo">
                {
                  imgFile.imageUrl ?
                    <Box sx={{ borderRadius: '100%', overflow: 'hidden', boxShadow: '0 5px 20px lightGray', mt: -5, '& img': {objectFit: 'contain'}, position: 'relative', width: 100, height: 100 }}>
                      <Image
                        fill
                        src={imgFile.imageUrl ? imgFile.imageUrl : userInf0.image}
                        alt={userInf0.name}
                      />
                    </Box>
                      :
                    <IconButton sx={{ p: 0, mt: -5 }}>
                      <Avatar sx={{ width: 100, height: 100 }} alt={userInf0 ? userInf0.name : 'Avatar'} src={ userInf0 && (userInf0.image === '' ? '/images/fake.jpg' : userInf0.image)} />
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
            emptyPersonalInfo && !emptyUserInfo &&
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
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
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
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
                type="date"
                id="birthday"
                label="Birthday"
                name="birthday"
                autoComplete="birthday"
                autoFocus
                InputLabelProps={{
                  shrink: true,
                }}
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
                autoComplete="company"
                autoFocus
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
                  id="vatNumber"
                  label="VAT Number"
                  name="vatNumber"
                />         
                {
                  errors.vatNumber && 
                  <FormHelperText error>{snack.message}</FormHelperText>
                }
            </Box>
          }
          {
            emptyPersonalInfo && emptyUserInfo &&
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              type='submit'
            >
              Save
            </Button>
          }
          {
            !emptyUserInfo &&
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
      </ThemeProvider>
    </ProfileLayout>
  );
}