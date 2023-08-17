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
import { Store } from '../utils/Store';

const MainListItems = () => {
  const { state } = React.useContext(Store);
  const { session } = state;

  return (
    <React.Fragment>
      <Link href={`/backoffice/${session?._id}/dashboard`}>
        <Tooltip title="Dashboard" placement="right-start">
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </Tooltip>
      </Link>
      <Link href={`/backoffice/${session?._id}/orders`}>
        <Tooltip title="Orders" placement="right-start">
          <ListItemButton>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Orders" />
          </ListItemButton>
        </Tooltip>
      </Link>
      <Link href={`/backoffice/${session?._id}/customers`}>
        <Tooltip title="Customers" placement="right-start">
          <ListItemButton>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Customers" />
          </ListItemButton>
        </Tooltip>
      </Link>
      <ListItemButton>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItemButton>
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
      <ButtonAccordion slug={session?._id} />
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Last quarter" />
      </ListItemButton>
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