import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, useMediaQuery } from '@mui/material';
import Link from '../Link';
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';

export default function CardProduct(props) {
  const { product, cardHeight, marginTop, imgHeight, imgWidth } = props;
  const [selected, setSelected] = React.useState('');
  const matches = useMediaQuery('(min-width: 1024px)');

  const handleLoading = (product) => {
    setSelected(product._id);
  };
  
  return (
    <Card sx={{ width: "100%", '& a': {textDecoration: 'none'},  }}>
      <Link sx={{position: 'relative'}} href={`/product/${product.slug}`} onClick={() => handleLoading(product)}>
      {
        product._id === selected &&
        <CircularProgress sx={{position: 'absolute', left: '45%', top: '20%', zIndex: 1, transform: 'translateX(-50%)'}} size={50} />
      }
        <CardActionArea sx={{display: {xs: 'block', sm: 'flex'}, flexDirection: {xs: 'row', sm: 'row-reverse'}, minHeight: cardHeight}}>
          {
            <CardMedia sx={{ justifyContent: {xs: 'center', sm: 'flex-end'}, alignItems: 'center','& img': {width: `${imgWidth}!important`, height: `${imgHeight}`, marginTop: `${marginTop}`}, overflow: 'hidden'  }} component="div">
              <Image
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                src={matches ? product.widgetImages[0].image : product.widgetImages[1].image}
                alt={product.title}
                quality={100}
              />
            </CardMedia>
          }
        </CardActionArea>
      </Link>
    </Card>
  )
}
