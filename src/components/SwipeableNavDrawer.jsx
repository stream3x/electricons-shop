import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Avatar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import category from '../utils/category';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import data from '../utils/data';

function ListsItem(props) {
  const { cat } = props;
  const [open, setOpen] = React.useState(false);

  return (
      <React.Fragment>
        <ListItem key={cat.title} disablePadding>
          <ListItemButton onClick={() => setOpen(!open)}>
            <Avatar alt={cat.title} src={cat.avatar} /> 
            <ListItemText primary={cat.title} />
            {open ? 
              <ExpandLess />
            :
              <ExpandMore />
            }
          </ListItemButton>
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="ul" disablePadding>
          {
            data.products.map(product => (
              product.category === cat.category &&
              <ListItem key={product.title} disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemText primary={product.title} />
                </ListItemButton>
              </ListItem>
            ))
          }
          </List>
        </Collapse>
      </React.Fragment>
  )
}
export default function SwipeableNavDrawer() {
  const [open, setOpen] = React.useState(false);

  const [state, setState] = React.useState({
    left: false
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
      <IconButton onClick={toggleDrawer(anchor, false)}>
        <CloseIcon />
      </IconButton>
      </Box>
      <Divider />
      <List 
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="ul"
      aria-labelledby="nested-list-subheader"
      >
        {category.category_products.map((cat, index) => (
          <React.Fragment>
            <ListItem key={cat.title} disablePadding>
              <ListItemButton onClick={() => setOpen(!open)}>
                <Avatar alt={cat.title} src={cat.avatar} /> 
                <ListItemText primary={cat.title} />
                {open ? 
                  <ExpandLess />
                :
                  <ExpandMore />
                }
              </ListItemButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="ul" disablePadding>
              {
                data.products.map(product => (
                  product.category === cat.category &&
                  <ListItem key={product.title} disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemText primary={product.title} />
                    </ListItemButton>
                  </ListItem>
                ))
              }
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
           <IconButton
              onClick={toggleDrawer(anchor, true)}
              size="small"
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            <Box
              sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
              role="presentation"
              onKeyDown={toggleDrawer(anchor, false)}
            >
              <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <IconButton onClick={toggleDrawer(anchor, false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Divider />
              <List 
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
              component="ul"
              aria-labelledby="nested-list-subheader"
              >
               {category.category_products.map((cat, index) => (
                <ListsItem key={cat.title} cat={cat}/>
               ))}
              </List>
            </Box>
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}