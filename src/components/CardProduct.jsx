import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Link from '../Link';
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';
import theme from '../theme';

export default function CardProduct(props) {
  const { product, cardHeight, imgHeigth, imgWidth } = props;
  const [selected, setSelected] = React.useState('');

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
        <CardActionArea sx={{display: {xs: 'block', sm: 'flex'}, flexDirection: {xs: 'row', sm: 'row-reverse'}, minHeight: cardHeight, position: 'relative'}}>
          {
            <CardMedia sx={{ display: 'flex', justifyContent: {xs: 'center', sm: 'flex-end'}, alignItems: 'center','& img': {width: `${imgWidth}!important`, height: `${imgHeigth}!important`, position: 'relative!important'}, overflow: 'hidden' }} component="div">
              <Image
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                src={product.images[0].image !== '/images/no-image.jpg' ? product.images[0].image : '/images/no-image.jpg'}
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
