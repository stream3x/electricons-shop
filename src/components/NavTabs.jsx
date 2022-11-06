import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Link from '../Link';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import theme from '../theme';

function LinkTab(props) {
  return (    
      <Tab
        component="a"
        sx={{ textTransform: 'capitalize' }}
        onClick={(event) => {
          event.preventDefault();
        }}
        selected={props.value}
        href={props.path}
        value={props.value}
        {...props}
      />
  );
}

export default function NavTabs(props) {
  // const navTabActive = Cookies.get('nav-tab-active') ? JSON.parse(Cookies.get('nav-tab-active')) : 0
  const router = useRouter();
  const { pages } = props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    router.push(pages[newValue].link);
  }; 

  return (
    <Box component="nav" sx={{ width: '100%', maxWidth: '100%', display: 'flex', alignItems: 'center' }}>
      <Link href="/">
        <IconButton>
          <HomeIcon sx={{ '&:hover': { color: theme.palette.primary.main }}}/>
        </IconButton>
      </Link>
      <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="nav tabs pages">
        {
          pages.map((page, index)=> (
            <LinkTab key={page.link} value={index} label={page.name} path={page.link}/>
          ))
        }
      </Tabs>
    </Box>
  );
}