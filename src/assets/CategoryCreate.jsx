import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { Button, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, Stack, useMediaQuery } from '@mui/material';
import theme from '../theme';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Image from 'next/image';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function CategoryCreate(props) {
  const { open, setOpen } = props;
  const [checked, setChecked] = React.useState([]);
  const [category, setCategory] = React.useState([]);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [imgAvatarFile, setImgAvatarFile] = React.useState([]);
  const [chipData, setChipData] = React.useState([]);

  React.useEffect(() => {
    setChipData(imgAvatarFile);
  }, [imgAvatarFile])
  

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip?.image?.name !== chipToDelete?.image?.name));
    setImgAvatarFile((prevImgFile) => prevImgFile.filter((item) => item?.image?.name !== chipToDelete?.image?.name));
  };

  React.useEffect(() => {
    const fetchCategories = async ()=> {
      const { data } = await axios.get('/api/category');
      setCategory(data);
    }
    fetchCategories();
  }, [])
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange1 = (event, index) => {
    const newChecked = [...checked];
    newChecked[index] = event.target.checked;
    setChecked(newChecked);
  };

  const handleChange2 = (event, index) => {
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
      categoryName: formOutput.get('category'),
      avatar: '',
      slug: '',
      subCategory: [
        {
          url: '',
          subCategoryName: '',
          topCategoryName: '',
          topCategoryUrl: ''
        }
      ]
    }
    console.log(formData);
  }
console.log(imgAvatarFile);
  return (
    <div>
      {
        category?.map(item => (
          <Box key={item._id}>
            <FormControlLabel
              label={item?.categoryName}
              control={
                <Checkbox
                  checked={checked[0] && checked[1]}
                  indeterminate={checked[0] !== checked[1]}
                  onChange={handleChange1}
                />
              }
            />
            {
             item?.subCategory && item?.subCategory?.map(subItem => (
                <Box key={subItem._id} sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                  <FormControlLabel
                    label={subItem?.subCategoryName}
                    control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
                  />
                </Box>
              ))
            }
          </Box>
        ))
      }
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title">
          {"Create New Category for this Product"}
        </DialogTitle>
        <DialogActions sx={{flexWrap: 'wrap'}}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 0 }}>
                <FormControl fullWidth sx={{ p: 1 }} variant="standard">
                  <InputLabel htmlFor="category"></InputLabel>
                  <Input
                    id="category"
                    name='category'
                    startAdornment={<InputAdornment position="start">Category Name:</InputAdornment>}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ p: 1 }} variant="standard">
                  <InputLabel htmlFor="slug"></InputLabel>
                  <Input
                    id="slug"
                    name="slug"
                    startAdornment={<InputAdornment position="start">Category Slug:</InputAdornment>}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ p: 1 }} variant="standard">
                  <InputLabel htmlFor="subcategory"></InputLabel>
                  <Input
                    id="subcategory"
                    name='subcategory'
                    startAdornment={<InputAdornment position="start">Subcategory Name:</InputAdornment>}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ p: 1 }} variant="standard">
                  <InputLabel htmlFor="subcategory-slug"></InputLabel>
                  <Input
                    id="subcategory-slug"
                    name="subcategory-slug"
                    startAdornment={<InputAdornment position="start">Subcategory Slug:</InputAdornment>}
                  />
                </FormControl>
                
                <Button fullWidth size='small' type='submit' autoFocus>
                  submit categories
                </Button>
              </Box>
              <Button sx={{mt: 5}} autoFocus onClick={handleClose}>
                Close
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{px: 3, py: 0, display: 'flex', justifyContent: 'flex-end'}}>  
                {
                  <Box sx={{width: '200px'}} component="form" method='POST' onSubmit={handleAvatarSubmit}>
                    <InputLabel sx={{textAlign: 'center'}} htmlFor="category">Brand Image</InputLabel>
                    <Stack sx={{display: chipData.length > 0 && 'none'}} direction="row" justifyContent="center" alignItems="center" spacing={2}>
                      <Box sx={{width: '100%', p: 2}}>
                        <Button component="label" onChange={handleAvatarChoose} htmlFor="file-avatar" sx={{border: 'thin dashed grey', width: '100%', height: '100px', display: 'flex', justifyContent: 'center'}} startIcon={<CloudUploadIcon />}>
                          Upload
                        <Box sx={{display: 'none'}} accept="image/jpg image/png image/jpeg" component="input" type="file" name="file-avatar" id="file-avatar"/>
                        </Button>
                      </Box>
                    </Stack>
                    {
                      chipData.map(item => (
                        <Box sx={{position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap'}} key={item?.image?.lastModified}>
                          <IconButton sx={{position: 'absolute', top: -25, right: -20, zIndex: 1}} size='small' onClick={handleDelete(item)}>
                            <HighlightOffIcon />
                          </IconButton>
                          <Box sx={{width: '150px', height: '100px', position: 'relative'}}>
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
                      submit image
                    </Button>
                  </Box>
                }
              </Box>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
}
