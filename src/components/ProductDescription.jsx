// components/ProductDescription.js
import { Box, TextareaAutosize, Typography } from '@mui/material';
import { useState } from 'react';

const ProductDescription = () => {
  const [description, setDescription] = useState('');

  const formatText = () => {
    // Formatiranje teksta prema potrebama
    // Na primer, zamenjivanje novih redova sa <br> tagom
    const formattedText = description.replace(/\n/g, '<p style="margin: 0; padding: 3px 0" />');

    // Prikazivanje formatiranog teksta
    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  return (
    <Box sx={{my: 1}}>
      <Typography component="label" variant='h6'>Unos Opisa Proizvoda</Typography>
      <TextareaAutosize
        name="description"
        required
        fullWidth
        id="description"
        placeholder="Detaljan opis proizvoda"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxRows={20}
        minRows={4}
        aria-label="empty textarea"
        style={{ width: '100%', resize: 'vertical', padding: '8px' }}
      />
      {formatText()}
    </Box>
  );
};

export default ProductDescription;