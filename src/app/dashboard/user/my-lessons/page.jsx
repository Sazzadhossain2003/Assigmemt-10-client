'use client';

import React, { useState, useEffect } from 'react';
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiHeart,
  FiBookmark,
  FiBookOpen,
  FiLock,
  FiGlobe,
  FiStar,
  FiCalendar,
  FiPlus,
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/reusableApi';
import DeleteLessonModal from '../../DeleteLessonModal';
import { motion } from 'framer-motion';

export default function MyLessonsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isPremiumUser = user?.plan === 'premium' || false;

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);

  useEffect(() => {
    if (!isPending && !session) router.replace('/signin');
  }, [session, isPending, router]);

  const fetchMyLessons = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await api.get(`/author-profile/${user.id}`);
      setLessons(data.lessons || []);
    } catch (error) {
      toast.error(error.message || 'Could not sync with archives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLessons();
  }, [user?.id]);

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const openDeleteModal = lesson => {
    setLessonToDelete(lesson);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setLessonToDelete(null);
  };

  const executeDelete = async () => {
    if (!lessonToDelete) return;
    try {
      await api.delete(`/lessons/${lessonToDelete._id}`);
      setLessons(prev => prev.filter(l => l._id !== lessonToDelete._id));
      toast.success('Wisdom erased');
      closeDeleteModal();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const handleToggleVisibility = async (id, current) => {
    const next = current === 'Public' ? 'Private' : 'Public';
    try {
      await api.patch(`/lessons/${id}`, { visibility: next });
      setLessons(prev =>
        prev.map(l => (l._id === id ? { ...l, visibility: next } : l)),
      );
      toast.success(`Wisdom is now ${next}`);
    } catch (err) {
      toast.error('Sync failed');
    }
  };

  const handleToggleAccess = async (id, current) => {
    if (!isPremiumUser) {
      toast.error('Premium access required');
      return;
    }
    const next = current === 'Premium' ? 'Free' : 'Premium';
    try {
      await api.patch(`/lessons/${id}`, { accessLevel: next });
      setLessons(prev =>
        prev.map(l => (l._id === id ? { ...l, accessLevel: next } : l)),
      );
      toast.success(`Access set to ${next}`);
    } catch (err) {
      toast.error('Update failed');
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
          Syncing Archives...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-slate-600 p-6 lg:p-12">
      <Toaster position="top-right" />
      <DeleteLessonModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={executeDelete}
        lessonTitle={lessonToDelete?.title}
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-100 pb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              Your <span className="text-indigo-600">Archives</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-4 font-black uppercase tracking-[0.4em]">
              Personal Wisdom Registry System
            </p>
          </div>
          <Link
            href="/dashboard/user/add-lesson"
            className="w-full md:w-auto bg-indigo-600 text-white px-10 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-200 flex items-center justify-center gap-2 hover:scale-105 transition-all"
          >
            <FiPlus size={18} /> New Insight
          </Link>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-indigo-500/5">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="py-8 px-10">Archive Identity</th>
                <th className="py-8 px-6">Visibility</th>
                <th className="py-8 px-6">Policy</th>
                <th className="py-8 px-6">Registry Date</th>
                <th className="py-8 px-6 text-center">Impact</th>
                <th className="py-8 px-10 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {lessons.map(lesson => (
                <tr
                  key={lesson._id}
                  className="hover:bg-indigo-50/30 transition-colors group"
                >
                  <td className="py-7 px-10">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        {lesson.image ? (
                          <img
                            src={lesson.image}
                            className="w-full h-full object-cover"
                            alt="thumb"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-indigo-600">
                            <FiBookOpen size={20} />
                          </div>
                        )}
                      </div>
                      <div className="max-w-[250px]">
                        <h4 className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                          {lesson.title}
                        </h4>
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                          {lesson.category}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-7 px-6">
                    <button
                      onClick={() =>
                        handleToggleVisibility(lesson._id, lesson.visibility)
                      }
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${lesson.visibility === 'Public' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}
                    >
                      {lesson.visibility === 'Public' ? (
                        <FiGlobe />
                      ) : (
                        <FiLock />
                      )}{' '}
                      {lesson.visibility}
                    </button>
                  </td>
                  <td className="py-7 px-6">
                    <button
                      onClick={() =>
                        handleToggleAccess(lesson._id, lesson.accessLevel)
                      }
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${lesson.accessLevel === 'Premium' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-200'}`}
                    >
                      {lesson.accessLevel === 'Premium' && <FiStar />}{' '}
                      {lesson.accessLevel}
                    </button>
                  </td>
                  <td className="py-7 px-6">
                    <span className="text-[10px] font-black text-slate-400 flex items-center gap-2">
                      <FiCalendar className="text-indigo-600" />{' '}
                      {formatDate(lesson.createdAt)}
                    </span>
                  </td>
                  <td className="py-7 px-6">
                    <div className="flex justify-center gap-4 text-[10px] font-black">
                      <span className="flex items-center gap-1.5 text-rose-500">
                        <FiHeart /> {lesson.likesCount || 0}
                      </span>
                      <span className="flex items-center gap-1.5 text-indigo-600">
                        <FiBookmark /> {lesson.favoritesCount || 0}
                      </span>
                    </div>
                  </td>
                  <td className="py-7 px-10 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/user/my-lessons/${lesson._id}`}
                        className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                      >
                        <FiEdit2 size={16} />
                      </Link>
                      <button
                        onClick={() => openDeleteModal(lesson)}
                        className="p-3 bg-slate-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {lessons.length === 0 && !loading && (
          <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <FiBookOpen size={60} className="mx-auto text-slate-200 mb-6" />
            <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">
              No wisdom archived yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
