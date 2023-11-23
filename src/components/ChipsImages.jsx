import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function ChipsImages({ selectedFile, setImgFile }) {
  const [chipData, setChipData] = React.useState(selectedFile);

  React.useEffect(() => {
    setChipData(selectedFile);
  }, [selectedFile])
  

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip?.image?.name !== chipToDelete?.image?.name));
    setImgFile((prevImgFile) => prevImgFile.filter((item) => item?.image?.name !== chipToDelete?.image?.name));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        justifyContent: 'left',
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 1,
        m: 0,
      }}
      component="ul"
    >

        {
          chipData.map(item => (
            item.image === null ?
            null
            :
            <ListItem key={item?.image?.lastModified} sx={{display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
              <Chip
                avatar={<Avatar alt={item?.image?.name} src={item?.imageUrl} />}
                label={item?.image?.name.slice(0, 15)}
                onDelete={handleDelete(item)}
              />
              <Typography sx={{width: '100%'}}>{`veličina slike: ${item && Math.ceil(item?.image?.size/1000) + "kb"}`}</Typography>
            </ListItem>
          ))
        }
    </Paper>
  );
}