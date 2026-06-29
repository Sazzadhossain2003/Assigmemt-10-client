'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  PlusSquare,
  BookOpen,
  Sparkles,
  User,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const DashboardSidebar = () => {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const userRole = session?.user?.role || 'user';

  const userNavItems = [
    { icon: LayoutDashboard, href: '/dashboard', label: 'Overview' },
    {
      icon: PlusSquare,
      href: '/dashboard/user/add-lesson',
      label: 'Contribute',
    },
    { icon: BookOpen, href: '/dashboard/user/my-lessons', label: 'Archives' },
    { icon: Sparkles, href: '/dashboard/user/favorite-lesson', label: 'Saved' },
    { icon: User, href: '/dashboard/profile', label: 'Account' },
  ];

  const adminNavItems = [
    { icon: LayoutDashboard, href: '/dashboard/admin', label: 'Admin Panel' },
    { icon: Users, href: '/dashboard/admin/manage-users', label: 'User Hub' },
    {
      icon: BookOpen,
      href: '/dashboard/admin/manage-lessons',
      label: 'Lesson Hub',
    },
    {
      icon: ShieldAlert,
      href: '/dashboard/admin/reported-lessons',
      label: 'Audits',
    },
    { icon: User, href: '/dashboard/admin/profile', label: 'Settings' },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : userNavItems;
  if (isPending) return null;

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 h-screen sticky top-0 bg-white border-r border-slate-100 flex-col shrink-0">
        <div className="p-10 border-b border-slate-50">
          <h1 className="text-xl font-black text-indigo-600 tracking-tighter uppercase">
            {userRole === 'admin' ? 'DLL Admin' : 'DLL User'}
          </h1>
          <p className="text-[9px] uppercase font-black tracking-[0.4em] text-slate-400 mt-2">
            Control Console
          </p>
        </div>

        <nav className="flex-grow px-6 py-8 space-y-2">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50/50 font-black'
                    : 'hover:text-indigo-600 hover:bg-slate-50 text-slate-400 font-bold'
                }`}
              >
                <item.icon size={18} />
                <span className="text-[11px] uppercase tracking-widest">
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-[4px] bg-indigo-600 rounded-r-full shadow-lg" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MOBILE NAV */}
      <div className="lg:hidden sticky top-0 z-[100] w-full bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="px-5 pt-4 pb-1">
          <span className="text-indigo-600 font-black uppercase tracking-[0.4em] text-[10px]">
            Navigation
          </span>
        </div>
        <nav className="flex items-center justify-between w-full px-2 pb-2">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center py-4 px-1 rounded-2xl transition-all ${
                  isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'
                }`}
              >
                <item.icon size={18} className="mb-1.5" />
                <span className="text-[8px] font-black uppercase tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default DashboardSidebar;
