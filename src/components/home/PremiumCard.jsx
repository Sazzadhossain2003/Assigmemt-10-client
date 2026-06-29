'use client';
import React from 'react';
import { motion } from 'framer-motion';
// Using react-icons as per previous request
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const PremiumCard = () => {
  const features = [
    'Advanced AI Reflection Analysis',
    'Unlimited Lesson Archiving & Private Vaults',
    'Priority Access to Global Mastermind Events',
    'Personalized Growth Roadmap',
  ];

  return (
    <section className="w-full bg-white py-20 md:py-32 relative overflow-hidden">
      {/* Background Soft Decoration */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50/50 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-50 border border-slate-100 rounded-[3rem] p-8 md:p-20 relative overflow-hidden shadow-sm"
        >
          {/* Subtle Indigo Glow inside the card */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100/40 blur-[100px] rounded-full" />

          <div className="relative z-10">
            {/* Badge Section */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
              <span className="bg-indigo-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-indigo-200">
                Lifetime Access
              </span>
              <span className="text-slate-400 text-[10px] font-black tracking-[0.4em] uppercase">
                Invest in your legacy
              </span>
            </div>

            {/* Title Section */}
            <h2 className="text-4xl md:text-7xl font-black text-slate-900 mb-12 tracking-tighter leading-[1.1]">
              Unlock <span className="text-indigo-600">Premium</span> <br />
              Knowledge
            </h2>

            {/* Features Grid */}
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {features.map((item, i) => (
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i}
                  className="flex items-center text-slate-600 group"
                >
                  <div className="mr-4 bg-white p-2 rounded-xl shadow-sm border border-slate-100 group-hover:border-indigo-200 transition-colors">
                    <FiCheckCircle className="text-indigo-600" size={20} />
                  </div>
                  <span className="text-sm md:text-lg font-bold tracking-tight">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* Pricing and CTA Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 pt-10 border-t border-slate-200/60">
              <div className="flex items-center gap-5">
                <div className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-400 leading-tight">
                  One-time <br /> investment
                </div>
                <div className="text-5xl md:text-7xl font-black text-slate-900 flex items-start tracking-tighter">
                  <span className="text-2xl mt-2 mr-1 text-indigo-600">$</span>
                  1,500
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#4338ca' }}
                whileTap={{ scale: 0.98 }}
                className="bg-indigo-600 text-white px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 transition-all cursor-pointer flex items-center gap-3"
              >
                Upgrade to Premium Now
                <FiArrowRight size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumCard;
