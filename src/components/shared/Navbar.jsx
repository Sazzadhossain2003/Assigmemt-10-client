'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Person,
  LayoutColumns,
  ArrowRightFromSquare,
  ChevronDown,
  Bars,
  Xmark,
} from '@gravity-ui/icons';
import { authClient } from '@/lib/auth-client';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Authentication session data
  const { data: session } = authClient.useSession();
  console.log(session?.user, "session")
  const isLoggedIn = !!session;
  const user = session?.user;
  const userRole = user?.role || 'user';
  const isPremium = user?.plan;

  // Helper to get user initials
  const getInitials = name => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Lock body scroll for mobile menu
  useEffect(() => {
    document.body.style.overflow = isMobileDrawerOpen ? 'hidden' : 'unset';
  }, [isMobileDrawerOpen]);

  const handleLogout = async () => {
    await authClient.signOut();
    setIsDropdownOpen(false);
    setIsMobileDrawerOpen(false);
  };

  // Define navigation links
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Public Lessons', href: '/public-lessons' },
  ];

  if (userRole === 'admin') {
    navLinks.push(
      { name: 'Manage Lessons', href: '/dashboard/admin/manage-lessons' },
      { name: 'Manage Users', href: '/dashboard/admin/manage-users' },
    );
  } else {
    navLinks.push(
      { name: 'Add Lesson', href: '/dashboard/user/add-lesson' },
      { name: 'My Lessons', href: '/dashboard/user/my-lessons' },
    );
  }

  // Add Pricing link if logged in and on free plan
  if (isLoggedIn && isPremium === 'free') {
    navLinks.push({ name: 'Pricing', href: '/pricing' });
  }

  return (
    <>
      {/* Overlay to close dropdown when clicking outside */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDropdownOpen(false)}
            className="fixed inset-0 z-[40] bg-transparent"
          />
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <nav className="bg-[#fcfaff] sticky top-0 z-[50] border-b border-gray-100 py-3">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex justify-between items-center">
          {/* 1. LOGO SECTION: Custom CSS built to match your image */}
          <Link href="/" className="flex items-center gap-3">
            {/* Logo Icon Box */}
            <div className="relative w-10 h-10 bg-[#6366f1] rounded-xl flex items-center justify-center shadow-sm">
              <div className="flex flex-col gap-[2px]">
                <div className="w-4 h-[2px] bg-white/60 rounded-full"></div>
                <div className="w-5 h-[2px] bg-white rounded-full"></div>
                <div className="w-3 h-[2px] bg-white/60 rounded-full"></div>
              </div>
              {/* The Green Status Dot on the logo */}
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-400 border-2 border-[#6366f1] rounded-full"></div>
            </div>
            {/* Logo Text */}
            <span className="text-[#4f46e5] text-xl font-bold tracking-tight hidden sm:block">
              Digital Life Lessons
            </span>
          </Link>

          {/* 2. NAVIGATION LINKS: Desktop styling with active underline */}
          <ul className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <li key={index} className="relative py-2">
                  <Link
                    href={link.href}
                    className={`text-[14px] font-semibold transition-colors duration-200 ${
                      isActive
                        ? 'text-[#4f46e5]'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                  {/* Purple Underline for the active menu item */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-line"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#4f46e5] rounded-full"
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* 3. ACTION ICONS: Search, Notifications, and Profile */}
          <div className="flex items-center space-x-6">

            {!isLoggedIn ? (
              <Link
                href="/signin"
                className="bg-[#4f46e5] text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm"
              >
                Login
              </Link>
            ) : (
              /* User Profile Section */
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-1 group focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full border border-gray-200 p-[1px] overflow-hidden">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#4f46e5] text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {getInitials(user?.name)}
                      </div>
                    )}
                  </div>
                  <ChevronDown
                    className={`text-gray-400 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden"
                    >
                      <div className="p-4 bg-gray-50/50">
                        <p className="font-bold text-gray-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-[#4f46e5] font-bold uppercase tracking-wider">
                          {userRole} Member
                        </p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-[#4f46e5] rounded-lg transition-colors"
                        >
                          <LayoutColumns className="mr-3" width={18} />{' '}
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-[#4f46e5] rounded-lg transition-colors"
                        >
                          <Person className="mr-3" width={18} /> Settings
                        </Link>
                      </div>
                      <div className="p-2 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-semibold"
                        >
                          <ArrowRightFromSquare className="mr-3" width={18} />{' '}
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden text-gray-700"
            >
              <Bars width={26} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE DRAWER (Updated for Light Theme) --- */}
      <div
        className={`fixed inset-0 z-[9999] ${isMobileDrawerOpen ? 'visible' : 'invisible'}`}
      >
        <div
          onClick={() => setIsMobileDrawerOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[80%] max-w-[320px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ${isMobileDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-6 flex justify-between items-center border-b border-gray-100">
            <span className="text-[#4f46e5] font-bold uppercase text-[10px] tracking-widest">
              Menu
            </span>
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="text-gray-400"
            >
              <Xmark width={24} />
            </button>
          </div>
          <div className="flex-1 p-6 space-y-4">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                onClick={() => setIsMobileDrawerOpen(false)}
                className={`block text-lg font-bold ${pathname === link.href ? 'text-[#4f46e5]' : 'text-gray-600'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
