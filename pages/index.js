import * as React from 'react';
import Box from '@mui/material/Box';
import HeroCarousel from '../src/components/HeroCarousel';
import Product from '../models/Product';
import db from '../src/utils/db';

export async function getStaticProps() {
  await db.connect();
  const product = await Product.find({}).lean();
  await db.disconnect();

  if (!product) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      product: product.map(db.convertDocToObject),
    },
  }
};

export default function Index(props) {
  return (
      <Box sx={{ my: 4 }}>
        <HeroCarousel data={props}/>
      </Box>
  );
}
