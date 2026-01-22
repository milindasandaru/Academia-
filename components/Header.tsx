'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="header flex my-10 justify-between gap-5 text-white">
      <Link href="/">
        <Image src="/Group 14.png" alt="Logo" width={24} height={24} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link
            href="/library"
            className={cn(
              'text-base cursor-pointer capitalize',
              pathname === '/library' ? 'text-light-200' : 'text-light'
            )}
          >
            Library
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className={cn(
              'text-base cursor-pointer capitalize',
              pathname === '/about' ? 'text-light-200' : 'text-light'
            )}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className={cn(
              'text-base cursor-pointer capitalize',
              pathname === '/contact' ? 'text-light-200' : 'text-light'
            )}
          >
            Contact
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
