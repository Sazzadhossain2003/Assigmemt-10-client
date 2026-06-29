'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FiBookmark, FiArrowUpRight, FiHeart } from 'react-icons/fi'; // react-icons ব্যবহার করা হয়েছে
import { authClient } from '@/lib/auth-client';
import { api } from '@/lib/reusableApi';

const MostSavedLessons = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch top lessons
  useEffect(() => {
    const fetchTopLessons = async () => {
      try {
        const userId = session?.user?.id || '';
        const data = await api.get(`/most-saved-lessons?userId=${userId}`);
        setLessons(data);
      } catch (error) {
        console.error('Archive retrieval error:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTopLessons();
  }, [session?.user?.id]);

  // Navigation logic
  const handleNavigateDetail = lessonId => {
    if (!session?.user) {
      toast.error('Identification required to explore this wisdom!');
      return;
    }
    router.push(`/public-lessons/${lessonId}`);
  };

  // Toggle favorite logic
  const handleToggleFavorite = async (e, lessonId) => {
    e.stopPropagation();
    if (!session?.user) return toast.error('Identification required!');

    try {
      const resData = await api.post(`/lessons/${lessonId}/favorite`, {
        userId: session.user.id,
      });

      setLessons(prev =>
        prev.map(lesson =>
          lesson._id === lessonId
            ? {
                ...lesson,
                hasFavorited: resData.favorited,
                favoritesCount: resData.favorited
                  ? (lesson.favoritesCount || 0) + 1
                  : Math.max(0, (lesson.favoritesCount || 0) - 1),
              }
            : lesson,
        ),
      );
      toast.success(resData.message);
    } catch (error) {
      toast.error(error.message || 'Sync failed');
    }
  };

  // Loading Skeleton State
  if (loading)
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <span className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">
          Loading Wisdom...
        </span>
      </div>
    );

  return (
    <section className="bg-white w-full py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-50/50 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-indigo-600 rounded-full"></div>
              <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em]">
                Popular Archives
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
              Most Saved <span className="text-gray-400">Wisdom</span>
            </h2>
          </div>
          <div className="h-[1px] flex-1 bg-slate-100 mx-8 hidden md:block mb-4"></div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleNavigateDetail(lesson._id)}
              className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-indigo-200 hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.1)] transition-all duration-500 cursor-pointer flex flex-col h-full"
            >
              {/* Media Container */}
              <div className="relative h-60 overflow-hidden m-3 rounded-[2rem]">
                <img
                  src={lesson.image}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={lesson.title}
                />

                {/* Floating Favorite Button */}
                <button
                  onClick={e => handleToggleFavorite(e, lesson._id)}
                  className={`absolute top-4 right-4 p-3.5 rounded-2xl backdrop-blur-md transition-all duration-300 border z-20 ${
                    lesson.hasFavorited
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                      : 'bg-white/70 border-white/20 text-indigo-600 hover:bg-white hover:scale-110'
                  }`}
                >
                  <FiBookmark
                    size={18}
                    className={lesson.hasFavorited ? 'fill-current' : ''}
                  />
                </button>
              </div>

              {/* Card Content */}
              <div className="p-8 pt-4 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
                    {lesson.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                    <FiHeart className="text-rose-400" />
                    {lesson.favoritesCount || 0} Saves
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 mb-8">
                  {lesson.title}
                </h3>

                {/* Card Footer */}
                <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black group-hover:text-indigo-600 transition-colors">
                    Explore Wisdom
                  </span>
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-500">
                    <FiArrowUpRight size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MostSavedLessons;
