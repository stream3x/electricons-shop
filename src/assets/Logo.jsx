import SvgIcon from '@mui/material/SvgIcon';
import { Box } from '@mui/system';
import Image from 'next/image';
import Link from '../Link';

export default function Logo(props) {
  const { logoSrc } = props;

  return (
    <Link href="/">
      <Image
        width= {290}
        height= {60}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
        src={logoSrc && logoSrc.logo}
        alt="logo"
        quality={35}
      />
      {/* <Box
      component="img"
      src={logoSrc && logoSrc.logo}
      {...props}
      /> */}
    </Link>
  );
}