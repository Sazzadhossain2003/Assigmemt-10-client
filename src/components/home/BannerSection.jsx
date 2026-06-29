'use client';
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  Crown,
  TrendingUp,
  BrainCircuit,
} from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const BannerSection = () => {
  const [mounted, setMounted] = useState(false);
  const { data: session } = authClient.useSession();
  const isPremium =
    session?.user?.role === 'premium' || session?.user?.plan === 'premium'; // Adjust based on your schema

  useEffect(() => setMounted(true), []);

  const sliderData = [
    {
      id: 1,
      image: '/asstes/img2.png',
      badgeIcon: <Sparkles className="w-4 h-4" />,
      badgeText: 'Preserve Your Wisdom',
      title: 'Every Experience Becomes A Life Lesson',
      description:
        'Document your breakthroughs, learn from collective experiences, and build a permanent digital archive.',
      btnPrimary: 'Start Writing',
      pathPrimary: '/dashboard/user/add-lesson',
      btnSecondary: 'Explore Lessons',
      pathSecondary: '/public-lessons',
      themeColor: '#6366f1',
      rightCard: (
        <div className="relative w-full max-w-[350px] aspect-[4/3] bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold">Growth Mindset</h4>
              <p className="text-white/40 text-[10px] uppercase font-black">
                Core Lesson
              </p>
            </div>
          </div>
          <div className="space-y-3 opacity-30">
            <div className="h-2 w-full bg-white rounded-full"></div>
            <div className="h-2 w-3/4 bg-white rounded-full"></div>
            <div className="h-2 w-1/2 bg-white rounded-full"></div>
          </div>
          <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-gray-600"
                />
              ))}
            </div>
            <span className="text-white/60 text-xs font-bold">
              8.2k Readers
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      image: '/asstes/img3.png',
      badgeIcon: <Users className="w-4 h-4" />,
      badgeText: 'Community Knowledge',
      title: 'Discover Wisdom Shared By Thousands',
      description:
        'Join a global community of lifelong learners. Explore real stories that inspire career growth.',
      btnPrimary: 'Browse Lessons',
      pathPrimary: '/public-lessons',
      btnSecondary: 'Join Community',
      pathSecondary: '/signup',
      themeColor: '#4f46e5',
      rightCard: (
        <div className="relative w-full max-w-[380px] space-y-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl flex items-center gap-4 translate-x-10">
            <div className="w-10 h-10 rounded-full bg-blue-400 overflow-hidden border-2 border-white/20">
              <img src="https://i.pravatar.cc/100?u=1" alt="user" />
            </div>
            <div className="flex-1">
              <div className="h-2 w-24 bg-white/40 rounded-full mb-2"></div>
              <div className="h-1.5 w-16 bg-white/20 rounded-full"></div>
            </div>
            <TrendingUp className="text-green-400" size={20} />
          </div>
          <div className="bg-white/80 backdrop-blur-2xl p-4 rounded-xl flex items-center gap-3 w-fit shadow-2xl">
            <TrendingUp className="text-indigo-600" size={18} />
            <span className="text-indigo-950 font-bold text-xs">
              Trending Wisdom
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      image: '/asstes/img1.png',
      badgeIcon: <Crown className="w-4 h-4" />,
      badgeText: 'Lifetime Access',
      title: 'Unlock Premium Knowledge Forever',
      description:
        'Get exclusive access to verified wisdom from world-class experts. Unlimited publishing.',
      // Logic: If already premium, show "Go to Dashboard"
      btnPrimary: isPremium ? 'View Dashboard' : 'Upgrade Premium',
      pathPrimary: isPremium ? '/dashboard/user' : '/dashboard/user/upgrade',
      btnSecondary: 'See Pricing',
      pathSecondary: '/dashboard/user/upgrade',
      themeColor: '#d97706',
      rightCard: (
        <div className="relative w-full max-w-[400px]">
          <div className="bg-gradient-to-br from-orange-500 to-amber-700 rounded-3xl p-8 shadow-2xl border border-white/20 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="flex justify-between items-start mb-12">
              <div className="w-12 h-10 bg-white/20 rounded-lg backdrop-blur-md border border-white/10"></div>
              <Crown className="text-white/60" />
            </div>
            <div className="text-white text-2xl font-mono tracking-[0.2em] mb-8">
              •••• •••• 8842
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/40 text-[10px] uppercase font-bold">
                  Member Name
                </p>
                <p className="text-white font-bold">
                  {session?.user?.name || 'PREMIUM MEMBER'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-[10px] uppercase font-bold">
                  Valid Thru
                </p>
                <p className="text-white font-bold">FOREVER</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-6 bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-2xl shadow-xl w-40">
            <p className="text-white/40 text-[10px] font-bold uppercase mb-1">
              Reach
            </p>
            <p className="text-white text-xl font-black">+142%</p>
          </div>
        </div>
      ),
    },
  ];

  if (!mounted) return null;

  return (
    <section className="relative w-full h-[90vh] md:h-screen bg-[#0a0a0a]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          renderBullet: (i, c) => `<span class="${c}"></span>`,
        }}
        navigation={{ nextEl: '.next-btn', prevEl: '.prev-btn' }}
        loop={true}
        className="w-full h-full"
      >
        {sliderData.map(slide => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative w-full h-full bg-cover bg-center flex items-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/40 md:bg-gradient-to-r from-black/90 via-black/20 to-transparent" />

              <div className="container mx-auto px-6 md:px-16 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="max-w-2xl">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
                    >
                      <span style={{ color: slide.themeColor }}>
                        {slide.badgeIcon}
                      </span>
                      <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">
                        {slide.badgeText}
                      </span>
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-white text-5xl md:text-8xl font-black leading-[1.05] mb-8 tracking-tighter"
                    >
                      {slide.title}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-300 text-lg md:text-xl max-w-lg mb-10 leading-relaxed"
                    >
                      {slide.description}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-wrap gap-4"
                    >
                      <Link href={slide.pathPrimary}>
                        <button
                          className="px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-white shadow-2xl transition-transform active:scale-95"
                          style={{ backgroundColor: slide.themeColor }}
                        >
                          {slide.btnPrimary}
                        </button>
                      </Link>

                      <Link href={slide.pathSecondary}>
                        <button className="px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-white bg-white/10 backdrop-blur-xl border border-white/20 transition-all hover:bg-white/20 active:scale-95">
                          {slide.btnSecondary}
                        </button>
                      </Link>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.8 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="hidden lg:flex justify-center items-center"
                  >
                    {slide.rightCard}
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Controls */}
        <button className="prev-btn absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition-all hidden md:flex">
          <ChevronLeft size={24} />
        </button>
        <button className="next-btn absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition-all hidden md:flex">
          <ChevronRight size={24} />
        </button>
      </Swiper>

      <style jsx global>{`
        .swiper-pagination {
          bottom: 40px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          display: flex;
          gap: 10px;
        }
        .swiper-pagination-bullet {
          width: 40px !important;
          height: 4px !important;
          border-radius: 2px !important;
          background: rgba(255, 255, 255, 0.2) !important;
          opacity: 1 !important;
          transition: all 0.4s ease;
        }
        .swiper-pagination-bullet-active {
          background: white !important;
          width: 60px !important;
        }
      `}</style>
    </section>
  );
};

export default BannerSection;
