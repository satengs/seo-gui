'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, KeyRound, Menu, Network, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/context/AuthContext';
import { IMenuItem } from '@/types';

const menuItems: IMenuItem[] = [
  {
    title: 'Overview',
    icon: BarChart3,
    href: '/',
    termId: 'overview_view',
  },
  {
    title: 'Keywords',
    icon: KeyRound,
    href: '/keywords',
    termId: 'manage_keywords',
  },
  {
    title: 'Users',
    icon: User,
    href: '/users',
    termId: 'manage_users',
  },
  {
    title: 'Organizations',
    icon: Network,
    href: '/organizations',
    termId: 'manage_organizations',
  },
];

export default function Sidebar() {
  const { user } = useAuthContext();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarItems = useMemo(() => {
    let _menuItems = [...menuItems];
    if (user && user.permissions?.length) {
      _menuItems = _menuItems.filter((item) =>
        user.permissions?.includes(item.termId)
      );
      return _menuItems;
    }
    return _menuItems;
  }, [user]);

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
          <svg
            width="160"
            height="40"
            viewBox="0 0 160 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline
              points="10,40 40,15 60,28 85,10 110,28"
              stroke="#34D399"
              strokeWidth="3"
              fill="none"
            />
            <circle cx="135" cy="18" r="8" stroke="#007BFF" strokeWidth="3" />
            <line
              x1="140"
              y1="22"
              x2="155"
              y2="33"
              stroke="#007BFF"
              strokeWidth="3"
            />
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
        {sidebarItems.map((item) => (
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
