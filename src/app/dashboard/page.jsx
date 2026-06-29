'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiBook,
  FiHeart,
  FiStar,
  FiArrowRight,
  FiActivity,
  FiUser,
} from 'react-icons/fi';
import { authClient } from '@/lib/auth-client';
import DashboardChart from '@/components/Dashboard/DashboardChart';
import { api } from '@/lib/reusableApi';
import Link from 'next/link';

export default function UserDashboardHome() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [userLessons, setUserLessons] = useState([]);
  const [stats, setStats] = useState({
    totalCreated: 0,
    totalSaved: 0,
    totalLikes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) router.replace('/signin');
  }, [session, isPending, router]);

  useEffect(() => {
    if (isPending || !session?.user) return;
    const fetchDashboardData = async () => {
      try {
        const [authorRes, favoritesRes] = await Promise.all([
          api.get(`/author-profile/${session.user.id}`),
          api.get(`/favorites/${session.user.id}`),
        ]);
        setStats({
          totalCreated: authorRes.totalLessons || 0,
          totalSaved: favoritesRes.length,
          totalLikes: authorRes.totalLikes || 0,
        });
        setUserLessons(authorRes.lessons || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [session, isPending]);

  if (isPending || loading) return <LoadingUI />;

  return (
    <div className="space-y-10 p-6 md:p-10 min-h-screen bg-white text-slate-600">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
            Welcome back,{' '}
            <span className="text-indigo-600">
              {session?.user?.name.split(' ')[0]}
            </span>
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active Now
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Registry: {session?.user?.role}
            </span>
          </div>
        </motion.div>

        <button
          onClick={() => router.push('/dashboard/user/add-lesson')}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-3 active:scale-95"
        >
          <FiPlus size={18} /> New Archive Entry
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <StatCard
          label="Lessons Created"
          value={stats.totalCreated}
          icon={<FiBook size={24} />}
          color="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          label="Wisdom Saved"
          value={stats.totalSaved}
          icon={<FiStar size={24} />}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Total Impact"
          value={stats.totalLikes}
          icon={<FiHeart size={24} />}
          color="bg-rose-50 text-rose-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Analytics Section */}
        <div className="lg:col-span-2 bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                <FiActivity />
              </div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                Performance Matrix
              </h2>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-slate-100">
              Last 30 Days
            </span>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100">
            <DashboardChart mockLessonsData={userLessons} />
          </div>
        </div>

        {/* Recent & Profile Shortcut Sidebar */}
        <div className="space-y-8">
          <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-500/5">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 pb-4 border-b border-slate-50">
              Recently Added
            </h3>
            <div className="space-y-6">
              {userLessons.length > 0 ? (
                userLessons.slice(0, 3).map(lesson => (
                  <div
                    key={lesson._id}
                    className="group cursor-pointer flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 group-hover:border-indigo-200 transition-all">
                      <img
                        src={lesson.image}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                        {lesson.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                        {lesson.category}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-300 italic py-4">
                  No recent records.
                </p>
              )}
            </div>

            <button
              onClick={() => router.push('/dashboard/user/my-lessons')}
              className="w-full mt-10 py-4 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all flex items-center justify-center gap-2"
            >
              View All Archives <FiArrowRight />
            </button>
          </div>

          <Link
            href="/dashboard/profile"
            className="flex items-center justify-between p-6 bg-indigo-50 hover:bg-indigo-100 rounded-[2rem] border border-indigo-100 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                <FiUser size={20} />
              </div>
              <span className="text-sm font-black text-indigo-900 uppercase tracking-widest">
                Account Settings
              </span>
            </div>
            <FiArrowRight className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Sub-Component: Stat Card
function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex items-center justify-between shadow-xl shadow-indigo-500/5 group hover:border-indigo-200 transition-all">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          {label}
        </p>
        <p className="text-5xl font-black text-slate-900 mt-3 tracking-tighter group-hover:text-indigo-600 transition-colors">
          {value}
        </p>
      </div>
      <div
        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner ${color}`}
      >
        {icon}
      </div>
    </div>
  );
}

// Sub-Component: Loading UI
function LoadingUI() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white">
      <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      <span className="text-slate-400 font-black uppercase text-[10px] tracking-[0.4em]">
        Syncing Archive Data...
      </span>
    </div>
  );
}
