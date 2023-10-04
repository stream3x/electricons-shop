import React, { useContext, useEffect, useState } from 'react';
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
import CartIcon from '@mui/icons-material/ShoppingCartOutlined';
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
const pagesTopInBlog = [{name:'About', link: '/about', icon: <InfoIcon sx={{color: '#fff'}} />}, {name:'Shop', link: '/', icon: <CartIcon sx={{color: '#fff'}} />}];
const loged = ['Profile', 'Backoffice', 'Logout'];
const logedout = ['Login', 'Sign in'];
const pages = [
  {
    name:'Sale',
    link: '/on-sale',
    subItems: [
      {subName: 'Laptops', item: [{name: 'Acer Aspire', link: 'acer-notebook'}, {name: 'Lenovo', link: 'lenovo-laptop'}, {name: 'Toshiba Sattelite', link: 'toshiba-satellite'}]}
    ],
    products: [{name: 'Acer Aspire', img: '/images/acer-laptop.png'}]
  },
  {
    name:'Mobile',
    link: '/mobile',
    subItems: [
      {subName: 'Smartphones', item: [{name: 'Nokia Seven', link: 'nokia-seven-mobile'}, {name: 'Xiaomi 10', link: 'xiaomi-10-phone'}, {name: 'Huawei 14', link: 'huawei-s14x-elite'}]},
      {subName: 'Headphone', item: [{name: 'Bluethooth', link: ''}, {name: 'Wirelessheadphone', link: ''}, {name: 'Earbuds', link: ''}]}
    ],
    products: [{name: 'Huawei 14 elite', img: '/images/huawei.jpg'}]
  },
  {
    name:'Brands',
    link: '/brands',
    subItems: null,
    products: [
      {name: 'AMD', img: '/images/AMD-logo.png'},
      {name: 'Dell', img: '/images/dell-logo.png'},
      {name: 'Acer', img: '/images/acer-logo.png'},
      {name: 'Huawei', img: '/images/huawei-logo.jpeg'}
    ]
  },
  {
    name:'Terms and Services',
    link: '/terms',
    subItems: null,
    products: [
      {name: '', img: ''},
    ]
  },
  {
    name:'policies privacy',
    link: '/privacy',
    subItems: null,
    products: [
      {name: '', img: ''},
    ]
  }
 ];

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

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElDropdown, setAnchorElDropdown] = useState(null);
  const matches = useMediaQuery('(min-width: 1200px)');
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { comparasion: { compareItems }, wishlist: { wishItems }, uploadImage: {change} } = state;
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  const [isVisible, setIsVisible] = useState(false);
  const [storeInfo, setStoreInfo] = useState([]);
  const isNotBlog = router.pathname !== '/blog';
  const isNotPost = router.pathname !== '/blog/post/[slug]';
  const isNotCat = router.pathname !== '/blog/category/[[...slug]]';
  const userInf0 = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const [userInfo, setUserInfo] = useState(null);

  function toggleVisibility() {
    const visibleBtn = window.scrollY;
    visibleBtn > 50 ? setIsVisible(() => true) : setIsVisible(() => false);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get('/api/users');
        const user = await data.filter(items => items._id === userInf0._id);
        setUserInfo(user[0]);
      } catch (error) {
        console.log(error);
      }
    }
    
    if (change) {
      fetchData();
    }

  }, [change])
  
  React.useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const { data } = await axios.get('/api/products');
console.log(data);
      if(active) {
        setOptions([...data.products]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    let active = true;

    (async () => {
      const { data } = await axios.get('/api/store_info');
      const mainStore = data.filter(store => store.name === "Electricons store");
      if(active) {
        setStoreInfo(mainStore);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const submitHandler = (e) => {
    e.preventDefault();
    const queryRemoveSpace = `${query.replace(/ /g, '+')}`;
    const addQuery = `query=${queryRemoveSpace}`;
    router.push(`/search?${addQuery}`);
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
    setUserInfo(null);
    dispatch({ type: 'PERSONAL_INFO', payload: {}});
    dispatch({ type: 'CART_CLEAR' });
    dispatch({ type: 'ADDRESSES_CLEAR' });
    dispatch({ type: 'SHIPPING_REMOVE' });
    dispatch({ type: 'PAYMENT', payload: {}});
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'you are successfully logged out', severity: 'warning'}});
    Cookies.remove('personalInfo');
    Cookies.remove('cartItems');
    Cookies.remove('addresses');
    Cookies.remove('payment');
    Cookies.remove('shipping');
    Cookies.remove('forInvoice');
    localStorage.removeItem('userInfo');
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
        <AppBar sx={{ transform: isVisible && matches ? 'translateY(-147px)' : (isVisible && !matches ? 'translateY(-140px)' : 'translateY(0px)'), transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms', bgcolor: isNotPost && isNotBlog && isNotCat ? theme.palette.primary.white : theme.palette.primary.main}} elevation={isVisible ? 4 : 0} color="default">
          <Container maxWidth="xl">
          <CssBaseline />
            <Toolbar sx={{ display: { xs: isNotPost && isNotBlog && isNotCat && 'none', sm: 'flex' }, py: '1rem' }}>
              {
                isNotPost && isNotBlog && isNotCat ?
                <Box sx={{ flexGrow: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', '& > :not(style) + :not(style)': { ml: 2 } }}>
                  {
                    pagesTop.map((page) => (
                      <Box key={page.name} sx={{display: 'flex', 'hr': { marginLeft: 2}, '&:last-child hr': {display: 'none'}, '& a': {textDecoration: 'none'} }}>
                          <Link
                            href={page.link}
                            sx={{ my: 2, color: theme.palette.secondary.main, display: 'block', m: 0, display: 'flex' }}
                            passHref
                          >
                          {page.icon}
                          {page.name}
                          </Link>
                        <Divider variant="middle" orientation="vertical" flexItem />
                      </Box>
                    ))
                  }
                </Box>
                :
                <React.Fragment>
                  <Link href="/blog?counter=10">
                    <Image
                      width= {matches ? 280 : 130}
                      height= {50}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                      src='/logo/electricons_logo_blog.svg'
                      alt="logo"
                      quality={35}
                      loading="eager"
                    />
                  </Link>
                  <Box sx={{ flexGrow: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', '& > :not(style) + :not(style)': { ml: 2 } }}>
                    {
                      pagesTopInBlog.map((page) => (
                        <Box key={page.name} sx={{display: 'flex', 'hr': { marginLeft: 2}, '&:last-child hr': {display: 'none'}, '& a': {textDecoration: 'none'} }}>
                          <Link
                            href={page.link}
                            sx={{ my: 2, color: isNotPost && isNotBlog && isNotCat ? theme.palette.secondary.main : '#fff', m: 0 }}
                            passHref
                          >
                          {page.icon}               
                          </Link>
                          <Divider color={theme.palette.primary.white} variant="middle" orientation="vertical" flexItem />
                        </Box>
                      ))
                    }
                  </Box>    
                </React.Fragment>
              }
              <Box sx={{ flexGrow: 0, display: { xs: 'flex', sm: 'flex'} }}>
                <Tooltip title={userInf0 ? `Open ${userInf0.name} menu` : 'Open menu'}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ width: 30, height: 30 }} alt={userInf0 ? userInf0?.name : 'Avatar'} src={ !userInfo ? (userInf0?.image === '' ? '/images/fake.jpg' : userInf0?.image) : userInfo?.image} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px', display: { xs: 'flex', md: 'flex' } }}
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
                  userInf0 ?
                  (
                    <Box>
                      <MenuItem sx={{ '& a': {textDecoration: 'none' } }} onClick={handleCloseUserMenu}>
                        <Link href={`/profile/info`} passHref>
                          {loged[0]}
                        </Link>
                      </MenuItem>
                      {
                        userInf0.isAdmin &&
                        <MenuItem sx={{ '& a': {textDecoration: 'none' } }} onClick={handleCloseUserMenu}>
                          <Link sx={{ textDecoration: 'none' }} href={`/backoffice`} passHref>
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
            {
              !isNotPost && !isNotBlog && !isNotCat && !matches &&
              <Toolbar disableGutters sx={{ justifyContent: 'space-between', alignItems: 'end', py: 1 }}>
                <Grid container spacing={2} sx={{alignItems: 'center', ml: 0, pt: 2 }}>
                  <Grid sx={{ p: '0!important' }} item xs={9} sm={6} md={4} lg={3}>
                    <Link href="/">
                      <Image
                        width= {290}
                        height= {60}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                        src='/logo/electricons_logo_blog.svg'
                        alt="logo"
                        quality={35}
                        loading="eager"
                      />
                    </Link>
                  </Grid>
                  <Grid item sm={6} md={8} lg={9} sx={{ display: { xs: 'none', md: 'flex', justifyContent: 'flex-start', alignItems: 'end' } }}>
                    <NavTabs pages={pages} />
                  </Grid>
                  <Grid item xs={3} sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end', alignItems: 'end' }}>
                    <Box sx={{ flexGrow: 0 }}>
                      <Tooltip title={userInf0 ? userInf0.name : "Open user menu"}>
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                          <Avatar alt={userInf0 ? userInf0.name : ''} src={ userInf0 && (userInf0.image === '' ? '/images/fake.jpg' : userInf0.image)} />
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
                          userInf0 ?
                          (
                            <Box>
                              <MenuItem sx={{ '& a': {textDecoration: 'none' } }} onClick={handleCloseUserMenu}>
                                <Link href="/profile/info">
                                  {loged[0]}
                                </Link>
                              </MenuItem>
                              {
                                userInf0.isAdmin &&
                                <MenuItem sx={{ '& a': {textDecoration: 'none' } }} onClick={handleCloseUserMenu}>
                                  <Link sx={{ textDecoration: 'none' }} href={`/backoffice`} passHref>
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
            }
            {
              isNotPost && isNotBlog && isNotCat &&
              <Toolbar disableGutters sx={{ justifyContent: 'space-between', alignItems: 'end', py: 1 }}>
                <Grid container spacing={2} sx={{alignItems: 'center', ml: 0, pt: 2 }}>
                  <Grid sx={{ p: '0!important' }} item xs={9} sm={6} md={4} lg={3}>
                      <Logo logoSrc={storeInfo[0]} sx={{width: 290, height: 60}} viewBox="0 0 290 60"/>
                  </Grid>
                  <Grid item sm={6} md={8} lg={9} sx={{ display: { xs: 'none', sm: 'flex', justifyContent: 'flex-start', alignItems: 'end' } }}>
                    <NavTabs pages={pages} />
                  </Grid>
                  <Grid item xs={3} sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'flex-end', alignItems: 'end' }}>
                    <Box sx={{ flexGrow: 0 }}>
                      <Tooltip title={userInf0 ? userInf0.name : "Open user menu"}>
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                          <Avatar alt={userInf0 ? userInf0.name : ''} src={ userInf0 && (userInf0.image === '' ? '/images/fake.jpg' : userInf0.image)} />
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
                          userInf0 ?
                          (
                            <Box>
                              <MenuItem sx={{ '& a': {textDecoration: 'none' } }} onClick={handleCloseUserMenu}>
                                <Link href="/profile/info">
                                  {loged[0]}
                                </Link>
                              </MenuItem>
                              {
                                userInf0.isAdmin &&
                                <MenuItem sx={{ '& a': {textDecoration: 'none' } }} onClick={handleCloseUserMenu}>
                                  <Link sx={{ textDecoration: 'none' }} href={`/backoffice`} passHref>
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
            }
            {
              isNotPost && isNotBlog && isNotCat &&
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
                    <SwipeableNavDrawer pagesTop={pagesTop} />
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
                        <Box>
                          {
                            matches ?
                            <Box key={option.title} component="li" sx={{ '& > img': { flexShrink: 1 }, width: '100%' }} {...props}>
                              <Box sx={{ minWidth: '40px', width: '40px', height: '40px', position: 'relative', '& > img': {objectFit: 'contain'}, position: 'relative', mr: .25}}>
                                <Image
                                  loading="lazy"
                                  fill
                                  sizes="(max-width: 768px) 50vw, (min-width: 1200px) 50vw, 33vw"
                                  src={option.images[1].image ? option.images[1].image : '/images/no-image.jpg'}
                                  alt={option.title}
                                />
                              </Box>
                              <Typography component="span" variant='caption' sx={{ p: 0, mr: .25, felxGrow: 1 }} color="primary">
                                <Link href={`product/${option.slug}`} passHref> {option.title}</Link>
                              </Typography>      
                              <Typography sx={{ p: 0, mr: .25, felxGrow: 1 }} color="secondary" component="span" variant='caption'>
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
                                <Typography color="primary" component="span" variant='caption'> {"$"}{option.price}
                                </Typography>
                              </Typography>             
                              <Typography sx={{ p: 0, mr: .25 }} color={option.inStock > 0 ? "secondary" : "error"} component="span" variant='caption'> {option.inStock > 0 ? "- in stock" : "- out of stock"}
                              </Typography>
                            </Box>
                            :
                            <Box key={option.title} component="li" sx={{ '& > img': { flexShrink:  1 }, display: 'flex', position: 'relative' }} {...props}>
                              <Box sx={{ minWidth: '40px', width: '40px', height: '40px', position: 'relative', '& > img': {objectFit: 'contain'} }}>
                                <Image
                                  loading="lazy"
                                  fill
                                  sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw"
                                  src={option.images[1].image ? option.images[1].image : '/images/no-image.jpg'}
                                  alt={option.title}
                                />
                              </Box>
                              <Typography sx={{px: 1, flex: 1, fontSize: '10px', overflow: 'hidden' }} color="primary" component="span">
                                <Link sx={{overflow: 'hidden'}} href={`product/${option.slug}`} passHref> {option.title}</Link>
                              </Typography>
                              <Typography sx={{px: 1, fontSize: '12px', overflow: 'hidden' }} color="secondary" component="span">     {"$"}{option.price}
                              </Typography>
                              <Typography sx={{ p: 0, mr: .25 }} color={option.inStock > 0 ? "secondary" : "error"} component="span" variant='caption'> {option.inStock > 0 ? "- in stock" : "- out of stock"}
                              </Typography>
                            </Box>
                          }
                        </Box>
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
                    <Link sx={{width: '100%', height: '100%'}} href={'/compare'}>
                      <IconButton size="large" aria-label="show compare items" sx={{ backgroundColor: theme.palette.badge.bgd }} color="inherit">
                        <Badge sx={{ 'span': {top:'-20%', right:'-50%'} }} badgeContent={compareItems.length > 0 ? compareItems.length : "0"} color="secondary">
                          <CompareIcon color="badge" />
                        </Badge>
                      </IconButton>
                    </Link>
                    <Link sx={{width: '100%', height: '100%'}} href={userInf0 ? "/profile/wishlist" : '/wishlist'}>
                      <IconButton
                        size="large"
                        aria-label="show wishlist items"
                        color="secondary"
                        sx={{ backgroundColor: theme.palette.badge.bgd, ml: 2 }}
                      >
                        <Badge sx={{ 'span': {top:'-20%', right:'-50%'} }} badgeContent={wishItems.length > 0 ? wishItems.length : "0"} color="secondary">
                          <Wishlist color="badge.bgd"/>
                        </Badge>
                      </IconButton>
                    </Link>
                    <SwipeableCartDrawer />
                  </Box>
                </Box>
              </Toolbar>
            }
          </Container>
        </AppBar>
        {renderMenu}
        <Toolbar id="back-to-top-anchor" />
    </React.Fragment>
  )
}
