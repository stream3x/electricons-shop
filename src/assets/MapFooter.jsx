import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { Box, Button } from '@mui/material';
import theme from '../theme';

export default function MapFooter() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box>
      <Accordion elevation={0} sx={{marginBottom: 5}} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Button
            variant='contained'
            disableElevation
            sx={{
              margin: 'auto',
              borderTopLeftRadius: '0',
              borderTopRightRadius: '0',
              marginTop: expanded ? '-49px' : '-40px',
              backgroundColor: theme.palette.primary.main,
              '&:hover': {backgroundColor: theme.palette.secondary.main}
            }}
          >
            <FmdGoodIcon />
            see map
          </Button>
        </AccordionSummary>
        <AccordionDetails>
          <Box
          component="iframe"
          width="100%"
          height="450px"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d705.5562999472339!2d19.604275529257084!3d44.97973614733325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475ba52b26552769%3A0x67a80158c51d2077!2sAman%20191%20%2C%20Sremska%20Mitrovica!5e0!3m2!1sru!2srs!4v1675550388757!5m2!1sru!2srs"
          >
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}