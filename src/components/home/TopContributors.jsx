'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiBookOpen, FiArrowUpRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/reusableApi';

const TopContributors = () => {
  const router = useRouter();
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to get initials from name
  const getInitials = name => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setLoading(true);
        const data = await api.get('/top-contributors');
        setContributors(data);
      } catch (err) {
        console.error('Contributor Registry Sync Error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  // Loading State with Indigo Spinner
  if (loading) {
    return (
      <div className="w-full bg-white py-32 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <span className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">
          Scanning Records...
        </span>
      </div>
    );
  }

  return (
    <section className="w-full py-24 bg-white relative overflow-hidden">
      {/* Background soft decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-indigo-600 rounded-full"></div>
            <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em]">
              Elite Minds
            </span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none"
          >
            Top <span className="text-gray-400">Contributors</span>
          </motion.h2>
        </header>

        {/* Contributors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {contributors.length > 0 ? (
            contributors.map((person, idx) => (
              <motion.div
                key={person._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                onClick={() => router.push(`/author-profile/${person._id}`)}
                className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-10 text-center cursor-pointer hover:border-indigo-200 hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.1)] transition-all duration-500 flex flex-col items-center"
              >
                {/* Floating hover decoration inside card */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50/50 blur-3xl rounded-full group-hover:bg-indigo-100/50 transition-all duration-700"></div>

                <div className="relative mb-8">
                  {/* Avatar Container */}
                  <div className="w-32 h-32 rounded-[2rem] border-2 border-slate-50 p-2 group-hover:border-indigo-200 transition-all duration-500 bg-slate-50 flex items-center justify-center overflow-hidden">
                    {person?.image && person.image !== '' ? (
                      <Image
                        width={128}
                        height={128}
                        src={person.image}
                        alt={person?.name || 'Contributor'}
                        className="w-full h-full rounded-[1.5rem] object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                    ) : (
                      /* Initials fallback */
                      <span className="text-3xl font-black text-indigo-600 uppercase">
                        {getInitials(person?.name)}
                      </span>
                    )}
                  </div>

                  {/* Award Badge Icon */}
                  <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2.5 rounded-2xl shadow-xl shadow-indigo-200 border-4 border-white group-hover:scale-110 transition-transform">
                    <FiAward size={16} />
                  </div>
                </div>

                {/* Identity Info */}
                <div className="space-y-2 mb-8">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                    {person?.name || 'Anonymous Seeker'}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                    Insight Provider
                  </p>
                </div>

                {/* Lessons Counter Footer */}
                <div className="mt-auto w-full pt-6 border-t border-slate-50 flex items-center justify-between group-hover:border-indigo-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <FiBookOpen className="text-indigo-600" size={16} />
                    <span className="text-sm font-black text-slate-900 tracking-tighter">
                      {person.totalLessons}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase">
                      Lessons
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <FiArrowUpRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            /* Empty State */
            <div className="col-span-full py-16 text-center text-gray-400 font-bold text-xs uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-[2.5rem]">
              No Contributor records found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TopContributors;
