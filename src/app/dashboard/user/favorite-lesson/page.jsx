'use client';
import React, { useState, useEffect } from 'react';
import {
  FiTrash2,
  FiEye,
  FiBookmark,
  FiFilter,
  FiInfo,
  FiChevronRight,
} from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/reusableApi';
import { motion } from 'framer-motion';
import DeleteConfirmModal from '../../DeleteConfirmModal';
import Link from 'next/link';

export default function UserFavoritePage() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const router = useRouter();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    lesson: null,
  });

  useEffect(() => {
    const fetchFavoritesData = async () => {
      if (!session?.user?.id) return;
      try {
        setLoading(true);
        const query = new URLSearchParams({
          category: selectedCategory,
        }).toString();
        const data = await api.get(`/favorites/${session.user.id}?${query}`);
        setFavorites(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error('Failed to sync archives');
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchFavoritesData();
  }, [session, selectedCategory]);

  useEffect(() => {
    if (!authLoading && !session) router.replace('/signin');
  }, [session, authLoading, router]);

  const handleOpenModal = lesson => setConfirmModal({ isOpen: true, lesson });

  const executeRemove = async () => {
    const lessonId = confirmModal.lesson?._id;
    setConfirmModal({ isOpen: false, lesson: null });
    try {
      await api.post(`/lessons/${lessonId}/favorite`, {
        userId: session?.user?.id,
      });
      setFavorites(prev => prev.filter(fav => fav._id !== lessonId));
      toast.success('Wisdom removed');
    } catch (error) {
      toast.error('Action failed');
    }
  };

  if (authLoading || (session && loading)) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
          Accessing Saved Wisdom...
        </p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-white text-slate-600 p-6 lg:p-12 relative overflow-hidden">
      <Toaster position="bottom-right" />

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <DeleteConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, lesson: null })}
        onConfirm={executeRemove}
        title={confirmModal.lesson?.title}
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-center border-b border-slate-100 pb-12 gap-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-4">
              Saved <span className="text-indigo-600">Wisdom</span>
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-2">
                <FiBookmark /> {favorites.length} Preserved
              </span>
            </div>
          </div>

          {/* CATEGORY FILTER */}
          <div className="bg-slate-50 border border-slate-100 p-2 rounded-2xl flex items-center gap-3 w-full lg:w-auto">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400">
              <FiFilter size={18} />
            </div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none pr-8 cursor-pointer flex-1 lg:flex-none"
            >
              <option value="">All Categories</option>
              <option value="Personal Growth">Personal Growth</option>
              <option value="Career">Career</option>
              <option value="Relationships">Relationships</option>
            </select>
          </div>
        </div>

        {/* WISDOM CARDS GRID */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {favorites.map(lesson => (
              <motion.div
                key={lesson._id}
                whileHover={{ y: -10 }}
                className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden flex flex-col h-full shadow-xl shadow-indigo-500/5 transition-all duration-500"
              >
                <div className="relative h-56 overflow-hidden m-3 rounded-[2rem] bg-slate-50">
                  <Link
                    href={`/public-lessons/${lesson._id}`}
                    className="block h-full"
                  >
                    <img
                      src={lesson.image}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt="insight"
                    />
                  </Link>
                </div>

                <div className="p-8 pt-4 flex flex-col flex-grow">
                  <h3 className="text-slate-900 font-bold text-lg line-clamp-1 mb-6 group-hover:text-indigo-600 transition-colors">
                    {lesson.title}
                  </h3>

                  <div className="mt-auto flex justify-between items-center pt-6 border-t border-slate-50">
                    <button
                      onClick={() =>
                        router.push(`/public-lessons/${lesson._id}`)
                      }
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:gap-3 transition-all"
                    >
                      View Wisdom <FiChevronRight />
                    </button>

                    <button
                      onClick={() => handleOpenModal(lesson)}
                      className="w-10 h-10 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-slate-50 border-2 border-dashed border-slate-100 rounded-[3rem]">
            <FiInfo className="mx-auto text-slate-200 mb-6" size={60} />
            <p className="text-xl font-black uppercase tracking-widest text-slate-400">
              Your Archive is empty
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
