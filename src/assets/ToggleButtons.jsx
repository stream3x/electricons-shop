import * as React from 'react';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function ToggleButtons(props) {
  const { handleChangeView, view} = props;

  return (
    <ToggleButtonGroup
      sx={{ flexGrow: 0, mx: 3, display: {xs: 'none', sm: 'block'} }}
      orientation="horizontal"
      value={view}
      exclusive
      onChange={handleChangeView}
    >
      <ToggleButton value="module" aria-label="module">
        <ViewModuleIcon />
      </ToggleButton>
      <ToggleButton value="list" aria-label="list">
        <ViewListIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}