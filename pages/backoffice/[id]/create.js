import React from 'react';
import { Box, Button, Grid, Paper, TextField, TextareaAutosize, Typography } from '@mui/material';
import styled from '@emotion/styled';
import dynamic from 'next/dynamic';
import axios from 'axios';
import theme from '../../../src/theme';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Link from '../../../src/Link';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-mention';
import 'quill-mention/dist/quill.mention.css';
import 'quill-better-table';
import Quill from 'quill';
import Mention from 'quill-mention';
import BetterTable from 'quill-better-table';

Quill.register('modules/mention', Mention);
Quill.register('modules/better-table', BetterTable);

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link', 'image', 'video'],
    ['blockquote', 'code-block'],
    [{ 'align': [] }],
    [{ 'color': [] }, { 'background': [] }],
    ['clean'],
    ['table'],
  ],
  mention: {
    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
    mentionDenotationChars: ['@'],
    source: function (searchTerm, renderList, mentionChar) {
      // Implement mention source logic here
      // For example, fetch users based on the searchTerm from your database
    },
  },
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'link', 'image', 'video',
  'blockquote', 'code-block', 'align', 'color', 'background',
  'table',
];

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

  const formatText = () => {
    // Formatiranje teksta prema potrebama
    // Na primer, zamenjivanje novih redova sa <br> tagom
    const formattedText = description.replace(/\n/g, '<p style="margin: 0; padding: 3px 0" />');

    // Prikazivanje formatiranog teksta
    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  React.useEffect(() => {
    // Ponovo registrujemo better-table modul kako bi mogao biti učitan nakon prvog renderovanja
    Quill.register('modules/better-table', BetterTable);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formOutput = new FormData(e.currentTarget);
    const formData = {
      title: formOutput.get('title'),
      shortDescription: formOutput.get('short-description'),
      description: formOutput.get('description')
    }
    console.log(formData);
  }

  const saveToDatabase = () => {
    console.log('Description saved:', description);

    // Implementirajte logiku za čuvanje u MongoDB ovde
  };

  

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
                  required
                  fullWidth
                  id="title"
                  label="Naziv proizvoda unesite ovde"
                  sx={{mb: 1}}
                />
                <TextareaAutosize
                  name="short-description"
                  required
                  fullWidth
                  id="short"
                  placeholder="Kratak opis proizvoda"
                  maxRows={10}
                  minRows={4}
                  aria-label="empty textarea"
                  style={{ width: '100%', resize: 'vertical', padding: '8px' }}
                  sx={{my: 1}}
                />
                <ReactQuill
                 modules={modules}
                 formats={formats}
                  value={description}
                  onChange={(value) => setDescription(value)}
                />
                <Button onClick={saveToDatabase}>Save</Button>
              </Box>
            </Paper>
          </Grid>
          {/* Recent Deposits */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box dangerouslySetInnerHTML={{ __html: description }} />
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