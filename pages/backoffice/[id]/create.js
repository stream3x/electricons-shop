import React, { useMemo } from 'react';
import { Box, Button, Divider, Grid, Paper, Stack, TextField, TextareaAutosize, Typography } from '@mui/material';
import styled from '@emotion/styled';
import dynamic from 'next/dynamic';
import axios from 'axios';
import theme from '../../../src/theme';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Link from '../../../src/Link';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import 'react-quill/dist/quill.snow.css';
import ChipsImages from '../../../src/components/ChipsImages';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CategoryCreate from '../../../src/assets/CategoryCreate';
const Quill = dynamic(() => import('react-quill'), { ssr: false });

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link'],
    ['blockquote'],
    [{ 'align': [] }],
    [{ 'color': [] }, { 'background': [] }],
    ['clean'],
  ]
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'link', 'blockquote', 'align', 'color', 'background'
];

const QuillStyled = styled(Quill)(({ theme }) => ({
  '& .ql-toolbar.ql-snow': {
    borderRadius: '3px 3px 0 0'
  },
  '& .ql-container.ql-snow': {
    borderRadius: '0 0 3px 3px'
  }
}))

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.white,
  border: 'thin solid lightGrey',
  borderLeft: '5px solid black',
}));

function CreateNewItems() {
  const userInf0 = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const [description, setDescription] = React.useState('');
  const [error, setError] = React.useState('');
  const [imgFile, setImgFile] = React.useState([]);
  const [imgWidgetFile, setImgWidgetFile] = React.useState([]);
  const [addSpecifications, setAddSpecifications] = React.useState([NaN]);
  const [specifications, setSpecifications] = React.useState([{ attribute: '', detail: '' }]);

  const isQuill = typeof window !== 'undefined' ? require('quill') : null;

  const formatText = () => {
    // Formatiranje teksta prema potrebama
    // Na primer, zamenjivanje novih redova sa <br> tagom
    const formattedText = description.replace(/\n/g, '<p style="margin: 0; padding: 3px 0" />');

    // Prikazivanje formatiranog teksta
    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  function handleImageChoose(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        setImgFile([
          ...imgFile,
          {            
            image: file,
            imageUrl: reader.result
          }
        ]);
        e.target.value = ''
    }
    reader.readAsDataURL(file);
  }

  function handleWidgetImageChoose(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        setImgWidgetFile([
          ...imgWidgetFile,
          {            
            image: file,
            imageUrl: reader.result
          }
        ]);
        e.target.value = ''
    }
    reader.readAsDataURL(file);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formOutput = new FormData(e.currentTarget);
    const formData = {
      title: formOutput.get('title'),
      shortDescription: formOutput.get('short-description'),
      description: description,
      details: specifications
    }
    try {
    console.log(formData);
      
    } catch (error) {
      console.log(error);
    }
  }

  const handleImageSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      images: imgFile?.map(item => item),
    }
    try {
    console.log(formData);
      
    } catch (error) {
      console.log(error);
    }
  }

  const handleWidgetImageSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      widgetImages: imgWidgetFile?.map(item => item?.imageUrl),
    }
    try {
    console.log(formData);
      
    } catch (error) {
      console.log(error);
    }
  }

  // const handleAddSpecification = (e) => {
   
  //   setAddSpecifications((e, i) => [
  //     ...addSpecifications,
  //     i++
  //   ])
  // }

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { attribute: '', detail: '' }]);
  };

  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecifications = [...specifications];
    updatedSpecifications[index][field] = value;
    setSpecifications(updatedSpecifications);
  };

console.log(specifications, addSpecifications);
  return (
    <Box>
      {
        error ?
          <LabelButton sx={{width: '100%', my: 5, p: 2}}>
            <Typography sx={{m: 0, p: 1, fontSize: {xs: '.875rem', sm: '1.25rem'}}} variant="h5" component="h1" gutterBottom>
            {error}
            </Typography>
          </LabelButton>
         : 
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{display: 'flex', flexWrap: 'wrap', py: 3}}>
                  <Box sx={{flex: 1, order: {xs: 2, md: 1}}}>
                    <Typography component="h2" variant='h6'>Add new product</Typography>
                    <Typography variant='caption'>
                      Fill in the fields below to create a new product
                    </Typography>
                  </Box>
                  <Box sx={{order: {xs: 1, md: 2}, mb: {xs: 3, md: 0}}}>
                    <Link href={`/backoffice/${userInf0?._id}/list`}>
                      <Button variant="outlined" startIcon={<KeyboardBackspaceIcon />}>
                        go to All Products
                      </Button>
                    </Link>
                  </Box>
                </Box>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'auto',
                  }}
                >
                  <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 0 }}>
                    <TextField
                      name="title"
                      fullWidth
                      id="title"
                      label="Product title here..."
                      sx={{mb: 1, pb: 3}}
                    />
                    <Typography component="label">Short Description</Typography>
                    <TextareaAutosize
                      name="short-description"
                      required
                      fullWidth
                      id="short"
                      placeholder="Short description here..."
                      maxRows={10}
                      minRows={4}
                      aria-label="empty textarea"
                      style={{ width: '100%', resize: 'vertical', padding: '8px' }}
                    />
                    <Box sx={{py: 3}}>
                      <Typography component="label">Description</Typography>
                      {
                        isQuill ?
                        <QuillStyled
                          theme="snow"
                          modules={modules}
                          formats={formats}
                          value={description}
                          onChange={(values) => setDescription(values)}
                        />
                        :
                        null
                      }
                    </Box>
                    <Box sx={{py: 3}}>
                      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <Typography component="label">Specification</Typography>
                        <Button size='small' onClick={handleAddSpecification}>{'+ Add Specification'}</Button>
                      </Box>
                      {
                        specifications?.map((item, index) => (
                          <Box key={index} sx={{display: 'flex', flexWrap: 'nowrap'}}>
                            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                              <InputLabel htmlFor={`attribute-${index}`}>*</InputLabel>
                              <Input
                                id={`attribute-${index}`}
                                value={specifications.attribute}
                                onChange={(e) => handleSpecificationChange(index, 'attribute', e.target.value)}
                                startAdornment={<InputAdornment position="start">Attribute:</InputAdornment>}
                              />
                            </FormControl>
                            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                              <InputLabel htmlFor={`detail-${index}`}>*</InputLabel>
                              <Input
                                id={`detail-${index}`}
                                value={specifications.detail}
                                onChange={(e) => handleSpecificationChange(index, 'detail', e.target.value)}
                                startAdornment={<InputAdornment position="start">Detail:</InputAdornment>}
                              />
                            </FormControl>
                          </Box>
                        ))
                      }
                    </Box>
                    <Button type='submit'>Submit</Button>
                  </Box>
                </Paper>
              </Grid>
               {/* Additional Informations */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Grid container spacing={3}>
              {/* Upload Product Images */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    py: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography component="p" variant='p' sx={{px: 2, py: 1, fontWeight: 'bold'}}>Product Images</Typography>
                  <Divider />
                  <Box component="form" method='POST' onSubmit={handleImageSubmit}>
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                      <Box sx={{width: '100%', p: 2}}>
                        <Button component="label" onChange={handleImageChoose} htmlFor="file" sx={{border: 'thin dashed grey', width: '100%', height: '100px', display: 'flex', justifyContent: 'center'}} startIcon={<CloudUploadIcon />}>
                          Upload
                        <Box sx={{display: 'none'}} accept="image/jpg image/png image/jpeg" component="input" type="file" name="file" id="file"/>
                        </Button>
                      </Box>
                    </Stack>
                    <Button type='submit' size='small'>submit</Button>
                  </Box>
                  <ChipsImages selectedFile={imgFile} setImgFile={setImgFile} />
                </Paper>
              </Grid>
              {/* Upload Widget Images */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    py: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography component="p" variant='p' sx={{px: 2, py: 1, fontWeight: 'bold'}}>Widget Images</Typography>
                  <Divider />
                  <Box component="form" method='POST' onSubmit={handleWidgetImageSubmit}>
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                      <Box sx={{width: '100%', p: 2}}>
                        <Button component="label" onChange={handleWidgetImageChoose} htmlFor="file-widget" sx={{border: 'thin dashed grey', width: '100%', height: '100px', display: 'flex', justifyContent: 'center'}} startIcon={<CloudUploadIcon />}>
                          Upload
                        <Box sx={{display: 'none'}} accept="image/jpg image/png image/jpeg" component="input" type="file" name="file-widget" id="file-widget"/>
                        </Button>
                      </Box>
                    </Stack>
                    <Button type='submit' size='small'>submit</Button>
                  </Box>
                  <ChipsImages selectedFile={imgWidgetFile} setImgFile={setImgWidgetFile} />
                </Paper>
              </Grid>
              {/* Upload Widget Images */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    py: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography component="p" variant='p' sx={{px: 2, py: 1, fontWeight: 'bold'}}>Categories</Typography>
                  <Divider />
                  <Box sx={{p: 3}}>
                    <CategoryCreate />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
    </Box>
  )
}

export default dynamic(() => Promise.resolve(CreateNewItems), { ssr: false });