import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from '../Link';
import { useRouter } from 'next/router';

const breadcrumbNameMap = {
  '/inbox': 'Inbox',
  '/inbox/important': 'Important',
  '/trash': 'Trash',
  '/spam': 'Spam',
  '/drafts': 'Drafts',
};

const Page = () => {
  const location = useRouter();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link underline="hover" color="inherit" to="/">
        Home
      </Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return last ? (
          <Typography color="text.primary" key={to}>
            {breadcrumbNameMap[to]}
          </Typography>
        ) : (
          <Link underline="hover" color="inherit" to={to} key={to}>
            {breadcrumbNameMap[to]}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default function BreadcrumbNav({productData, categoryData}) {
  const location = useRouter();

  return (
    <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ fontSize: {xs: 12, sm: 'inherit'}, my: 4, 'a' : { textDecoration: 'none'} }}>
      <Link
        underline="none"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="primary"
        href="/"
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        Home
      </Link>
      {
        categoryData && categoryData[0] &&
          <Link
            underline="none"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="primary"
            href={`/category/${categoryData[0]}`}
          >
            {categoryData[0].replace(/-/g, ' ').replace(/^./, function(x){return x.toUpperCase()})}
          </Link>
      }
      {
        categoryData && categoryData[1] &&
          <Link
            underline="none"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="primary"
            href={`/category/${categoryData[0]}/${categoryData[1]}`}
          >
            {categoryData[1].replace(/-/g, ' ').replace(/^./, function(x){return x.toUpperCase()})}
          </Link>
      }
      {
        productData && productData.categoryUrl &&
          <Link
            underline="none"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="primary"
            href={`/category/${productData.categoryUrl}`}
          >
            {productData.categoryUrl}
          </Link>
      }
      {
        productData && productData.subCategoryUrl &&
          <Link
            underline="none"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="primary"
            href={`/category/${productData.categoryUrl}/${productData.subCategoryUrl}`}
          >
            {productData.subCategory}
          </Link>
      }
      {
        productData && productData.slug &&
        <Typography
          sx={{ display: 'flex', alignItems: 'center', fontSize: {xs: 12, sm: 'inherit'} }}
          color="text.primary"
        >
          {productData.title}
        </Typography>
      }
      {
        !productData && !categoryData &&
          <Link
            underline="none"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="primary"
            href={`${location.pathname}`}
          >
            {`${location.pathname.replace('/', '')}`}
          </Link>
      }
    </Breadcrumbs>
  );
}
