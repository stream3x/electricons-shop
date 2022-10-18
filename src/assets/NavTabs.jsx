import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import NextLink from 'next/link';

function LinkTab(props) {
  return (
    <NextLink href={props.href} passHref>
      <Tab
        component="a"
        sx={{ textTransform: 'capitalize' }}
        onClick={(event) => {
          event.preventDefault();
        }}
        {...props}
      />
    </NextLink>
  );
}

export default function NavTabs(props) {
  const { pages } = props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="nav tabs pages">
        {
          pages.map((page, index)=> (
            <LinkTab label={page.name} key={page.name + index} href={page.link}/>
          ))
        }
      </Tabs>
    </Box>
  );
}