'use client';

import { cn } from '@/lib/utils';
import { Home, Menu, Newspaper } from 'lucide-react';
// import { Bell, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/news', icon: Newspaper, label: 'News' },
  // { href: '/standings', icon: Trophy, label: 'Standings' },
  // { href: '/league', icon: Users, label: 'League' },
  // { href: '/notifications', icon: Bell, label: 'Alerts' },
  { href: '/menu', icon: Menu, label: 'More' }
];

function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className='fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around md:hidden'>
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center w-full h-full pt-2',
              'hover:text-primary transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon className='size-6' />
            <span className='text-xs'>{label}</span>

            {/* Active indicator */}
            {isActive && (
              <span className='absolute bottom-0 h-0.5 w-12 bg-primary' />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export { BottomNav };
