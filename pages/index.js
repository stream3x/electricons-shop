import React from 'react';
import Box from '@mui/material/Box';
import HeroCarousel from '../src/components/HeroCarousel';
import Product from '../models/Product';
import db from '../src/utils/db';
import WidgetCarousels from '../src/components/WidgetCarousels';

export async function getStaticProps() {
  await db.connect();
  const product = await Product.find({}).lean();
  const top_products = await Product.find({inWidget: "top-product"}).lean();
  await db.disconnect();

  if (!product || !top_products) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product: product.map(db.convertDocToObject),
      topProducts: top_products.map(db.convertDocToObject),
    },
  };
}

export default function Index(props) {
  return (
    <Box sx={{ my: 4 }}>
      <Box sx={{backgroundColor: '#f9f9f9', borderRadius: '10px'}}>
        <HeroCarousel data={props} />
      </Box>
      <WidgetCarousels data={props} />
    </Box>
  );
}
