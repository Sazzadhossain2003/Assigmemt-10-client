'use client';

import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  FaUserShield,
  FaEdit,
  FaEnvelope,
  FaShieldAlt,
  FaSave,
  FaCamera,
} from 'react-icons/fa';
import { FiX, FiUser, FiInfo, FiCalendar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/reusableApi';

const AdminProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  const currentUser = session?.user;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', image: '' });

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/signin');
    } else if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        image: currentUser.image || currentUser.photoURL || '',
      });
      setLoading(false);
    }
  }, [session, isPending, router, currentUser]);

  const handleUpdate = async e => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Name is required');

    try {
      const response = await api.patch(
        `/profile/update/${currentUser.id}`,
        formData,
      );

      if (response?.success) {
        toast.success('Profile updated successfully');
        setIsModalOpen(false);
        setTimeout(() => window.location.reload(), 800);
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  if (loading || isPending) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-bold text-xs tracking-widest uppercase">
          Initializing Profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-600 p-4 md:p-12 font-sans relative">
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <FaUserShield className="text-indigo-600" /> Account Settings
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Manage your administrative identity and credentials.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-100"
          >
            <FaEdit /> Edit Profile
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="w-full h-full rounded-full border-4 border-slate-50 overflow-hidden bg-slate-100 flex items-center justify-center shadow-inner">
                  {currentUser?.image || currentUser?.photoURL ? (
                    <img
                      src={currentUser?.image || currentUser?.photoURL}
                      alt="Admin"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-3xl font-bold text-slate-400">
                      {currentUser?.name
                        ? currentUser.name.slice(0, 2).toUpperCase()
                        : 'AD'}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md border border-slate-100 text-indigo-600">
                  <FaCamera size={14} />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                {currentUser?.name}
              </h3>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                <FaShieldAlt /> {currentUser?.role || 'Admin'}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                    <FaEnvelope />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Email Address
                    </p>
                    <p className="text-slate-700 font-medium">
                      {currentUser?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                    <FiCalendar />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Member Since
                    </p>
                    <p className="text-slate-700 font-medium">
                      {new Date(
                        currentUser?.createdAt || Date.now(),
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Platform Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h4 className="text-slate-900 font-bold flex items-center gap-2 mb-6">
                <FiInfo className="text-indigo-600" /> Admin Permissions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'User Management Access',
                  'Content Moderation Authority',
                  'Platform Analytics Visibility',
                  'Security Protocol Control',
                  'System Log Access',
                  'Privileged Support Access',
                ].map((perm, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                      {perm}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-indigo-600 rounded-3xl text-white flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-indigo-100">
              <div className="text-3xl opacity-50">
                <FaUserShield />
              </div>
              <div>
                <h5 className="font-bold text-lg leading-tight">
                  Security Tip
                </h5>
                <p className="text-indigo-100 text-sm mt-1">
                  Keep your profile information accurate so the community can
                  recognize the official moderation team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Update Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl z-[105] border border-slate-100"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Edit Admin Profile
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Update your display name and avatar
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] uppercase font-bold text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                    <FiUser size={12} /> Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 text-sm text-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none rounded-2xl transition-all"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] uppercase font-bold text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                    <FaCamera size={12} /> Avatar URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={e =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 text-sm text-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none rounded-2xl transition-all"
                    placeholder="https://image-link.com"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3.5 rounded-2xl text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-2 py-3.5 bg-indigo-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 px-8"
                  >
                    <FaSave /> Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProfilePage;
