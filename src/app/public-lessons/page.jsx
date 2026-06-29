'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiLock,
  FiEye,
  FiTag,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiInbox,
  FiBarChart2,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import toast, { Toaster } from 'react-hot-toast';
import { api } from '@/lib/reusableApi';

export default function PublicLessonsPage() {
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;
  const router = useRouter();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [tone, setTone] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        search: search,
        category: category === 'All' ? '' : category,
        emotionalTone: tone === 'All' ? '' : tone,
        sortBy: sortBy,
        page: currentPage,
        limit: 8,
      }).toString();

      const data = await api.get(`/lessons?${query}`);
      setLessons(data.lessons || []);
      setTotalPages(data.totalPages || 1);
      setTotalResults(data.totalLessons || 0);
    } catch (error) {
      toast.error(error.message || 'Failed to connect to archives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [category, tone, sortBy, currentPage]);

  const handleSearchSubmit = e => {
    e.preventDefault();
    setCurrentPage(1);
    fetchLessons();
  };

  return (
    <div className="min-h-screen bg-white text-slate-600 pb-24">
      <Toaster position="top-center" />

      {/* Hero Header */}
      <div className="bg-slate-50 py-20 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-indigo-600 rounded-full"></div>
            <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em]">
              Public Archives
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 leading-none tracking-tighter mb-6">
            Explore Collective <span className="text-slate-400">Wisdom</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
            Total Insights Preserved:{' '}
            <span className="text-indigo-600">{totalResults}</span>
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 p-4 rounded-[2rem] shadow-xl shadow-indigo-500/5 flex flex-col lg:flex-row gap-4 items-center">
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full lg:max-w-md"
          >
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search wisdom..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 text-slate-900 placeholder:text-slate-400 text-sm pl-12 pr-4 h-14 outline-none focus:border-indigo-600/30 transition-all rounded-2xl font-medium"
            />
          </form>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-end">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-4 h-14">
              <FiBarChart2 className="text-indigo-600" />
              <select
                value={sortBy}
                onChange={e => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-[11px] font-black uppercase outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="mostSaved">Most Saved</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-4 h-14">
              <FiFilter className="text-slate-400" />
              <select
                value={category}
                onChange={e => {
                  setCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-[11px] font-black uppercase outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Personal Growth">Personal Growth</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Relationships">Relationships</option>
                <option value="Career">Career</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-slate-50 border border-slate-100 rounded-[2.5rem] animate-pulse"
              />
            ))}
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-slate-100 rounded-[3rem]">
            <FiInbox className="mx-auto text-slate-200 mb-4" size={60} />
            <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">
              No wisdom found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {lessons.map(lesson => {
                const isLocked =
                  lesson.accessLevel === 'Premium' &&
                  currentUser?.plan !== 'premium';
                return (
                  <motion.div
                    key={lesson._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -10 }}
                    onClick={() =>
                      isLocked
                        ? router.push('/pricing')
                        : router.push(`/public-lessons/${lesson._id}`)
                    }
                    className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden flex flex-col h-full transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.1)] cursor-pointer"
                  >
                    <div className="relative h-60 overflow-hidden m-3 rounded-[2rem] bg-slate-100">
                      <img
                        src={
                          lesson.image || 'https://via.placeholder.com/400x300'
                        }
                        alt={lesson.title}
                        className={`w-full h-full object-cover transition-transform duration-700 ${!isLocked ? 'group-hover:scale-110' : 'blur-3xl opacity-30'}`}
                      />
                      <div className="absolute top-4 left-4">
                        <span
                          className={`text-[9px] font-black uppercase px-4 py-2 rounded-full border border-white/20 backdrop-blur-md ${lesson.accessLevel === 'Premium' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/80 text-indigo-600'}`}
                        >
                          {lesson.accessLevel}
                        </span>
                      </div>
                      {isLocked && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                          <FiLock className="text-indigo-600 text-4xl mb-2" />
                          <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">
                            Upgrade to View
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-8 pt-4 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        <FiTag className="text-indigo-600" /> {lesson.category}
                      </div>
                      <h3
                        className={`text-xl font-bold text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors ${isLocked ? 'opacity-30' : ''}`}
                      >
                        {lesson.title}
                      </h3>
                      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                            <img
                              src={
                                lesson.author?.image ||
                                'https://i.ibb.co.com/vP99Tpx/user.png'
                              }
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-[10px] text-slate-900 font-black uppercase tracking-tighter">
                            {lesson.author?.name?.split(' ')[0]}
                          </span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                          <FiEye size={16} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {!loading && lessons.length > 0 && (
          <div className="mt-20 flex justify-center items-center gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white disabled:opacity-20 transition-all shadow-sm"
            >
              <FiChevronLeft size={24} />
            </button>
            <div className="px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs text-slate-900">
              {currentPage} <span className="mx-2 text-slate-300">/</span>{' '}
              {totalPages}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white disabled:opacity-20 transition-all shadow-sm"
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
