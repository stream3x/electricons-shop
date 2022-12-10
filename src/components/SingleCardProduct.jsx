import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Rating from '@mui/material/Rating';
import { Box } from '@mui/system';
import Link from '../Link';
import CircularProgress from '@mui/material/CircularProgress';

export default function SingleCardProduct({product}) {
  const [selected, setSelected] = React.useState('');

  const handleLoading = (product) => {
    setSelected(product._id);
  };

  const handleTouchLoading = (product) => {
    setSelected(product._id);
  };

  return (
    <Card sx={{ width: "100%", height: "100%" }}>
      <CardActionArea>
        <Link href={`/product/${product.slug}`} onTouchEnd={() => handleTouchLoading(product)} onClick={() => handleLoading(product)}>
        {
          product._id === selected &&
          <CircularProgress sx={{position: 'absolute', left: '50%', top: '20%', zIndex: 1 , transform: 'translateX(-50%)'}} size={30} />
        }
          <CardMedia
          component="img"
            width="auto"
            height="168px"
            image={product.images[0].image}
            alt={product.title}
            sx={{margin: 'auto', objectFit: 'contain', pt: 2}}
          />
        </Link>
        <CardContent>
          {
            product.inStock > 0 ? 
            ( <Typography color="primary" gutterBottom variant="caption" component="p" align="center">
              in Stock
            </Typography>) :
            ( <Typography color="secondary" gutterBottom variant="caption" component="p" align="center">
              out of Stock
            </Typography>)
          }
          <Typography gutterBottom variant="h6" component="h3" align="center">
          {product.title}
          </Typography>
          <Typography align="center" variant="body2" color="text.secondary">
            {product.shortDescription}
          </Typography>
          <Box
            sx={{
              textAlign: 'center',
              my: 1,
            }}
            >
            <Rating size="small" name="read-only" value={product.rating} readOnly precision={0.5} />
          </Box>
          <Typography align="center" component="h3" variant="h6" color="secondary">
            {product.price}
            <Typography align="right" component="span" variant="body2" color="secondary.lightGrey" sx={{marginLeft: 1}}>
              <del>{product.oldPrice && product.oldPrice}</del>
            </Typography>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
