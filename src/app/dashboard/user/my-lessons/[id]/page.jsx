'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiSave,
  FiArrowLeft,
  FiImage,
  FiUpload,
  FiTrash2,
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { api } from '@/lib/reusableApi';

export default function UpdateLessonPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const imgBBKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  const isPremiumUser = user?.plan === 'premium';

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    emotionalTone: '',
    image: '',
    visibility: 'Public',
    accessLevel: 'Free',
  });

  useEffect(() => {
    if (!isPending && !session) router.replace('/signin');
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const data = await api.get(`/lessons/${id}`);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          category: data.category || '',
          emotionalTone: data.emotionalTone || '',
          image: data.image || '',
          visibility: data.visibility || 'Public',
          accessLevel: data.accessLevel || 'Free',
        });
        setPreviewUrl(data.image);
      } catch (error) {
        toast.error('Failed to retrieve archive data');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchLessonData();
  }, [id]);

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadToImgBB = async file => {
    const body = new FormData();
    body.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgBBKey}`, {
      method: 'POST',
      body,
    });
    const data = await res.json();
    if (data.success) return data.data.display_url;
    throw new Error('Upload Failed');
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setUpdating(true);
    try {
      let finalImageUrl = formData.image;
      if (selectedFile) {
        toast.loading('Uploading artifact...', { id: 'upload' });
        finalImageUrl = await uploadToImgBB(selectedFile);
        toast.success('Visual synced!', { id: 'upload' });
      }
      await api.patch(`/lessons/${id}`, {
        ...formData,
        image: finalImageUrl,
        updatedAt: new Date(),
      });
      toast.success('Wisdom refined!');
      setTimeout(() => router.push('/dashboard/user/my-lessons'), 1000);
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
          Retrieving Archive...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-slate-600 p-6 lg:p-12">
      <Toaster />
      <div className="max-w-5xl mx-auto">
        <Link
          href="/dashboard/user/my-lessons"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all mb-12"
        >
          <FiArrowLeft /> Return to archives
        </Link>

        <header className="mb-16 border-b border-slate-100 pb-12">
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
            Refine <span className="text-indigo-600">Wisdom</span>
          </h1>
          <p className="text-[10px] text-slate-400 mt-4 font-black uppercase tracking-[0.4em]">
            Insight Modification Console
          </p>
        </header>

        <form
          onSubmit={handleUpdate}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          {/* Main Form Fields */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-slate-50 border border-slate-100 p-8 md:p-12 rounded-[3rem] space-y-10 shadow-sm">
              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] uppercase font-black tracking-widest ml-1">
                  Update Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-white border border-slate-100 p-6 rounded-2xl outline-none focus:border-indigo-600/30 text-slate-900 font-bold text-xl shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-slate-400 text-[10px] uppercase font-black tracking-widest ml-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={e =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-white border border-slate-100 p-5 rounded-2xl outline-none font-bold cursor-pointer"
                  >
                    <option value="Personal Growth">Personal Growth</option>
                    <option value="Career">Career</option>
                    <option value="Relationships">Relationships</option>
                    <option value="Mistakes Learned">Mistakes Learned</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-slate-400 text-[10px] uppercase font-black tracking-widest ml-1">
                    Tone
                  </label>
                  <select
                    name="emotionalTone"
                    value={formData.emotionalTone}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        emotionalTone: e.target.value,
                      })
                    }
                    className="w-full bg-white border border-slate-100 p-5 rounded-2xl outline-none font-bold cursor-pointer"
                  >
                    <option value="Motivational">Motivational</option>
                    <option value="Realization">Realization</option>
                    <option value="Gratitude">Gratitude</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] uppercase font-black tracking-widest ml-1">
                  Refined Story
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={10}
                  className="w-full bg-white border border-slate-100 p-8 rounded-[2.5rem] outline-none text-lg leading-relaxed font-medium text-slate-600 shadow-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column (Visual & Controls) */}
          <div className="lg:col-span-5 space-y-10">
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] space-y-8">
              <label className="text-slate-400 text-[10px] uppercase font-black tracking-widest block">
                Visual Artifact
              </label>
              <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm bg-white">
                <img
                  src={previewUrl || 'https://via.placeholder.com/400'}
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <FiUpload className="text-white text-3xl" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] space-y-8">
              <div className="space-y-6">
                <label className="text-slate-400 text-[10px] uppercase font-black tracking-widest block">
                  Access Policy
                </label>
                <select
                  name="accessLevel"
                  value={formData.accessLevel}
                  onChange={e =>
                    setFormData({ ...formData, accessLevel: e.target.value })
                  }
                  disabled={!isPremiumUser}
                  className="w-full bg-white border border-slate-100 p-5 rounded-2xl outline-none font-bold"
                >
                  <option value="Free">Public (Free)</option>
                  <option value="Premium">Premium ⭐</option>
                </select>
              </div>
              <div className="space-y-6">
                <label className="text-slate-400 text-[10px] uppercase font-black tracking-widest block">
                  Visibility
                </label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={e =>
                    setFormData({ ...formData, visibility: e.target.value })
                  }
                  className="w-full bg-white border border-slate-100 p-5 rounded-2xl outline-none font-bold"
                >
                  <option value="Public">Public Archive</option>
                  <option value="Private">Private Vault</option>
                </select>
              </div>
            </div>

            <button
              disabled={updating}
              type="submit"
              className="w-full h-20 rounded-[2rem] bg-indigo-600 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
            >
              {updating ? (
                'Refining...'
              ) : (
                <>
                  <FiSave size={18} /> Update Archive
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
