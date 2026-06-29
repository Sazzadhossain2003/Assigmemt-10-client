'use client';

import React from 'react';
import Link from 'next/link';
import { HiHome } from 'react-icons/hi';
import { FiSearch, FiCompass } from 'react-icons/fi';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="relative min-h-screen bg-[#f8fafc] flex items-center justify-center overflow-hidden p-6 font-sans">
      {/* Background Large 404 Text - Subtle Light Version */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <h1 className="text-[15rem] md:text-[25rem] lg:text-[32rem] font-black text-indigo-50/50 leading-none tracking-tighter">
          404
        </h1>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
        {/* Animated Visual Replacement for Image */}
        <div className="mb-12 relative group">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-10 bg-indigo-100/50 rounded-full blur-3xl opacity-60"
          />

          <div className="relative w-48 h-48 md:w-56 md:h-56 bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <FiCompass size={80} className="text-indigo-600 mb-2" />
              </motion.div>
              <div className="w-12 h-1.5 bg-slate-100 rounded-full blur-sm mt-4 animate-pulse" />
            </div>
          </div>

          {/* Floating Search Icon */}
          <motion.div
            animate={{
              x: [-20, 20, -20],
              y: [-20, 10, -20],
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute -top-4 -right-4 w-14 h-14 bg-white border border-slate-100 shadow-lg rounded-2xl flex items-center justify-center text-indigo-600"
          >
            <FiSearch size={24} />
          </motion.div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
          Lost in the{' '}
          <span className="text-indigo-600 text-shadow-sm">Digital Ether</span>
        </h2>

        {/* Description */}
        <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-10 px-4 max-w-md">
          The page you are looking for has been moved or no longer exists. Don't
          worry, even the best explorers lose their way.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-indigo-100 active:scale-95"
          >
            <HiHome size={20} />
            Back to Dashboard
          </Link>

          <Link
            href="/public-lessons"
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold transition-all duration-300 active:scale-95 shadow-sm"
          >
            Browse Library
          </Link>
        </div>
      </div>

      {/* Subtle bottom gradient for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-50/30 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default NotFoundPage;
