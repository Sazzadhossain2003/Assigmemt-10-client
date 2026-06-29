'use client';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import {
  FiTrash2,
  FiStar,
  FiCheckCircle,
  FiFilter,
  FiEye,
  FiArchive,
  FiUser,
  FiExternalLink,
  FiBookOpen,
  FiActivity,
} from 'react-icons/fi';
import { api } from '@/lib/reusableApi';
import ConfirmationModal from './ConfiremDeletModal';


const ManageLessonsPageByAdmin = () => {
  const [lessons, setLessons] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    publicCount: 0,
    privateCount: 0,
    featuredCount: 0,
    flaggedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [modal, setModal] = useState({ isOpen: false, lesson: null });

  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    fetchLessons();
  }, []);

  useEffect(() => {
    if (!isPending && (!session || session.user.role !== 'admin'))
      router.replace('/signin');
  }, [session, isPending, router]);

  const fetchLessons = async () => {
    try {
      const data = await api.get('/admin/all-lessons');
      setLessons(data.lessons || []);
      setStats(data.stats || stats);
    } catch (error) {
      toast.error('System sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, field, currentValue) => {
    const prev = [...lessons];
    setLessons(l =>
      l.map(item =>
        item._id === id ? { ...item, [field]: !currentValue } : item,
      ),
    );
    try {
      await api.patch(`/admin/lessons/status/${id}`, {
        [field]: !currentValue,
      });
      toast.success(`${field.replace('is', '')} Updated`);
    } catch (err) {
      setLessons(prev);
      toast.error('Update failed');
    }
  };

  const handleDeleteLesson = async () => {
    const { lesson } = modal;
    setLessons(prev => prev.filter(l => l._id !== lesson._id));
    try {
      await api.delete(`/admin/lessons/${lesson._id}`);
      toast.success('Record Erased');
    } catch (err) {
      fetchLessons();
      toast.error('Purge failed');
    }
    setModal({ isOpen: false, lesson: null });
  };

  const filteredLessons = lessons.filter(l => {
    if (filter === 'All') return true;
    if (filter === 'Public' || filter === 'Private')
      return l.visibility === filter;
    if (filter === 'Featured') return l.isFeatured;
    if (filter === 'Flagged') return l.reports?.length > 0;
    return l.category === filter;
  });

  if (loading)
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
          Master Archive Loading...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-slate-600 p-6 lg:p-12">
      <Toaster position="top-right" />
      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, lesson: null })}
        onConfirm={handleDeleteLesson}
        title="Confirm Purge"
        message="Critical Action: Permanently erase this wisdom record from the master registry?"
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header & Stats */}
        <header className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
              <FiArchive size={28} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">
                Lesson <span className="text-indigo-600">Archive</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">
                Registry Management Console
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: 'Public',
                value: stats.publicCount,
                color: 'text-emerald-500',
                bg: 'bg-emerald-50',
              },
              {
                label: 'Private',
                value: stats.privateCount,
                color: 'text-slate-400',
                bg: 'bg-slate-50',
              },
              {
                label: 'Featured',
                value: stats.featuredCount,
                color: 'text-indigo-600',
                bg: 'bg-indigo-50',
              },
              {
                label: 'Flagged',
                value: stats.flaggedCount,
                color: 'text-rose-500',
                bg: 'bg-rose-50',
              },
            ].map((s, i) => (
              <div
                key={i}
                className={`p-8 rounded-[2rem] border border-slate-100 ${s.bg} shadow-sm`}
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  {s.label}
                </p>
                <p
                  className={`text-4xl font-black tracking-tighter ${s.color}`}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 border border-slate-100 p-3 rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-3 ml-4">
            <FiFilter className="text-indigo-600" />
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Master Filter:
            </span>
          </div>
          <select
            className="w-full md:w-64 bg-white border border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-900 py-4 px-6 rounded-2xl outline-none cursor-pointer focus:border-indigo-600/30 transition-all shadow-sm"
            onChange={e => setFilter(e.target.value)}
            value={filter}
          >
            <option value="All"> Master List </option>
            <option value="Public"> Public Wisdom </option>
            <option value="Private"> Private Vault </option>
            <option value="Featured"> Featured Entries </option>
            <option value="Flagged"> Flagged Items </option>
          </select>
        </div>

        {/* Table View */}
        <div className="hidden lg:block bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-indigo-500/5">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[3px]">
                <th className="px-10 py-8">Lesson Identity</th>
                <th className="px-6 py-8">Topic</th>
                <th className="px-6 py-8 text-center">Status</th>
                <th className="px-10 py-8 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLessons.map(lesson => (
                <tr
                  key={lesson._id}
                  className="hover:bg-indigo-50/30 transition-all group"
                >
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <img
                          src={
                            lesson.image || 'https://via.placeholder.com/100'
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="max-w-[280px]">
                        <Link
                          href={`/public-lessons/${lesson._id}`}
                          className="font-bold text-slate-900 truncate block group-hover:text-indigo-600 transition-colors uppercase text-sm"
                        >
                          {lesson.title}
                        </Link>
                        <Link
                          href={`/author-profile/${lesson.author?.userId}`}
                          className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5 mt-1 hover:text-indigo-600 transition-colors"
                        >
                          <FiUser size={10} className="text-indigo-400" />{' '}
                          {lesson.author?.name}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-7 text-center">
                    <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase text-slate-400 tracking-widest">
                      {lesson.category}
                    </span>
                  </td>
                  <td className="px-6 py-7">
                    <div className="flex justify-center gap-6">
                      <FiEye
                        className={
                          lesson.visibility === 'Public'
                            ? 'text-emerald-500'
                            : 'text-slate-200'
                        }
                        size={20}
                        title="Public"
                      />
                      <FiCheckCircle
                        className={
                          lesson.isReviewed ? 'text-blue-500' : 'text-slate-200'
                        }
                        size={20}
                        title="Reviewed"
                      />
                      <FiStar
                        className={
                          lesson.isFeatured
                            ? 'text-indigo-600 fill-indigo-600'
                            : 'text-slate-200'
                        }
                        size={20}
                        title="Featured"
                      />
                    </div>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            lesson._id,
                            'isFeatured',
                            lesson.isFeatured,
                          )
                        }
                        className={`px-4 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${lesson.isFeatured ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-indigo-600'}`}
                      >
                        {lesson.isFeatured ? 'Elite' : 'Promote'}
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            lesson._id,
                            'isReviewed',
                            lesson.isReviewed,
                          )
                        }
                        className={`px-4 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${lesson.isReviewed ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-blue-600'}`}
                      >
                        {lesson.isReviewed ? 'Verified' : 'Verify'}
                      </button>
                      <button
                        onClick={() => setModal({ isOpen: true, lesson })}
                        className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
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

        {/* Mobile View */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLessons.map(lesson => (
            <div
              key={lesson._id}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-indigo-500/5"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-900 uppercase truncate">
                    {lesson.title}
                  </h4>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">
                    {lesson.category}
                  </p>
                </div>
                <div className="flex gap-2">
                  <FiStar
                    className={
                      lesson.isFeatured
                        ? 'text-indigo-600 fill-indigo-600'
                        : 'text-slate-200'
                    }
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-6 border-t border-slate-50">
                <button
                  onClick={() =>
                    handleUpdateStatus(
                      lesson._id,
                      'isFeatured',
                      lesson.isFeatured,
                    )
                  }
                  className="flex-1 py-3 bg-slate-50 text-[9px] font-black uppercase rounded-xl border border-slate-100"
                >
                  Status
                </button>
                <button
                  onClick={() => setModal({ isOpen: true, lesson })}
                  className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-500 rounded-xl"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageLessonsPageByAdmin;
