import Image from 'next/image';
import Link from '../Link';

export default function Logo(props) {
  const { logoSrc } = props;

  return (
    <Link href="/" sx={{display: 'block', "& > a": {display: 'block'}, width: '290px', height: '60px', "& img": {objetFit: "contain"}, position: 'relative' }}>
      <Image
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
        src={logoSrc ? logoSrc.logo : '/logo/electricons_logo.svg'}
        alt="logo"
        quality={35}
        loading="eager"
      />
    </Link>
  );
}