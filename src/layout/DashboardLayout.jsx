import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CartIcon from '@mui/icons-material/ShoppingCartOutlined';
import MainListItems from '../components/MainListItems';
import theme from '../theme';
import Link from '../Link';
import { useRouter } from 'next/router';
import { Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';

const drawerWidth = 240;
const loged = ['Profile', 'Backoffice', 'Logout'];
const logedout = ['Login', 'Sign in'];

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);


export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { pathname } = router;
  const { state, dispatch } = React.useContext(Store);
  const { userInfo, snack } = state;
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const segments = pathname.split('/');
  const tabName = segments[segments.length - 1];
  const [open, setOpen] = React.useState(false);

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const isMenuUserOpen = Boolean(anchorElUser);

  const handleLogout = () => {
    setAnchorElUser(null);
    dispatch({ type: 'USER_LOGOUT'});
    dispatch({ type: 'REMOVE_SESSION', payload: null });
    dispatch({ type: 'PERSONAL_REMOVE'});
    dispatch({ type: 'SNACK_MESSAGE', payload: { ...state.snack, message: 'you are successfully logged out', severity: 'warning'}});
    Cookies.remove('userInfo');
    Cookies.remove('personalInfo');
    Cookies.remove('cartItems');
    Cookies.remove('addresses');
    Cookies.remove('payment');
    Cookies.remove('shipping');
    Cookies.remove('forInvoice');
    Cookies.remove('session');
    router.push('/');
  };  

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar sx={{bgcolor: theme.palette.dashboard.main}} position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {capitalizeFirstLetter(tabName)}
            </Typography>
            <Link color={theme.palette.primary.contrastText} href="/">
              <IconButton color="inherit">                
                <CartIcon sx={{ '&:hover': { color: theme.palette.primary.bgdLight}}}/>
              </IconButton>
            </Link>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Box sx={{ flexGrow: 0, pl: 2 }}>
              <Tooltip title={userInfo ? `Open ${userInfo.name} menu` : 'Open menu'}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ width: 30, height: 30 }} alt={userInfo ? userInfo.name : 'Avatar'} src={ userInfo && (userInfo.image === '' ? '/images/fake.jpg' : userInfo.image)} />
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
                userInfo ?
                (
                  <Box>
                    <MenuItem sx={{ '& a': {textDecoration: 'none' } }} onClick={handleCloseUserMenu}>
                      <Link href={`/profile/info`} passHref>
                        {loged[0]}
                      </Link>
                    </MenuItem>
                    {
                      userInfo.isAdmin &&
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
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav" sx={{'& a': {textDecoration: 'none', color: theme.palette.secondary.main}}}>
            <MainListItems />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {children}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}