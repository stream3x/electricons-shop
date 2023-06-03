import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';


export default function ProfileNavigation(props) {
  const { tab, icon } = props;

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItemButton
        >
          <ListItemIcon>
            {icon}
          </ListItemIcon>
          <ListItemText primary={tab} />
        </ListItemButton>
        <Divider />
      </List>
    </Box>
  );
}