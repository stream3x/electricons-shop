import Image from 'next/image';
import Link from '../Link';
import LogoStatic from './LogoStatic';

export default function Logo(props) {
  const { logoSrc } = props;

  return (
    <Link href="/">
      <Image
        width= {290}
        height= {60}
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