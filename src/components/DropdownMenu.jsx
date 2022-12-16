import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import data from '../utils/data';
import category_data from '../utils/category';
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material';
import Link from '../Link';
import theme from '../theme';

export default function DropdownMenu(props) {
  const { openDropdown, anchorElDropdown , handleCloseDropdown, isVisible } = props;
  const { products } = data;
  const { categories } = category_data;
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    console.log(panel, isExpanded);
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
            categories.map((item, index) => (
              item ? (
                  <Accordion
                    elevation={0}
                    TransitionProps={{ unmountOnExit: true }}
                    key={item.categoryName + index}
                    component="li"
                    expanded={expanded === item.categoryName}
                    onChange={handleChange(item.categoryName)}
                    >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls={`${item.categoryName} controls`}
                      id={`${item.categoryName} panel`}
                      sx={{ '& a': {textDecoration: 'none' }, '&:hover a': {textDecoration: 'none' } }}
                    >
                    <Link href={`/category/${item.slug}`} sx={{display: 'flex'}}>
                      <Avatar onClick={handleCloseDropdown} alt={item.categoryName} src={item.avatar} /> 
                      <Typography onClick={handleCloseDropdown} color="secondary" sx={{ width: '100%', flexShrink: 0, display: 'flex', alignItems: 'center', '&:hover': {color: theme.palette.primary.main} }}>
                        {item.categoryName}
                      </Typography>
                    </Link>
                    </AccordionSummary>
                    <AccordionDetails onClick={handleCloseDropdown} sx={{position: 'absolute', left: '106%', top: 0, backgroundColor: theme.palette.primary.contrastText, width: '500px', height: 'auto', py: 5, px: 3, marginLeft: '8px'}}>
                      <Grid container spacing={2}>
                    {
                      item.subCategory.map((sub, index) => ( 
                          <Grid sx={{ '& a': {textDecoration: 'none' }, '&:hover a': {textDecoration: 'none' } }} key={index} item xs={4}>
                            <Link href={`/category/${item.slug}/${sub.url}`} passHref>
                              <Typography sx={{pb: 2, '&:hover': {color: theme.palette.primary.main}}} color="secondary" component="h5" variant="p">
                              {sub.url}
                              </Typography>
                            </Link>
                            {
                              products.map((prod, i) => (
                                sub.url === prod.subCategoryUrl &&
                                <Link key={prod.slug + i} href={`/product/${prod.slug}`} underline="hover" sx={{display: 'flex', pb: 1}}>
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
                  onClick={handleCloseDropdown}
                  >
                  <AccordionSummary
                    aria-controls={`${item.categoryName} controls`}
                    id={`${item.categoryName} panel`}
                  >
                    <Link href={`/product/${item.slug}`} underline="hover" sx={{display: 'flex'}}>
                      <Avatar alt={item.categoryName} src={item.avatar} />
                      <Typography sx={{ width: '33%', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                        {item.categoryName}
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