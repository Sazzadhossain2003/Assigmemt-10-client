'use client';

import React, { useState, useEffect } from 'react';
import {
  FiStar,
  FiEdit3,
  FiSave,
  FiBook,
  FiHeart,
  FiUser,
  FiLoader,
  FiX,
  FiChevronRight,
} from 'react-icons/fi';
import { authClient } from '@/lib/auth-client';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/reusableApi';
import Link from 'next/link';

const UserProfile = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [userLessons, setUserLessons] = useState([]);
  const [favCount, setFavCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user?.name);
      setPhotoURL(user.image || '');

      const fetchUserData = async () => {
        try {
          const [profileResponse, favoritesData] = await Promise.all([
            api.get(`/author-profile/${user.id}`),
            api.get(`/favorites/${user.id}`),
          ]);
          setUserLessons(profileResponse.lessons || []);
          setFavCount(favoritesData.length);
        } catch (error) {
          toast.error('Could not load archive data');
        }
      };
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (!isPending && !session) router.replace('/signin');
  }, [session, isPending, router]);

  const getInitials = fullName => {
    if (!fullName) return '??';
    const parts = fullName.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return fullName.slice(0, 2).toUpperCase();
  };

  const formattedJoinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'New Archivist';

  const handleUpdateProfile = async () => {
    if (!name || !photoURL) return toast.error('Both fields are required');
    setIsUpdating(true);
    try {
      const response = await api.patch(`/profile/update/${user.id}`, {
        name,
        image: photoURL,
      });
      if (response && response.success) {
        toast.success('Archive record updated');
        setIsEditing(false);
        setTimeout(() => window.location.reload(), 500);
      } else {
        toast.error(response?.message || 'Update failed');
      }
    } catch (err) {
      toast.error('Sync failed');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isPending)
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
          Accessing Vault...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-slate-600 p-6 md:p-12 relative overflow-hidden">
      <Toaster position="bottom-right" />

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* --- PROFILE HEADER --- */}
        <section className="bg-slate-50 border border-slate-100 rounded-[3rem] p-8 md:p-16 mb-12 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-36 h-36 md:w-52 md:h-52 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center bg-white">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                ) : (
                  <span className="text-5xl font-black text-indigo-600">
                    {getInitials(user?.name)}
                  </span>
                )}
              </div>
              {user?.plan === 'premium' && (
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-3 rounded-2xl text-white shadow-xl shadow-indigo-200 border-4 border-slate-50 animate-bounce">
                  <FiStar size={20} fill="currentColor" />
                </div>
              )}
            </div>

            <div className="flex-grow text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4 max-w-md mx-auto md:mx-0 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                      Update Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:border-indigo-600/30 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                      Photo URL
                    </label>
                    <input
                      type="text"
                      value={photoURL}
                      onChange={e => setPhotoURL(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:border-indigo-600/30 transition-all font-bold"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                      className="flex-1 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      {isUpdating ? (
                        <FiLoader className="animate-spin" />
                      ) : (
                        <FiSave />
                      )}{' '}
                      Save Record
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                      {user?.name}
                    </h1>
                    {user?.plan === 'premium' && (
                      <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100">
                        Premium ⭐
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 font-bold tracking-widest text-sm uppercase">
                    {user?.email}
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-8 flex items-center gap-3 bg-white border border-slate-200 px-8 py-4 rounded-2xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all text-[11px] font-black uppercase tracking-widest shadow-sm"
                  >
                    <FiEdit3 size={16} /> Refine Profile Identity
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* --- STATS SECTION --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-xl shadow-indigo-500/5 group hover:border-indigo-200 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-5xl font-black text-slate-900 tracking-tighter">
                  {userLessons.length}
                </h3>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em] mt-3">
                  Lessons Created
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <FiBook size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-xl shadow-indigo-500/5 group hover:border-indigo-200 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-5xl font-black text-slate-900 tracking-tighter">
                  {favCount}
                </h3>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em] mt-3">
                  Saved Wisdom
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
                <FiHeart size={24} />
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 border border-indigo-600 p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-200 flex items-center gap-6 sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
              <FiUser size={24} />
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100">
                Member Since
              </h4>
              <p className="text-xl font-bold text-white mt-1">
                {formattedJoinDate}
              </p>
            </div>
          </div>
        </div>

        {/* --- CONTRIBUTIONS GRID --- */}
        <section>
          <div className="flex items-center justify-between mb-12 border-b border-slate-100 pb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
              Public <span className="text-indigo-600">Archives</span>
            </h2>
            <div className="w-12 h-1 bg-indigo-600 rounded-full" />
          </div>

          {userLessons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {userLessons
                .filter(l => l.visibility === 'Public')
                .map(lesson => (
                  <motion.div
                    key={lesson._id}
                    whileHover={{ y: -10 }}
                    className="group bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-xl shadow-indigo-500/5 transition-all"
                  >
                    <Link href={`/public-lessons/${lesson._id}`}>
                      <div className="relative aspect-video overflow-hidden m-3 rounded-[1.5rem] bg-slate-50">
                        <img
                          src={lesson.image}
                          alt={lesson.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black text-indigo-600 uppercase tracking-widest border border-white/20">
                          {lesson.category}
                        </div>
                      </div>
                      <div className="p-7 pt-2">
                        <h4 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {lesson.title}
                        </h4>
                        <div className="mt-5 pt-5 border-t border-slate-50 flex justify-between items-center text-slate-400 group-hover:text-indigo-600 transition-all">
                          <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            {lesson.accessLevel === 'Premium' ? (
                              <FiStar className="text-indigo-600 fill-current" />
                            ) : (
                              <FiStar />
                            )}{' '}
                            {lesson.accessLevel}
                          </span>
                          <FiChevronRight size={18} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          ) : (
            <div className="py-32 text-center border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50">
              <FiBook className="mx-auto text-slate-200 mb-6" size={60} />
              <p className="text-xl font-black uppercase tracking-widest text-slate-400">
                No public entries archived
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
