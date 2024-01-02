import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Divider, Grid, IconButton, useMediaQuery } from "@mui/material";
import dynamic from 'next/dynamic';
import { useState } from "react";
import WidgetCardProduct from "./WidgetCardProduct";
import SwipeableViews from "react-swipeable-views";
import Skeleton from '@mui/material/Skeleton';
import Avatar from '@mui/material/Avatar';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box id="tab-panel-box">
          {children}
        </Box>
      )}
    </div>
  );
}

function WidgetCarousel({ widgetProducts, title }) {
  const [carouselProduct, setCarouselProduct] = useState([]);
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const singleMaxSteps = carouselProduct && carouselProduct.length;
  const [stopSwipe, setStopSwipe] = useState(false);
  const matches = useMediaQuery('(min-width: 900px)');
  const [loading, setLoading] = React.useState(true);

  const desktop = useMediaQuery('(min-width: 1440px)');
  const laptop = useMediaQuery('(min-width: 1200px)');
  const tablet = useMediaQuery('(min-width: 768px)');
  const mobile = useMediaQuery('(max-width: 766px)');  

  let cardsToShow;
  let cardsToMove;
  let cardsInView;
  
  if(desktop) {
    cardsToShow = 6;
    cardsInView = 12 / cardsToShow;
  }else if(laptop) {
    cardsToShow = 4;
    cardsInView = 12 / cardsToShow;
  }else if(tablet) {
    cardsToShow = 3;
    cardsInView = 12 / cardsToShow;
  }else if(mobile) {
    cardsToShow = 2;
    cardsInView = 12 / cardsToShow;
  }

  const maxSteps = Math.ceil(carouselProduct.length / cardsToShow);
  cardsToMove = Math.floor(carouselProduct.length / cardsToShow);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await widgetProducts;
        setCarouselProduct(res)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData();
  }, [widgetProducts])
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Box sx={{my: 5}}>
      {
        loading ?
        <Box sx={{py: 5}}>
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography variant="h2">{loading ? <Skeleton width={!matches ? 200 : 500} height={36} /> : 'h2'}</Typography>
            <Box sx={{display: 'flex', width: '90px', justifyContent: 'space-between', pb: 1}}>
              <Skeleton  width={40} height={40} variant="circular">
                <Avatar />
              </Skeleton>
              <Skeleton  width={40} height={40} variant="circular">
                <Avatar />
              </Skeleton>
            </Box>
          </Box>
          <Divider />
          <Grid sx={{py: '1rem'}} container spacing={3}>
          {
            carouselProduct.slice(0, cardsToShow).map(skelet => (
              <Grid key={skelet._id} item xs={cardsInView}>
                <Skeleton variant="rectangular" height={380} />
              </Grid>
            ))
          }
          </Grid>
        </Box>
        :
        <Box onMouseLeave={() => setStopSwipe(false)} onMouseEnter={() => setStopSwipe(true)} sx={{ maxWidth: "100%", flexGrow: 1, position: 'relative', '& .MuiBox-root': {p: {xs: 0, lg: 'default'}} }}>
          <Paper
            square
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              height: 150,
              p: 3,
              bgcolor: "transparent"
            }}
          >
          <Box sx={{ maxWidth: "100%", width: '100%', flexGrow: 1, flexWrap: 'wrap', textAlign: 'center' }}>
            <Typography align="left" variant="p" component="h2">
              {title}
            </Typography>
            <Box sx={{p: 0, pt: 1}}>
              <Divider />
            </Box>
          </Box>
          </Paper>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeStep}
            onChangeIndex={handleStepChange}
          >
            {
              carouselProduct.slice(0, maxSteps).map((prod, index) => (
                <TabPanel key={prod._id} value={activeStep} index={index} dir={theme.direction}>
                  <WidgetCardProduct loading cardsToShow={cardsToShow} products={carouselProduct} steps={activeStep} cardsToMove={cardsToMove} cardsInView={cardsInView} />
                </TabPanel>
              ))
            }
          </SwipeableViews>
          <MobileStepper
            steps={maxSteps}
            variant="dots"
            position="static"
            activeStep={activeStep}
            sx={{ position: 'absolute', top: '40px', right: "15px", background: 'transparent', '& .MuiMobileStepper-dots': {display: 'none'} }}
            nextButton={
              <IconButton onClick={handleNext} sx={{border: "thin solid", backgroundColor: theme.palette.primary.contrastText, '&:hover': {backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText}, marginLeft: .5}} aria-label="left" size="small" disabled={activeStep === maxSteps - 1}>
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </IconButton>
            }
            backButton={
              <IconButton onClick={handleBack} sx={{border: "thin solid", backgroundColor: theme.palette.primary.contrastText, '&:hover': {backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText}, marginRight: .5}} aria-label="right" size="small" disabled={activeStep === 0}>
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
              </IconButton>
            }
          />
        </Box>
      }
    </Box>
  );
}

export default dynamic(() => Promise.resolve(WidgetCarousel), { ssr: false });