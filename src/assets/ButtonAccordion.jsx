import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import StoreIcon from '@mui/icons-material/Store';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ListIcon from '@mui/icons-material/List';
import Link from '../Link';
import { Tooltip } from '@mui/material';

export default function ButtonAccordion(props) {
  const { slug } = props;
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          
        </ListSubheader>
      }
    >
      <Tooltip title="Shop" placement="right-start">
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <StoreIcon />
          </ListItemIcon>
          <ListItemText primary="Shop" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </Tooltip>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link href={`/backoffice/${slug}/list`}>
            <Tooltip title="Product List" placement="right-start">
              <ListItemButton sx={{ pl: {xs: 3, md: 4} }}>
                <ListItemIcon>
                  <ListIcon />
                </ListItemIcon>
                <ListItemText primary="List" />
              </ListItemButton>
            </Tooltip>
          </Link>
          <Link href={`/backoffice/${slug}/create`}>
            <Tooltip title="Create new" placement="right-start">
              <ListItemButton sx={{ pl: {xs: 3, md: 4} }}>
                <ListItemIcon>
                  <BorderColorIcon />
                </ListItemIcon>
                <ListItemText primary="Create" />
              </ListItemButton>
            </Tooltip>
          </Link>
        </List>
      </Collapse>
    </List>
  );
}
