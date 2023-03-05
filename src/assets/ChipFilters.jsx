import React from 'react';
import { Chip, ListItem, Paper } from '@mui/material';

export default function ChipFilters(props) {
  const { chipData, handleChangeSubCat, handleChangeTopCat } = props;
  console.log(chipData);
  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 0.5,
        m: 0,
      }}
      component="ul"
    >
      {
        chipData.map((data, i) => (
          <ListItem sx={{width: 'auto'}} key={data.key}>
            <Chip
              label={`${Object.keys(data)}`}
              onDelete={() => handleChangeSubCat}
            />
          </ListItem>
          ))
      }
    </Paper>
  )
}
