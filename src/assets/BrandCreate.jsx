import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { Button, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, Select, Stack, Typography, useMediaQuery } from '@mui/material';
import theme from '../theme';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Image from 'next/image';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MenuItem from '@mui/material/MenuItem';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function BrandCreate(props) {
  const { open, setOpen } = props;
  const [checked, setChecked] = React.useState([]);
  const [children, setChildren] = React.useState([]);
  const [category, setCategory] = React.useState([]);
  const [brands, setBrands] = React.useState([]);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [imgAvatarFile, setImgAvatarFile] = React.useState([]);
  const [chipData, setChipData] = React.useState([]);
  const [parentCatName, setParentCatName] = React.useState("New Brand");
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);  

  const handleDelete = (chipToDelete) => () => {
    setImgAvatarFile((prevImgFile) => prevImgFile.filter((item) => item?.image?.name !== chipToDelete?.image?.name));
  };

  React.useEffect(() => {
    fetchCategories();
  }, [loading]);

  const fetchCategories = async ()=> {
    const { data } = await axios.get('/api/products/fetchByCategories');
    setBrands(data?.brands)
    setLoading(false);
    handleClose();
  }
  
  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleChange1 = (event, index) => {
    const newChecked = [...checked];
    newChecked[index] = event.target.checked;
    setChecked(newChecked);
  };

  function handleAvatarChoose(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImgAvatarFile([
          ...imgAvatarFile,
          {            
            image: file,
            imageUrl: reader.result
          }
        ]);
        e.target.value = ''
    }
    reader.readAsDataURL(file);
  }

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      images: imgAvatarFile?.map(item => item),
    }
    try {
    console.log(formData);
      
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formOutput = new FormData(e.currentTarget);
    const formData = {
      brand: formOutput.get('brand'),
      brandSlug: formOutput.get('brand-slug'),
      brandImg: imgAvatarFile[0].image.name,
      brandUrl: imgAvatarFile[0].imageUrl,
    }
    console.log(formData);
    if (formData.brand === '') {
      return setError('please enter brand name');
    }
    if (formData.brandSlug === '') {
      return setError('please enter brand slug');
    }
    if (formData.brandImg === '') {
      return setError('please enter brand image');
    }
    
    try {
      const { data } = axios.post('/api/brand/upload_brand_image', formData);
      setBrands((prev)=> [
        ...prev,
        formData?.brand
      ])
      handleClose();
    } catch (error) {
      console.log('error to upload', error);
    }
    
  }

console.log(brands, imgAvatarFile);
  return (
    <Box>
      {
        brands?.map((item, index) => (
          <Box key={item}>
            <FormControlLabel
              label={item}
              control={
                <Checkbox
                  checked={checked[0]}
                  indeterminate={checked[0]}
                  onChange={handleChange1}
                />
              }
            />
          </Box>
        ))
      }
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
      >
        {
          error ? 
          <DialogTitle color="red" id="dialog-title">
          {error}
          </DialogTitle>
          :
          <DialogTitle id="dialog-title">
            {"Create Brand for this Product"}
          </DialogTitle>
        }
        <DialogActions sx={{flexWrap: 'wrap'}}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 0 }}>
                  <FormControl fullWidth sx={{ p: 1 }} variant="standard">
                    <InputLabel htmlFor="brand"></InputLabel>
                    <Input
                      id="brand"
                      name='brand'
                      startAdornment={<InputAdornment position="start">Brand Name:</InputAdornment>}
                    />
                  </FormControl>
                  <FormControl fullWidth sx={{ p: 1 }} variant="standard">
                    <InputLabel htmlFor="brand-slug"></InputLabel>
                    <Input
                      id="brand-slug"
                      name="brand-slug"
                      startAdornment={<InputAdornment position="start">Brand Slug:</InputAdornment>}
                    />
                  </FormControl>
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                  <Button size='small' type='submit' autoFocus>
                    submit brand
                  </Button>
                </Box>
              </Box>
              <Button sx={{mt: 5}} autoFocus onClick={handleClose}>
                Close
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{px: 3, py: 0, display: 'flex', justifyContent: 'flex-end'}}>  
                {
                  <Box sx={{width: '200px'}} component="form" method='POST' onSubmit={handleAvatarSubmit}>
                    <InputLabel sx={{textAlign: 'center', mb: 1}} htmlFor="category">Brand Icon:</InputLabel>
                    <Stack sx={{display: imgAvatarFile.length > 0 && 'none'}} direction="row" justifyContent="center" alignItems="center" spacing={2}>
                      <Box sx={{width: '100%', p: 2}}>
                        <Button component="label" onChange={handleAvatarChoose} htmlFor="file-avatar" sx={{border: 'thin dashed grey', width: '100%', height: '100px', display: 'flex', justifyContent: 'center', px: 3}} startIcon={<CloudUploadIcon />}>
                          Upload
                        <Box sx={{display: 'none'}} accept="image/jpg image/png image/jpeg" component="input" type="file" name="file-avatar" id="file-avatar"/>
                        </Button>
                      </Box>
                    </Stack>
                    {
                      imgAvatarFile.map(item => (
                        <Box sx={{position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap'}} key={item?.image?.lastModified}>
                          <IconButton sx={{position: 'absolute', top: -20, right: -20, zIndex: 10, backgroundColor: '#fff', width: '30px', height: '30px', borderRadius: '100%'}} size='small' onClick={handleDelete(item)}>
                            <HighlightOffIcon />
                          </IconButton>
                          <Box sx={{width: '150px', height: '100px', position: 'relative', zIndex: 0}}>
                            <Image
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              src={item?.imageUrl}
                              alt={item?.image?.name}
                            />
                          </Box>
                        </Box>
                      ))
                    }
                    <Button fullWidth type='submit' size='small'>
                      add icon
                    </Button>
                  </Box>
                }
              </Box>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
