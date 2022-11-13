import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import data from '../utils/data';
import category from '../utils/category';
import { Accordion, AccordionDetails, AccordionSummary, Grid, ListItem, Typography } from '@mui/material';
import Link from '../Link';
import theme from '../theme';

export default function DropdownMenu(props) {
  const { openDropdown, anchorElDropdown , handleCloseDropdown, isVisible } = props;
  const { products } = data;
  const { category_products } = category;
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const defaultTop = '50px!important';

  return (
    <Menu
        anchorEl={anchorElDropdown}
        id="account-menu"
        open={openDropdown}
        onClose={handleCloseDropdown}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 300,
            top: isVisible && defaultTop,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              left: 12,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <MenuItem>
          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="ul"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Categories
              </ListSubheader>
            }
          >
          {
            category_products.map((item, index) => (
              item ? (
                  <Accordion
                    elevation={0}
                    TransitionProps={{ unmountOnExit: true }}
                    key={index}
                    component="li"
                    expanded={expanded === item.title}
                    onChange={handleChange(item.title)}
                    >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls={`${item.title} controls`}
                      id={`${item.title} panel`}
                    >
                    <Link href={item.categoryUrl} underline="hover" sx={{display: 'flex'}}>
                      <Avatar alt={item.title} src={item.avatar} /> 
                      <Typography color="secondary" sx={{ width: '100%', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                        {item.title}
                      </Typography>
                    </Link>
                    </AccordionSummary>
                    <AccordionDetails sx={{position: 'absolute', left: '100%', top: 0, backgroundColor: theme.palette.primary.contrastText, width: '500px', paddingBottom: '8px', marginLeft: '8px'}}>
                      <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Link href={item.categoryUrl} underline="hover" sx={{display: 'flex'}}>
                          <Typography color="secondary" component="h5" variant="p">
                          {item.title}
                          </Typography>
                        </Link>
                      </Grid>
                    {
                      products.map((sub, index) => (
                        sub.category === item.category &&
                          <Grid key={index} item xs={4}>
                            <Link href={`${sub.slug}`} underline="hover" sx={{display: 'flex'}}>
                              <Typography color="secondary.lightGrey" component="h6" variant="p">
                              {sub.title}
                              </Typography>
                            </Link>
                          </Grid>
                      ))
                    }
                      </Grid>
                    </AccordionDetails>                  
                  </Accordion>
              ) : (
                <Accordion
                  elevation={0}
                  TransitionProps={{ unmountOnExit: true }}
                  key={index}
                  >
                  <AccordionSummary
                    aria-controls={`${item.title} controls`}
                    id={`${item.title} panel`}
                  >
                    <Link href={item.path} underline="hover" sx={{display: 'flex'}}>
                      <Avatar alt={item.title} src={item.avatar} />
                      <Typography sx={{ width: '33%', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                        {item.title}
                      </Typography>
                    </Link>
                  </AccordionSummary> 
                </Accordion>
              )
            ))
          }
          </List>
        </MenuItem>
      </Menu>
  );
}