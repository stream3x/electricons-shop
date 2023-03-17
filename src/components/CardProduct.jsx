import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Link from '../Link';
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';

export default function CardProduct(props) {
  const { product, cardHeight, bgImg, imgHeigth, variantTitle, variantSubtitle, moveContent, widthContent } = props;
  const [selected, setSelected] = React.useState('');

  const handleLoading = (product) => {
    setSelected(product._id);
  };
  
  return (
    <Card sx={{ width: "100%", maxHeight: {xs: 'auto', sm: cardHeight}, minHeight: cardHeight, '& a': {textDecoration: 'none'}, backgroundImage: `url(${bgImg})`, backgroundPosition: 'right top', backgroundRepeat: 'no-repeat', backgroundSize: {xs: '210% 100%', sm: 'cover'} }}>
      <Link sx={{position: 'relative'}} href={`/product/${product.slug}`} onClick={() => handleLoading(product)}>
      {
        product._id === selected &&
        <CircularProgress sx={{position: 'absolute', left: '45%', top: '20%', zIndex: 1, transform: 'translateX(-50%)'}} size={50} />
      }
        <CardActionArea sx={{display: {xs: 'block', sm: 'flex'}, flexDirection: {xs: 'row', sm: 'row-reverse'}, minHeight: cardHeight, position: 'relative'}}>
          <CardMedia sx={{ display: 'flex', justifyContent: {xs: 'center', sm: 'flex-end'}, alignItems: 'center','& img': {objectFit: 'contain', width: 'auto!important', height: `${imgHeigth}!important`, position: 'relative!important', p: 2} }} component="div">
            <Image
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              src={product.images[0].image}
              alt={product.title}
              quality={35}
            />
          </CardMedia>
          <CardContent sx={{overflow: 'visible', width: `${widthContent}`, transform: `${moveContent}`}}>
            <Typography gutterBottom variant={variantTitle} component="h2" align="left">
              {product.title}
            </Typography>
            <Typography align="left" variant={variantSubtitle} component="h3" color="secondary" sx={{wordBreak: 'keep-all'}}>
              {product.shortDescription}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )
}
