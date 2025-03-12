'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BarChart3, KeyRound, Menu } from 'lucide-react';
// import Image from 'next/image';

const menuItems = [
  {
    title: 'Overview',
    icon: BarChart3,
    href: '/',
  },
  // {
  //   title: 'Engines',
  //   icon: Search,
  //   href: '/engines',
  // },
  // {
  //   title: 'Map',
  //   icon: Map,
  //   href: '/map',
  // },
  {
    title: 'Keywords',
    icon: KeyRound,
    href: '/keywords',
  },
  // {
  //   title: 'Competitors',
  //   icon: Users,
  //   href: '/competitors',
  // },
  // {
  //   title: 'Daily Runs',
  //   icon: Calendar,
  //   href: '/daily-runs',
  // },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        'sticky top-0 z-50 border-r bg-card text-card-foreground transition-all duration-300',
        collapsed ? 'w-16' : 'w-48 min-w-48'
      )}
    >
      <div className="sticky top-0 z-50 flex h-16 items-center justify-between p-4">
        {/*{!collapsed && (*/}
        {/*  <Image src={'/gifik.gif'} alt={'searching'} width={130} height={50} />*/}
        {/*)}*/}
        {!collapsed && (
            <svg width="160" height="40" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="10,40 40,15 60,28 85,10 110,28" stroke="#34D399" strokeWidth="3" fill="none"/>
              <circle cx="135" cy="18" r="8" stroke="#007BFF" strokeWidth="3"/>
              <line x1="140" y1="22" x2="155" y2="33" stroke="#007BFF" strokeWidth="3"/>
            </svg>

        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <nav className="sticky top-16 z-50 space-y-1 px-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors',
              pathname === item.href
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-accent hover:text-accent-foreground',
              collapsed && 'justify-center'
            )}
          >
            <item.icon className="h-5 w-5" />
            {!collapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
