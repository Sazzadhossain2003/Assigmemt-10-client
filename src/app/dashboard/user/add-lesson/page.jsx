'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaCheckCircle, FaTags } from 'react-icons/fa';
import { MdCloudUpload } from 'react-icons/md';
import { IoClose, IoAdd } from 'react-icons/io5';
import { HiOutlineLightBulb } from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/reusableApi';
import Link from 'next/link';

export default function AddLessonPage() {
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [emotionalTone, setEmotionalTone] = useState('');
  const [accessLevel, setAccessLevel] = useState('Free');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(['Personal Growth']);
  const [newTag, setNewTag] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [myLessonCount, setMyLessonCount] = useState(0);
  const fileInputRef = useRef(null);

  const user = session?.user;
  const isPremiumUser = user?.plan === 'premium';
  const freeLimit = 5;
  const isLimitReached =
    !isPremiumUser && myLessonCount >= freeLimit && user?.role !== 'admin';

  useEffect(() => {
    if (user?.id) {
      const getCount = async () => {
        try {
          const data = await api.get(`/author-profile/${user.id}`);
          setMyLessonCount(data.totalLessons);
        } catch (err) {
          console.error(err.message);
        }
      };
      getCount();
    }
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading && !session) router.replace('/signin');
  }, [session, authLoading, router]);

  if (authLoading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-bold text-indigo-600 animate-pulse uppercase tracking-widest">
        Syncing Wisdom Vault...
      </div>
    );

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = tag => setTags(tags.filter(t => t !== tag));

  const handleSubmit = async e => {
    e.preventDefault();
    if (isLimitReached) {
      toast.error('Archive limit reached!');
      return;
    }
    if (!category || !emotionalTone) {
      toast.error('Category/Tone required!');
      return;
    }

    setIsPublishing(true);
    const processToast = toast.loading('Archiving wisdom...');

    try {
      let finalImageUrl =
        'https://placehold.co/600x400/f8fafc/6366f1?text=NO+VISUAL';
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        const imgRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          { method: 'POST', body: formData },
        );
        const imgData = await imgRes.json();
        if (imgData.success) finalImageUrl = imgData.data.url;
      }

      await api.post('/lessons', {
        title,
        category,
        emotionalTone,
        accessLevel,
        description,
        tags,
        image: finalImageUrl,
        visibility: 'Public',
        author: {
          userId: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      });
      toast.success('Successfully archived!', { id: processToast });
      router.push('/dashboard/user/my-lessons');
    } catch (error) {
      toast.error(error.message, { id: processToast });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-600 p-6 lg:p-12">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              Preserve Your <span className="text-indigo-600">Wisdom</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-4 font-black uppercase tracking-[0.4em]">
              Registry Interface :: Syncing
            </p>
          </div>
          <div
            className={`px-6 py-2.5 rounded-full border font-black uppercase text-[10px] tracking-widest flex items-center gap-3 ${isPremiumUser ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
          >
            {isPremiumUser ? (
              <>
                <FaCrown /> Premium Member
              </>
            ) : (
              'Standard Member'
            )}
          </div>
        </div>

        {/* Capacity Meter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm"
        >
          <div className="flex items-center gap-6">
            <div
              className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${isPremiumUser ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white text-indigo-600 shadow-sm'}`}
            >
              {isPremiumUser ? (
                <FaCrown size={32} />
              ) : (
                <HiOutlineLightBulb size={32} />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {isPremiumUser ? 'Unlimited Archive' : 'Storage Level'}
              </h3>
              <p className="text-[11px] text-indigo-600 font-black uppercase tracking-widest mt-1">
                {isPremiumUser
                  ? 'Active Account'
                  : `${freeLimit - myLessonCount} free slots left`}
              </p>
            </div>
          </div>
          {!isPremiumUser && user?.role !== 'admin' && (
            <div className="w-full md:w-80 bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex justify-between mb-3 text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Storage Density</span>
                <span className="text-indigo-600">
                  {Math.round((myLessonCount / freeLimit) * 100)}%
                </span>
              </div>
              <div className="flex gap-2 h-2.5">
                {[...Array(freeLimit)].map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full flex-1 transition-all duration-700 ${i < myLessonCount ? 'bg-indigo-600' : 'bg-slate-100'}`}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          {/* Form Fields */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-slate-50 border border-slate-100 p-8 md:p-12 rounded-[3rem] space-y-10 shadow-sm">
              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] uppercase font-black tracking-widest ml-1">
                  Lesson title
                </label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Title your insight..."
                  className="w-full bg-white border border-slate-100 p-6 rounded-2xl outline-none focus:border-indigo-600/30 text-slate-900 text-xl font-bold shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-slate-400 text-[10px] uppercase font-black tracking-widest ml-1">
                    Category
                  </label>
                  <select
                    required
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-white border border-slate-100 p-5 rounded-2xl outline-none text-slate-600 font-bold cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    <option value="Personal Growth">Personal Growth</option>
                    <option value="Career">Career</option>
                    <option value="Mistakes Learned">Mistakes Learned</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-slate-400 text-[10px] uppercase font-black tracking-widest ml-1">
                    Emotional Tone
                  </label>
                  <select
                    required
                    value={emotionalTone}
                    onChange={e => setEmotionalTone(e.target.value)}
                    className="w-full bg-white border border-slate-100 p-5 rounded-2xl outline-none text-slate-600 font-bold cursor-pointer"
                  >
                    <option value="">Select Tone</option>
                    <option value="Motivational">Motivational</option>
                    <option value="Realization">Realization</option>
                  </select>
                </div>
              </div>

              <div className="p-8 bg-white rounded-[2rem] border border-slate-100 space-y-6">
                <label className="text-slate-400 text-[10px] uppercase font-black tracking-widest block">
                  Access Policy
                </label>
                <div className="flex flex-wrap gap-10">
                  {['Free', 'Premium'].map(level => {
                    const disabled = level === 'Premium' && !isPremiumUser;
                    return (
                      <label
                        key={level}
                        className={`flex items-center gap-4 cursor-pointer transition-all ${disabled ? 'opacity-30 grayscale' : 'hover:scale-105'}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${accessLevel === level ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'}`}
                        >
                          {accessLevel === level && (
                            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />
                          )}
                        </div>
                        <input
                          type="radio"
                          className="hidden"
                          checked={accessLevel === level}
                          onChange={() => !disabled && setAccessLevel(level)}
                        />
                        <span
                          className={`text-[11px] font-black uppercase tracking-widest ${accessLevel === level ? 'text-indigo-600' : 'text-slate-400'}`}
                        >
                          {level}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-slate-400 text-[10px] uppercase font-black tracking-widest ml-1">
                  Deep Insight
                </label>
                <textarea
                  required
                  rows={10}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Share your story..."
                  className="w-full bg-white border border-slate-100 p-8 rounded-[2.5rem] outline-none text-lg leading-relaxed font-medium text-slate-600 shadow-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-10">
            <div
              onClick={() => !previewUrl && fileInputRef.current.click()}
              className={`bg-slate-50 border-2 border-dashed rounded-[3rem] h-[380px] flex flex-col items-center justify-center transition-all overflow-hidden relative group ${previewUrl ? 'border-indigo-200' : 'border-slate-200 hover:border-indigo-300 cursor-pointer'}`}
            >
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setPreviewUrl('');
                      }}
                      className="bg-rose-500 text-white p-4 rounded-full"
                    >
                      <IoClose size={24} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-10">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm text-indigo-600">
                    <MdCloudUpload size={32} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Attach Visual Artifact
                  </p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={e => {
                  const f = e.target.files[0];
                  if (f) {
                    setSelectedFile(f);
                    setPreviewUrl(URL.createObjectURL(f));
                  }
                }}
              />
            </div>

            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
              <label className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest">
                <FaTags className="text-indigo-600" /> Wisdom Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-8">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-2 bg-white border border-slate-100 pl-4 pr-2 py-2 rounded-xl text-[10px] text-indigo-600 font-black uppercase tracking-widest"
                  >
                    {tag}{' '}
                    <IoClose
                      className="cursor-pointer hover:text-rose-500"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyPress={e =>
                    e.key === 'Enter' && (e.preventDefault(), handleAddTag())
                  }
                  placeholder="New tag..."
                  className="flex-1 bg-white border border-slate-100 px-5 py-4 rounded-xl text-xs outline-none font-bold"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-indigo-600 p-4 rounded-xl text-white hover:bg-indigo-700 shadow-sm"
                >
                  <IoAdd size={22} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {isLimitReached ? (
                <Link
                  href="/pricing"
                  className="w-full h-20 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center gap-4 font-black uppercase tracking-widest text-[11px] shadow-xl"
                >
                  <FaCrown className="text-indigo-400 animate-bounce" /> Upgrade
                  Archive
                </Link>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isPublishing}
                  className="w-full h-20 rounded-[1.5rem] bg-indigo-600 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isPublishing ? (
                    'Synchronizing...'
                  ) : (
                    <>
                      <FaCheckCircle size={18} /> Archive Wisdom
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
