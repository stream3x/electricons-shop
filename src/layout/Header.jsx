import React, { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
// import InputBase from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Wishlist from '@mui/icons-material/FavoriteBorderOutlined';
import CompareIcon from '@mui/icons-material/RepeatOutlined';
import { styled, alpha } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { Divider, Grid, useMediaQuery } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import BusinessIcon from '@mui/icons-material/Business';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import theme from '../theme';
import Logo from '../assets/Logo';
import NavTabs from '../components/NavTabs';
import MenuIcon from '@mui/icons-material/Menu';
import DropdownMenu from '../components/DropdownMenu';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import SwipeableCartDrawer from '../components/SwipeableCartDrawer';
import Link from '../Link';
import Cookies from 'js-cookie';
import SwipeableNavDrawer from '../components/SwipeableNavDrawer';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import Image from 'next/image';

const pagesTop = [{name:'About', link: '/about', icon: <InfoIcon />}, {name:'Store', link: '/store', icon: <BusinessIcon />}, {name:'Blog', link: '/blog', icon: <RssFeedIcon />}];
const loged = ['Profile', 'Admin', 'Logout'];
const logedout = ['Login', 'Sign in'];
const pages = [{name:'Sale', link: '/on-sale'}, {name:'Mobile', link: '/mobile'}, {name:'Brands', link: '/brands'}, {name:'Terms and Services', link: '/terms'}, {name:'policies privacy', link: '/privacy'} ];

const Search = styled('form')(({ theme }) => ({
  position: 'relative',
  flexWrap: 'nowrap',
  display: 'flex',
  borderRadius: theme.palette.shape.borderRadius,
  border: `thin solid ${theme.palette.secondary.borderColor}`,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.down('xs')]: {
    marginLeft: theme.spacing(3),
    width: '20ch',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const StyledInputBase = styled(TextField)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-root': {
    borderColor: 'transparent',
    borderRightColor: 'transparent',
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    padding: 0,
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      width: '20ch',
    },
  },
  '& fieldset': {
    border: 'none'
  }
}));

const StyledInputButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.palette.inputButtonShape.borderRadius,
  margin: '-1px',
  padding: '.5em 2em',
  '&:hover': {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.secondary.main,
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  },
}));

export default function Header(props) {
  const { isVisible, storeInfo } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElDropdown, setAnchorElDropdown] = useState(null);
  const matches = useMediaQuery('(min-width: 600px)');
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [query, setQuery] = useState('');
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const { data } = await axios.get('/api/products');

      if(active) {
        setOptions([...data]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const submitHandler = (e) => {
    e.preventDefault();
    const queryRemoveSpace = `${query.replace(/ /g, '+')}`;
    const addQuery = `query=${queryRemoveSpace}`
    if(router.pathname === '/category/[[...slug]]') {
      router.push(`/search?query=${query}`);
    }else if(router.asPath === `/search?query=`) {
      router.push(`/search?query=${query}`);
    }else if(router.asPath === `/search`) {
      router.push(`/search?query=${query}`);
    }else {
      router.push(router.asPath === `/search?` || router.asPath === `/` ? `/search?${addQuery}` : `${router.asPath}` + `&query=${queryRemoveSpace}` );
    }
  };

  const handleClick = (event) => {
    setAnchorElDropdown(event.currentTarget);
  };
  const handleCloseDropdown = () => {
    setAnchorElDropdown(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    setAnchorElUser(null);
    dispatch({ type: 'USER_LOGOUT'});
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'you are successfully logged out', severity: 'warning'}});
    Cookies.remove('userInfo');
    router.push('/');
  };  

  const openDropdown = Boolean(anchorElDropdown);
  const isMenuOpen = Boolean(anchorEl);
  const isMenuUserOpen = Boolean(anchorElUser);

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleCloseUserMenu}
    >
      <MenuItem>Profile</MenuItem>
      <MenuItem>My account</MenuItem>
    </Menu>
  );
  
 
  
  return (
    <React.Fragment>
      <CssBaseline />
        <AppBar sx={{ transform: isVisible && matches ? 'translateY(-147px)' : (isVisible && !matches ? 'translateY(-80px)' : 'translateY(0px)'), transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms', bgcolor: theme.palette.primary.white }} elevation={isVisible ? 4 : 0} color="default">
          <Container maxWidth="xl">
          <CssBaseline />
            <Toolbar sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <Box sx={{ flexGrow: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', '& > :not(style) + :not(style)': { ml: 2 } }}>
                {pagesTop.map((page) => (
                  <Box key={page.name} sx={{display: 'flex', 'hr': { marginLeft: 2}, '&:last-child hr': {display: 'none'}, '& a': {textDecoration: 'none'} }}>
                  {page.icon}
                      <Link
                        href={page.link}
                        sx={{ my: 2, color: theme.palette.secondary.main, display: 'block', m: 0 }}
                        passHref
                      >
                      {page.name}
                      </Link>
                    <Divider variant="middle" orientation="vertical" flexItem />
                  </Box>
                ))}
              </Box>
              <Box sx={{ flexGrow: 0, display: { xs: 'none', sm: 'flex'} }}>
                <Tooltip title={userInfo ? `Open ${userInfo.name} menu` : 'Open menu'}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ width: 30, height: 30 }} alt={userInfo ? userInfo.name : 'Avatar'} src={ userInfo && (userInfo.image === '' ? '/images/fake.jpg' : userInfo.image)} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px', display: { xs: 'none', md: 'flex' } }}
                  id="menu-user"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={isMenuUserOpen}
                  onClose={handleCloseUserMenu}
                >
                {
                  userInfo ?
                  (
                    <Box>
                      <MenuItem sx={{ '& a': {textDecoration: 'none' } }} onClick={handleCloseUserMenu}>
                        <Link href={`/user/${userInfo._id}`} passHref>
                          {loged[0]}
                        </Link>
                      </MenuItem>
                      {
                        userInfo.isAdmin &&
                        <MenuItem sx={{ '& a': {textDecoration: 'none' } }} onClick={handleCloseUserMenu}>
                          <Link sx={{ textDecoration: 'none' }} href={`/admin/${userInfo._id}`} passHref>
                            {loged[1]}
                          </Link>
                        </MenuItem>
                      }
                      <MenuItem onClick={handleLogout}>
                          {loged[2]}
                      </MenuItem>
                    </Box>

                  ) : (
                    <Box>
                      <MenuItem sx={{ '& a': {textDecoration: 'none'}}} onClick={handleCloseUserMenu}>
                        <Link href="/login" passHref>
                          {logedout[0]}
                        </Link>
                      </MenuItem>
                      <MenuItem sx={{ '& a': {textDecoration: 'none', color: theme.palette.secondary.main}}} onClick={handleCloseUserMenu}>
                        <Link href="/signin" passHref>
                          {logedout[1]}
                        </Link>
                      </MenuItem>
                    </Box>
                  )
                }
                </Menu>
              </Box>
            </Toolbar>
            <Toolbar disableGutters sx={{ justifyContent: 'space-between', alignItems: 'end', py: 1, }}>
              <Grid container>
                <Grid item xs={9} sm={6} md={4} lg={3}>
                  <Logo logoSrc={storeInfo[0]} sx={{width: 290, height: 60}} viewBox="0 0 306 76"/>
                </Grid>
                <Grid item sm={6} md={8} lg={9} sx={{ display: { xs: 'none', sm: 'flex', justifyContent: 'flex-start', alignItems: 'end' } }}>
                  <NavTabs pages={pages} />
                </Grid>
                <Grid item xs={3} sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'flex-end', alignItems: 'end' }}>
                  <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title={userInfo ? userInfo.name : "Open user menu"}>
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar alt={userInfo ? userInfo.name : ''} src={ userInfo && (userInfo.image === '' ? '/images/fake.jpg' : userInfo.image)} />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: '45px', display: { xs: 'flex', md: 'none' } }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={isMenuUserOpen}
                      onClose={handleCloseUserMenu}
                    >
                      {
                        userInfo ?
                        (
                          <Box>
                            <MenuItem sx={{ '& a': {textDecoration: 'none' } }} onClick={handleCloseUserMenu}>
                              <Link href="/user/${id}">
                                {loged[0]}
                              </Link>
                            </MenuItem>
                            {
                              userInfo.isAdmin &&
                              <MenuItem sx={{ '& a': {textDecoration: 'none' } }} onClick={handleCloseUserMenu}>
                              <Link href={`/admin/${userInfo._id}`}>
                                {loged[1]}
                              </Link>
                            </MenuItem>
                            }
                            <MenuItem onClick={handleLogout}>
                                {loged[2]}
                            </MenuItem>
                          </Box>
      
                        ) : (
                          <Box>
                            <MenuItem sx={{ '& a': {textDecoration: 'none' } }} onClick={handleCloseUserMenu}>
                              <Link href="/login">
                                {logedout[0]}
                              </Link>
                            </MenuItem>
                            <MenuItem sx={{ '& a': {textDecoration: 'none', color: theme.palette.secondary.main} }} onClick={handleCloseUserMenu}>
                              <Link href="/signin">
                                {logedout[1]}
                              </Link>
                            </MenuItem>
                          </Box>
                        )
                      }
                    </Menu>
                  </Box>     
                </Grid>
              </Grid>    
            </Toolbar>
            <Toolbar sx={{p: {xs: 0, sm: 'inherit'}}}>
              <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', width: '100%', postion: 'relative' }}>
                {
                  matches ? 
                  <React.Fragment>
                    <Tooltip title="Dropdown menu">
                      <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                      >
                        <MenuIcon />
                      </IconButton>
                    </Tooltip>
                    <DropdownMenu
                    openDropdown={openDropdown}
                    anchorElDropdown={anchorElDropdown}
                    handleCloseDropdown={handleCloseDropdown}
                    isVisible={isVisible}
                    />
                  </React.Fragment>
                  :
                  <SwipeableNavDrawer />
                }
                <Search onSubmit={submitHandler}>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <Autocomplete
                    id="asynchronous"
                    sx={{ width: '100%' }}
                    open={open}
                    onOpen={() => {
                      setOpen(true);
                    }}
                    onClose={() => {
                      setOpen(false);
                    }}
                    onChange={(option, value) => setQuery(value ? value.title : '')}
                    isOptionEqualToValue={(option, value) => option.title === value.title}
                    getOptionLabel={(option) => option.title || option.subCategory}
                    options={options}
                    loading={loading}
                    getOptionDisabled={(option) =>
                      option.inStock === 0
                    }
                    renderOption={(props, option) => (
                      <React.Fragment>
                        {
                          matches ?
                          <Box key={option.title} component="li" sx={{ '& > img': { flexShrink: 1 } }} {...props}>
                            <Box sx={{ minWidth: '30px', width: '30px', height: '30px', position: 'relative', mr: .25}}>
                              <Image
                                loading="lazy"
                                fill
                                sizes="(max-width: 768px) 50vw, (min-width: 1200px) 50vw, 33vw"
                                src={option.images[0].image}
                                alt={option.title}
                              />
                            </Box>
                            <Typography component="span" variant='caption' sx={{ p: 0, mr: .25 }} color="primary">
                              <Link href={`product/${option.slug}`} passHref> {option.title}</Link>
                            </Typography>      
                            <Typography sx={{ p: 0, mr: .25 }} color="secondary" component="span" variant='caption'>
                            | brand:
                              <Typography color="primary" component="span" variant='caption'>{option.brand}</Typography>
                            </Typography>
                            <Typography sx={{ p: 0, mr: .25 }} color="secondary" component="span" variant='caption'>
                            | category: 
                              <Link href={`category/${option.categoryUrl}`} passHref> {option.category}</Link>
                              /
                              <Link href={`category/${option.categoryUrl}/${option.subCategoryUrl}`} passHref> {option.subCategory}</Link>
                            </Typography>
                            <Typography sx={{ p: 0, mr: .25 }} color="secondary" component="span" variant='caption'>
                              | price:  
                              <Typography color="primary" component="span" variant='caption'> {option.price}
                              </Typography>
                            </Typography>             
                            <Typography sx={{ p: 0, mr: .25 }} color="secondary" component="span" variant='caption'> {option.inStock > 0 ? "- in stock" : "- out of stock"}
                            </Typography>
                          </Box>
                          :
                          <Box key={option.title} component="li" sx={{ '& > img': { flexShrink: 0 }, display: 'flex' }} {...props}>
                            <Box sx={{width: {xs: '30px', md: '30px'}, height: {xs: '30px', md: '30px'}, position: 'relative'}}>
                              <Image
                                loading="lazy"
                                fill
                                sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw"
                                src={option.images[0].image}
                                alt={option.title}
                              />
                            </Box>
                            <Typography sx={{px: 1, flex: '0 0 70%', maxWidth: '70%', fontSize: '10px', overflow: 'hidden' }} color="primary" component="span">
                              <Link sx={{overflow: 'hidden'}} href={`product/${option.slug}`} passHref> {option.title}</Link>
                            </Typography>
                            <Typography sx={{px: 1, fontSize: '10px', overflow: 'hidden' }} color="secondary" component="span"> {option.price}
                            </Typography>
                          </Box>
                        }
                      </React.Fragment>
                    )}
                    renderInput={(params) => (
                      <StyledInputBase
                        {...params}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search…"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loading ? <CircularProgress color="primary" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                  <StyledInputButton type='submit'>Search</StyledInputButton>
                </Search>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: 'none', sm: 'flex', md: 'flex' } }}>
                  <IconButton size="large" aria-label="show 4 new mails" sx={{ backgroundColor: theme.palette.badge.bgd }} color="inherit">
                    <Badge sx={{ 'span': {top:'-20%', right:'-50%'} }} badgeContent={4} color="secondary">
                      <CompareIcon color="badge" />
                    </Badge>
                  </IconButton>
                  <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                    sx={{ backgroundColor: theme.palette.badge.bgd, ml: 2 }}
                  >
                    <Badge sx={{ 'span': {top:'-20%', right:'-50%'} }} badgeContent={7} color="secondary">
                      <Wishlist color="badge.bgd"/>
                    </Badge>
                  </IconButton>
                  <SwipeableCartDrawer cart={cart}/>
                </Box>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        {renderMenu}
        <Toolbar id="back-to-top-anchor" />
    </React.Fragment>
  )
}
