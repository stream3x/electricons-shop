import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import CardProduct from "./CardProduct";
import { Grid, useMediaQuery } from "@mui/material";
import dynamic from 'next/dynamic';
import { useState } from "react";
import Slider from "react-slick";

function HeroCarousel({ hero_products }) {
  const [carouselPoroduct, setCarouselPoroduct] = useState([]);
  const matches = useMediaQuery('(min-width: 600px)');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await hero_products;
        setCarouselPoroduct(res);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Grid sx={{height: !matches ? 'auto' : '500px', p: 0, mt: 0}} container spacing={3}>
      <Grid className="grid-slider" item xs={12} sm={8}>
        <Box className="slick-wrap_box" sx={{height: '100%'}}>
          <Slider {...settings}>
          {
              carouselPoroduct.map((product, index) => (
                product.category === 'Desktop computers' &&
                  <CardProduct key={index} loading product={product} cardHeight="calc(450px - 8px)" imgWidth={'980px'} imgHeigth={'442px'} variantSubtitle="p" variantTitle="h3" moveContent="translateX(0px)" />
              ))
            }
          </Slider>
        </Box>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Grid sx={{height: '100%'}} container spacing={3}>
          <Grid sx={{height: {xs: 'auto', sm: '225px'}}} item xs={12}>
            <Box sx={{height: '100%'}}>
              <Slider {...settings}>
              {
                  carouselPoroduct.map((product, index) => (
                    product.category === 'Laptop computers' &&
                      <CardProduct key={index} loading product={product} cardHeight="calc(225px - 8px)" imgWidth={'480px'} imgHeigth={'217px'} variantSubtitle="caption" variantTitle="h4" index={index} />
                  ))
                }
              </Slider>
            </Box>
          </Grid>
          <Grid sx={{height: {xs: 'auto', sm: '225px'}}} item xs={12}>
            <Box>
              <Slider {...settings}>
              {
                  carouselPoroduct.map((product, index) => (
                    product.category === 'Smartphones' &&
                      <CardProduct key={index} loading product={product} cardHeight="calc(225px - 8px)" imgWidth={'480px'} imgHeigth={'217px'} variantSubtitle="caption" variantTitle="h6" moveContent="translateX(0px)" />
                  ))
                }
              </Slider>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>   
  );
}

export default dynamic(() => Promise.resolve(HeroCarousel), { ssr: false });