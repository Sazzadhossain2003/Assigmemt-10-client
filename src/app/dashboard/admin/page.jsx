'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiBookOpen,
  FiAlertTriangle,
  FiCalendar,
  FiActivity,
  FiAward,
  FiStar,
  FiArrowUpRight,
  FiChevronRight,
} from 'react-icons/fi';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminDashboardCharts from '@/components/Dashboard/AdminDashboardCharts';
import { api } from '@/lib/reusableApi';

const AdminDashboardHome = () => {
  const [dashboardData, setDashboardData] = useState({
    users: [],
    lessons: [],
    reports: [],
    stats: {},
    chartData: [],
    topContributors: [],
    todayLessons: 0,
    loading: true,
  });

  const { data: session, isPending: authLoading } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!session || session.user.role !== 'admin')) {
      router.replace('/signin');
    }
  }, [session, authLoading, router]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [userRes, lessonRes, reportRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/all-lessons'),
          api.get('/admin/reported-lessons'),
        ]);

        const lessons = lessonRes.lessons || [];
        const users = userRes || [];
        const todayStr = new Date().toISOString().split('T')[0];

        const processChartData = () => {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          return days.map(day => ({
            date: day,
            lessonCount: lessons.filter(
              l =>
                new Date(l.createdAt).toLocaleDateString('en-US', {
                  weekday: 'short',
                }) === day,
            ).length,
            userCount: users.filter(
              u =>
                new Date(u.createdAt).toLocaleDateString('en-US', {
                  weekday: 'short',
                }) === day,
            ).length,
          }));
        };

        const calculateTopContributors = () => {
          const userAgg = lessons.reduce((acc, l) => {
            const id = l.author?.userId;
            if (id) {
              acc[id] = acc[id] || { likes: 0, count: 0 };
              acc[id].likes += l.likes?.length || 0;
              acc[id].count += 1;
            }
            return acc;
          }, {});

          return users
            .map(u => ({
              ...u,
              score:
                (userAgg[u._id]?.likes || 0) * 2 +
                (userAgg[u._id]?.count || 0) * 5,
              totalLikes: userAgg[u._id]?.likes || 0,
              totalLessons: userAgg[u._id]?.count || 0,
            }))
            .filter(u => u.totalLessons > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
        };

        setDashboardData({
          users,
          lessons,
          reports: reportRes || [],
          stats: lessonRes.stats || {},
          chartData: processChartData(),
          topContributors: calculateTopContributors(),
          todayLessons: lessons.filter(l => l.createdAt.startsWith(todayStr))
            .length,
          loading: false,
        });
      } catch (err) {
        console.error('Dashboard Data Sync Error:', err.message);
      }
    };

    if (session?.user.role === 'admin') fetchAllData();
  }, [session]);

  if (authLoading || dashboardData.loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full"
        />
        <p className="text-slate-500 font-medium text-sm animate-pulse">
          Loading Analytics...
        </p>
      </div>
    );

  const stats = [
    {
      label: 'Total Users',
      value: dashboardData.users.length,
      icon: <FiUsers />,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Public Wisdom',
      value: dashboardData.stats.publicCount || 0,
      icon: <FiBookOpen />,
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      label: 'Reported Flags',
      value: dashboardData.reports.length,
      icon: <FiAlertTriangle />,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      label: "Today's Entry",
      value: dashboardData.todayLessons,
      icon: <FiCalendar />,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-[#f8fafc] min-h-screen text-slate-600">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Admin <span className="text-indigo-600">Overview</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Welcome back, {session?.user?.name || 'Commander'}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            System Live
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div
                className={`${stat.bgColor} ${stat.iconColor} p-3 rounded-xl text-xl`}
              >
                {stat.icon}
              </div>
              <span className="text-emerald-500 bg-emerald-50 text-[10px] font-bold px-2 py-1 rounded">
                +12%
              </span>
            </div>
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider mt-4">
              {stat.label}
            </p>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              {stat.value.toLocaleString()}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-slate-800 font-bold flex items-center gap-2 text-base">
              <FiActivity className="text-indigo-600" /> Platform Growth
            </h3>
            <select className="text-xs font-bold border-none bg-slate-50 rounded-lg focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <AdminDashboardCharts data={dashboardData.chartData} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Top Contributors */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-800 font-bold text-sm flex items-center justify-between mb-6">
              <span className="flex items-center gap-2">
                <FiAward className="text-amber-500" /> Elite Contributors
              </span>
              <FiArrowUpRight className="text-slate-400" />
            </h3>
            <div className="space-y-5">
              {dashboardData.topContributors.map((user, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 shrink-0">
                      <Link href={`/author-profile/${user._id}`}>
                        {user?.image ? (
                          <Image
                            alt="User"
                            fill
                            src={user?.image}
                            className="rounded-full object-cover border-2 border-transparent group-hover:border-indigo-500 transition-all"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                            {user?.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </Link>
                    </div>
                    <div className="truncate">
                      <Link href={`/author-profile/${user._id}`}>
                        <p className="text-sm font-bold text-slate-800 truncate hover:text-indigo-600 transition-colors">
                          {user.name}
                        </p>
                      </Link>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {user.totalLessons} Lessons published
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <FiStar size={12} fill="currentColor" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reported Flags  */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-red-600 font-bold text-sm mb-4 flex items-center gap-2">
              <FiAlertTriangle /> Urgent Moderation
            </h3>
            <div className="space-y-3">
              {dashboardData.reports.length > 0 ? (
                dashboardData.reports.slice(0, 3).map((r, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-red-100 transition-colors"
                  >
                    <p className="text-slate-800 font-bold text-xs truncate">
                      {r.lessonTitle || 'System Flag'}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-red-500 font-bold px-2 py-0.5 bg-red-50 rounded">
                        {r.reason}
                      </span>
                      <FiChevronRight className="text-slate-400" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-400 text-center py-4">
                  No pending reports
                </p>
              )}

              <Link
                href="/dashboard/admin/reported-lessons"
                className="block w-full text-center py-3 mt-2 bg-slate-900 rounded-xl text-xs font-bold text-white hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
              >
                Review All Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
