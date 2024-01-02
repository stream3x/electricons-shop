import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Link from '../Link';
import { Divider, Tooltip } from '@mui/material';
import ButtonAccordion from '../assets/ButtonAccordion';

const MainListItems = () => {
  const userInf0 = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userInfo')) : null;

  return (
    <React.Fragment>
      <Link href={`/backoffice/${userInf0?._id}/dashboard`}>
        <Tooltip title="Dashboard" placement="right-start">
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </Tooltip>
      </Link>
      <Link href={`/backoffice/${userInf0?._id}/orders`}>
        <Tooltip title="Orders" placement="right-start">
          <ListItemButton>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Orders" />
          </ListItemButton>
        </Tooltip>
      </Link>
      <Link href={`/backoffice/${userInf0?._id}/customers`}>
        <Tooltip title="Customers" placement="right-start">
          <ListItemButton>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Customers" />
          </ListItemButton>
        </Tooltip>
      </Link>
      <Link href={`/backoffice/${userInf0?._id}/statistics`}>
        <Tooltip title="Statistic" placement="right-start">
          <ListItemButton>
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Statistics" />
          </ListItemButton>
        </Tooltip>
      </Link>
      <ListItemButton>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Integrations" />
      </ListItemButton>
      <Divider sx={{ my: 1 }} />
      <ListSubheader component="div" inset>
        Management
      </ListSubheader>
      <ButtonAccordion slug={userInf0?._id} />
      <Link href={`/backoffice/${userInf0?._id}/test`}>
        <Tooltip title="Test" placement="right-start">
          <ListItemButton>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Test" />
          </ListItemButton>
        </Tooltip>
      </Link>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Year-end sale" />
      </ListItemButton>
    </React.Fragment>

  )
};
export default MainListItems;