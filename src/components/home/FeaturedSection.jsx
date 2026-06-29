'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiTag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { api } from '@/lib/reusableApi';

const FeaturedSection = () => {
  const [featuredLessons, setFeaturedLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Data fetching from API
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const data = await api.get('/featured-lessons');
        // API array না পাঠালে এরর এড়ানোর জন্য চেক
        setFeaturedLessons(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load featured wisdom:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 bg-white">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <span className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">
          Syncing Knowledge...
        </span>
      </div>
    );
  }

  return (
    <section className="py-24 w-full bg-white relative overflow-hidden">
      {/* Background decoration blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-[2px] bg-indigo-600 rounded-full"></div>
              <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em]">
                Curated Selection
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-none tracking-tight">
              Featured <span className="text-slate-400">Wisdom</span>
            </h2>
          </div>
          <Link
            href="/public-lessons"
            className="group inline-flex items-center gap-3 bg-slate-50 hover:bg-indigo-600 border border-slate-100 hover:border-indigo-600 px-8 py-4 rounded-2xl transition-all duration-300 shadow-sm"
          >
            <span className="text-slate-600 group-hover:text-white font-black text-[10px] uppercase tracking-widest">
              Browse Archives
            </span>
            <FiArrowRight className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredLessons.length > 0 ? (
            featuredLessons.map((lesson, index) => {
              // Author initial calculation
              const authorInitials = lesson.author?.name
                ? lesson.author.name.trim().substring(0, 2).toUpperCase()
                : '??';

              return (
                <motion.div
                  key={lesson._id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden flex flex-col h-full hover:border-indigo-200 hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.1)] transition-all duration-500"
                >
                  {/* Image Container */}
                  <div className="relative h-60 overflow-hidden m-3 rounded-[2rem]">
                    <img
                      src={
                        lesson.image || 'https://via.placeholder.com/400x300'
                      }
                      alt={lesson.title || 'Lesson Image'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/80 backdrop-blur-md text-indigo-600 text-[9px] font-black uppercase px-4 py-2 rounded-full border border-white/20 tracking-widest shadow-sm">
                        {lesson.accessLevel || 'Public'}
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="px-8 pb-8 pt-3 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                      <FiTag className="text-indigo-600" />
                      {lesson.category || 'General'}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                      {lesson.title || 'Untitled Lesson'}
                    </h3>

                    <p className="text-slate-500 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">
                      {lesson.description ||
                        'No description available for this wisdom archive.'}
                    </p>

                    <div className="w-full h-[1px] bg-slate-50 mb-8"></div>

                    {/* Footer Area */}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[14px] border-2 border-slate-50 p-[1.5px] overflow-hidden group-hover:border-indigo-100 transition-all bg-slate-50">
                          {lesson.author?.image ? (
                            <img
                              src={lesson.author.image}
                              className="w-full h-full rounded-[10px] object-cover grayscale group-hover:grayscale-0 transition-all"
                              alt="author"
                            />
                          ) : (
                            <div className="w-full h-full rounded-[10px] bg-indigo-600 flex items-center justify-center">
                              <span className="text-[10px] font-black text-white">
                                {authorInitials}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-900 font-black uppercase tracking-tighter">
                          {lesson.author?.name?.split(' ')[0] || 'Member'}
                        </p>
                      </div>

                      <Link
                        href={`/public-lessons/${lesson._id}`}
                        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all border border-slate-100 hover:border-indigo-600 shadow-sm"
                      >
                        <FiArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10 text-slate-400 font-bold uppercase tracking-widest text-xs">
              No lessons found in this section.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
