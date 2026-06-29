'use client';

import React from 'react';
import Link from 'next/link';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Navigation Links Data
  const navLinks = [
    { name: 'Home Sanctuary', path: '/' },
    { name: 'Public Wisdom', path: '/lessons' },
    { name: 'Premium Access', path: '/pricing' },
    { name: 'Your Dashboard', path: '/dashboard' },
  ];

  // Legal & Support Links Data
  const legalLinks = [
    { name: 'Terms of Wisdom', path: '/terms' },
    { name: 'Privacy Scroll', path: '/privacy' },
    { name: 'Cookie Policy', path: '/cookie-policy' },
    { name: 'Seek Support', path: '/contact' },
  ];

  // Social Media Links
  const socialLinks = [
    { Icon: FaXTwitter, link: '#', label: 'X' },
    { Icon: FaFacebookF, link: '#', label: 'Facebook' },
    { Icon: FaLinkedinIn, link: '#', label: 'LinkedIn' },
    { Icon: FaInstagram, link: '#', label: 'Instagram' },
  ];

  return (
    <footer className="relative bg-white text-gray-600 border-t border-gray-100 pt-16 md:pt-24 pb-12 overflow-hidden">
      {/* 1. Subtle Background Decoration (Indigo Glow) */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50/50 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 md:mb-20">
          {/* Column 1: Brand Identity (Using the CSS Logo) */}
          <div className="lg:col-span-4 space-y-8 text-center sm:text-left">
            <Link
              href="/"
              className="flex items-center gap-3 justify-center sm:justify-start group"
            >
              {/* Custom CSS Logo Icon */}
              <div className="relative w-10 h-10 bg-[#6366f1] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <div className="flex flex-col gap-[2px]">
                  <div className="w-4 h-[2px] bg-white/60 rounded-full"></div>
                  <div className="w-5 h-[2px] bg-white rounded-full"></div>
                  <div className="w-3 h-[2px] bg-white/60 rounded-full"></div>
                </div>
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-400 border-2 border-[#6366f1] rounded-full"></div>
              </div>
              <span className="text-[#4f46e5] text-xl font-black tracking-tight">
                Digital Life Lessons
              </span>
            </Link>

            <p className="text-[14px] leading-relaxed text-gray-500 max-w-sm font-medium tracking-wide italic mx-auto sm:mx-0">
              "Wisdom is the bridge between experience and greatness. We curate
              and preserve the insights that shape tomorrow."
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2 text-center sm:text-left">
            <h3 className="text-indigo-600 font-black mb-8 text-[10px] uppercase tracking-[0.4em]">
              Navigation
            </h3>
            <ul className="space-y-4 text-[13px] font-bold uppercase tracking-widest">
              {navLinks.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-gray-400 hover:text-indigo-600 transition-all duration-300 flex items-center justify-center sm:justify-start group"
                  >
                    <span className="hidden sm:inline-block h-[2px] w-0 bg-indigo-600 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Policy & Support Links */}
          <div className="lg:col-span-2 text-center sm:text-left">
            <h3 className="text-indigo-600 font-black mb-8 text-[10px] uppercase tracking-[0.4em]">
              Support
            </h3>
            <ul className="space-y-4 text-[13px] font-bold uppercase tracking-widest">
              {legalLinks.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-gray-400 hover:text-indigo-600 transition-all duration-300 flex items-center justify-center sm:justify-start group"
                  >
                    <span className="hidden sm:inline-block h-[2px] w-0 bg-indigo-600 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Social Dock */}
          <div className="lg:col-span-4 space-y-10 text-center sm:text-left">
            <div className="space-y-6">
              <h3 className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em]">
                Connect
              </h3>
              <div className="space-y-5 text-[13px] font-bold">
                <div className="flex items-center justify-center sm:justify-start gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all duration-300">
                    <FaEnvelope className="text-indigo-500 text-[14px]" />
                  </div>
                  <span className="text-gray-500 group-hover:text-indigo-600 transition-colors tracking-widest text-[11px]">
                    wisdom@lifelessons.com
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all duration-300">
                    <FaMapMarkerAlt className="text-indigo-500 text-[14px]" />
                  </div>
                  <span className="text-gray-500 group-hover:text-indigo-600 transition-colors tracking-widest text-[11px]">
                    Dhaka, Bangladesh
                  </span>
                </div>
              </div>
            </div>

            {/* Social Icons Dock */}
            <div className="flex justify-center sm:justify-start gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  aria-label={social.label}
                  className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-white hover:border-indigo-500 hover:text-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
                >
                  <social.Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar (Copyright & Credits) */}
        <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-black">
              © {currentYear}{' '}
              <span className="text-indigo-600 font-black">
                Digital Life Lessons
              </span>
            </p>
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-300 font-bold">
              Archiving Human Experiences
            </span>
          </div>

          {/* Established Date & Status */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              <span>Online Sanctuary</span>
            </div>
            <div className="h-4 w-px bg-gray-100 hidden sm:block"></div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-indigo-400 font-black">
              EST. MMXXIV
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
