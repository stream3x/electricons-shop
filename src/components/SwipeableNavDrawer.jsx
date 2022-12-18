import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import category_data from '../utils/category';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import data from '../utils/data';
import Link from '../Link';
import theme from '../theme';

function ListsItem(props) {
  const { cat, onClose } = props;
  const [open, setOpen] = React.useState(false);
  const [openSub, setOpenSub] = React.useState('');

  function collapseHeandler(e, i) {
    if(e.currentTarget.tabIndex === i) {
      setOpenSub(`open ${i}`);
      console.log(`open ${i}`);
    }
  }

  return (
      <React.Fragment>
        <ListItem key={cat.categoryName} disablePadding>
          <ListItemButton sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', '& a': {textDecoration: 'none'} }} onClick={() => setOpen(!open)}>
          <Link onClick={onClose} href={`/category/${cat.slug}`} sx={{display: 'flex', alignItems: 'center', '&:hover': {color: theme.palette.primary.main} }} color="secondary">
            <Avatar alt={cat.categoryName} src={cat.avatar} /> 
            <ListItemText primary={cat.categoryName} />
          </Link>
            {open ? 
              <ExpandLess />
            :
              <ExpandMore />
            }
          </ListItemButton>
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List sx={{'& a': {textDecoration: 'none'}}} component="ul" disablePadding>
          {
            cat.subCategory.map((sub, i) => (
              <React.Fragment key={sub.url}>
                
                  <ListItem key={sub.url} disablePadding>
                    <ListItemButton tabIndex={i} onClick={(e) => collapseHeandler(e, i)} sx={{ pl: 4, justifyContent: 'space-between' }}>
                      <Link href={`/category/${cat.slug}/${sub.url}`} sx={{display: 'flex', '&:hover': {color: theme.palette.primary.main} }} color="secondary">
                        <ListItemText sx={{'& span': {fontSize: '14px', fontWeight: 'bold', ml: 2} }} onClick={onClose} primary={sub.subCategoryName} />
                      </Link>
                      {openSub === `open ${i}` ? 
                        <ExpandLess />
                      :
                        <ExpandMore />
                      }
                    </ListItemButton>
                  </ListItem>
                <Collapse in={openSub === `open ${i}`} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {
                      data.products.map(prod => (
                        sub.url === prod.subCategoryUrl &&
                        <Link onClick={onClose} underline="none" key={prod.slug} href={`/product/${prod.slug}`} sx={{display: 'flex', pb: 1, '&:hover': {color: theme.palette.primary.main} }} color="secondary.lightGrey">
                          <ListItemButton key={prod.slug} sx={{ pl: 4 }}>                   
                            <ListItemText sx={{'& span': {fontSize: '13px', ml: 2} }} primary={prod.title} />
                          </ListItemButton>
                        </Link>
                      ))
                    }
                  </List>
                </Collapse>
              </React.Fragment>
            ))
          }
          </List>
        </Collapse>
      </React.Fragment>
  )
}
export default function SwipeableNavDrawer() {
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
              aria-labelledby="nested-list-sub-nav"
              >
               {category_data.categories.map((cat, index) => (
                <ListsItem key={cat.categoryName} cat={cat} onClose={toggleDrawer(anchor, false)}/>
               ))}
              </List>
            </Box>
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}