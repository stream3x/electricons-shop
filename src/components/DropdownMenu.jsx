import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import data from '../utils/data';
import category from '../utils/category';
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material';
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
        <MenuItem sx={{'&:hover': {bgcolor: 'background.paper'}}}>
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
                      sx={{ '& a': {textDecoration: 'none' }, '&:hover a': {textDecoration: 'none' } }}
                    >
                    <Link href={item.categoryUrl} sx={{display: 'flex'}}>
                      <Avatar alt={item.title} src={item.avatar} /> 
                      <Typography color="secondary" sx={{ width: '100%', flexShrink: 0, display: 'flex', alignItems: 'center', '&:hover': {color: theme.palette.primary.main} }}>
                        {item.title}
                      </Typography>
                    </Link>
                    </AccordionSummary>
                    <AccordionDetails sx={{position: 'absolute', left: '106%', top: 0, backgroundColor: theme.palette.primary.contrastText, width: '500px', height: 'auto', py: 5, px: 3, marginLeft: '8px'}}>
                      <Grid container spacing={2}>
                    {
                      item.subCategory.map((sub, index) => (
                        
                          <Grid sx={{ '& a': {textDecoration: 'none' }, '&:hover a': {textDecoration: 'none' } }} key={index} item xs={4}>
                            <Link href={sub.url} passHref>
                              <Typography sx={{pb: 2, '&:hover': {color: theme.palette.secondary.lightGrey}}} color="secondary" component="h5" variant="p">
                              {sub.label}
                              </Typography>
                            </Link>
                            {
                              products.map((prod, i) => (
                                sub.label === prod.subCategory &&
                                <Link key={i} href={`${prod.slug}`} underline="hover" sx={{display: 'flex', pb: 1}}>
                                  <Typography sx={{'&:hover': {color: theme.palette.primary.main}}} color="secondary.lightGrey" component="h6" variant="p">
                                  {prod.title}
                                  </Typography>
                                </Link>
                              ))
                            }
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