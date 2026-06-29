'use client';

import React from 'react';
import { motion } from 'framer-motion';
// react-icons ব্যবহার করা হয়েছে
import { FiZap, FiEdit3, FiUsers, FiTrendingUp } from 'react-icons/fi';

const WhyLearning = () => {
  const benefits = [
    {
      id: 1,
      icon: <FiZap size={28} />,
      title: 'Preserve Wisdom',
      description:
        'Life lessons are fleeting. Documenting them ensures that the insights you gain today stay with you forever.',
    },
    {
      id: 2,
      icon: <FiEdit3 size={28} />,
      title: 'Mindful Reflection',
      description:
        'Writing down your experiences encourages deep reflection, helping you understand your own growth journey.',
    },
    {
      id: 3,
      icon: <FiUsers size={28} />,
      title: 'Community Growth',
      description:
        'Sharing your wisdom helps others avoid similar mistakes and find inspiration in your successes.',
    },
    {
      id: 4,
      icon: <FiTrendingUp size={28} />,
      title: 'Track Progress',
      description:
        'Visualize how your mindset evolves over time by looking back at the lessons you’ve learned through the years.',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="py-24 w-full bg-white relative overflow-hidden">
      {/* Background Soft Decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50/50 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6"
          >
            <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em]">
              Core Values
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-6"
          >
            Why Learning Matters <span className="text-gray-400">?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 max-w-2xl mx-auto font-medium text-lg"
          >
            Your experiences are your greatest teachers. Our platform helps you
            capture and organize those priceless moments of clarity.
          </motion.p>
        </div>

        {/* Benefit Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {benefits.map(benefit => (
            <motion.div
              key={benefit.id}
              variants={itemVariants}
              className="group relative p-10 bg-white border border-slate-100 rounded-[2.5rem] hover:border-indigo-200 hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.1)] transition-all duration-500 flex flex-col items-center text-center"
            >
              {/* Icon Container */}
              <div className="mb-8 w-16 h-16 rounded-2xl bg-slate-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                {benefit.icon}
              </div>

              {/* Text Content */}
              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                {benefit.description}
              </p>

              {/* Subtle hover indicator line */}
              <div className="mt-8 w-10 h-1 bg-slate-100 rounded-full group-hover:w-20 group-hover:bg-indigo-600 transition-all duration-500"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyLearning;
