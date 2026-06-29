'use client';
import React from 'react';
import { motion } from 'framer-motion';
// Importing icons from react-icons
import { FiStar } from 'react-icons/fi';
import { RiDoubleQuotesR } from 'react-icons/ri';

const testimonials = [
  {
    name: 'Sophia Martinez',
    role: 'Tech Lead @ GlobalFoundry',
    image: 'https://i.pravatar.cc/150?u=sophia',
    quote:
      "The ability to tag my lessons with emotional tones has changed how I reflect on my leadership style. It's the most valuable digital tool I own.",
    stars: 5,
  },
  {
    name: "James O'Brien",
    role: 'Founder, Echo Systems',
    image: 'https://i.pravatar.cc/150?u=james',
    quote:
      "I started documenting my journey as an entrepreneur here. Looking back at my 'Failure' lessons from 2 years ago is what keeps me grounded today.",
    stars: 5,
    featured: true,
  },
  {
    name: 'Dr. Helena Vance',
    role: 'Psychologist & Author',
    image: 'https://i.pravatar.cc/150?u=helena',
    quote:
      'The community aspect is incredible. Finding people who struggled with the same life transitions makes me feel less alone in my growth.',
    stars: 5,
  },
];

const Testimonials = () => {
  return (
    // Section background converted to white
    <section className="w-full bg-white py-24 md:py-32 border-t border-gray-100 relative overflow-hidden">
      {/* Background Soft Glow Decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-50/50 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6"
          >
            <span className="text-[#6366f1] font-black text-[10px] uppercase tracking-[0.4em]">
              Community Voices
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter"
          >
            Voices of <span className="text-indigo-600">Growth</span>
          </motion.h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className={`relative p-10 rounded-[3rem] border transition-all duration-500 flex flex-col justify-between group ${
                t.featured
                  ? 'bg-white border-indigo-100 shadow-[0_40px_80px_-15px_rgba(99,102,241,0.12)] md:-translate-y-8 z-20'
                  : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-2xl'
              }`}
            >
              {/* Featured Badge for the middle card */}
              {t.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#6366f1] text-white text-[9px] font-black uppercase tracking-[0.3em] px-6 py-2.5 rounded-full shadow-lg shadow-indigo-200">
                  Featured Story
                </div>
              )}

              <div>
                {/* Stars and Quote Icon Section */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-1 text-indigo-500">
                    {[...Array(t.stars)].map((_, index) => (
                      <FiStar
                        key={index}
                        className="fill-indigo-500"
                        size={18}
                      />
                    ))}
                  </div>
                  {/* Decorative Quote Icon */}
                  <RiDoubleQuotesR className="text-indigo-600/10" size={50} />
                </div>

                {/* Testimonial Quote */}
                <p className="text-slate-700 text-lg md:text-xl font-medium leading-relaxed mb-12 italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Identity Section */}
              <div className="flex items-center gap-5 pt-8 border-t border-slate-50 mt-auto">
                {/* Author Avatar with specialized border */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-50 p-[2px] transition-all group-hover:border-indigo-200">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div>
                  <h4 className="text-slate-900 font-black text-base tracking-tight">
                    {t.name}
                  </h4>
                  <p className="text-indigo-600 text-[10px] uppercase font-black tracking-[0.2em] mt-1">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
