import React from 'react';
import { Box, Button, Divider, Grid, Paper, Stack, TextField, TextareaAutosize, Typography } from '@mui/material';
import styled from '@emotion/styled';
import dynamic from 'next/dynamic';
import axios from 'axios';
import theme from '../../../src/theme';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Link from '../../../src/Link';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ChipsImages from '../../../src/components/ChipsImages';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


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

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.white,
  border: 'thin solid lightGrey',
  borderLeft: '5px solid black',
}));

const QuillStyled = styled(ReactQuill)(({ theme }) => ({
  '& .ql-toolbar.ql-snow': {
    borderRadius: '3px 3px 0 0'
  },
  '& .ql-container.ql-snow': {
    borderRadius: '0 0 3px 3px'
  }
}))

function CreateNewItems() {
  const userInf0 = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const [description, setDescription] = React.useState('');
  const [error, setError] = React.useState('');
  const [imgFile, setImgFile] = React.useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formOutput = new FormData(e.currentTarget);
    const formData = {
      title: formOutput.get('title'),
      shortDescription: formOutput.get('short-description'),
      description: description,
      images: imgFile.map(item => item.imageUrl),
    }
   

    try {
    console.log(formData);
      
    } catch (error) {
      console.log(error);
    }
  }  

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
                <Box sx={{py: 3, }}>
                  <Typography component="label">Detail Description</Typography>
                  <QuillStyled
                    modules={modules}
                    formats={formats}
                    value={description}
                    onChange={(value) => setDescription(value)}
                  />
                </Box>
                <Button type='submit'>Submit</Button>
              </Box>
            </Paper>
          </Grid>
          {/* Recent Deposits */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                py: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography component="p" variant='p' sx={{px: 2, py: 1, fontWeight: 'bold'}}>Product Images</Typography>
              <Divider />
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <Box sx={{width: '100%', p: 2}}>
                  <Button component="label" onChange={handleImageChoose} htmlFor="file" sx={{border: 'thin dashed grey', width: '100%', height: '100px', display: 'flex', justifyContent: 'center'}} startIcon={<CloudUploadIcon />}>
                    Upload
                  <Box sx={{display: 'none'}} accept="image/jpg image/png image/jpeg" component="input" type="file" name="file" id="file"/>
                  </Button>
                </Box>
              </Stack>
              <ChipsImages selectedFile={imgFile} setImgFile={setImgFile} />
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
             
            </Paper>
          </Grid>
        </Grid>
      }
    </Box>
  )
}

export default dynamic(() => Promise.resolve(CreateNewItems), { ssr: false });