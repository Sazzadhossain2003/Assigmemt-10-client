'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiHeart,
  FiBookmark,
  FiAlertTriangle,
  FiEye,
  FiShare2,
  FiUser,
  FiSend,
  FiTag,
  FiCopy,
  FiDownload,
  FiClock,
} from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import ReportModal from '@/components/ReportModal';
import { api } from '@/lib/reusableApi';
import { jsPDF } from 'jspdf';
import {
  FacebookShareButton,
  LinkedinShareButton,
  XShareButton,
  FacebookIcon,
  XIcon,
  LinkedinIcon,
} from 'react-share';

export default function PublicLessonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, isPending } = authClient.useSession();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate Content');
  const [showShareOptions, setShowShareOptions] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const currentUserId = useMemo(() => session?.user?.id || null, [session]);

  const loadImageAsBase64 = url => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.onerror = err => reject(err);
      img.src = url;
    });
  };

  const exportToPDF = async () => {
    if (!lesson) return;
    if (lesson.accessLevel === 'Premium' && session?.user?.plan !== 'premium') {
      toast.error('Upgrade to Premium to download archives!');
      return;
    }

    const loadToast = toast.loading('Syncing with PDF Engine...');
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text(lesson.title, 20, 30);
      if (lesson.image) {
        const imgData = await loadImageAsBase64(lesson.image);
        doc.addImage(imgData, 'JPEG', 20, 40, 170, 95);
      }
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(
        `Contributor: ${lesson.author?.name} | Category: ${lesson.category}`,
        20,
        150,
      );
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(lesson.description, 170);
      doc.text(splitText, 20, 165);
      doc.save(`${lesson.title.replace(/\s+/g, '_')}_Wisdom.pdf`);
      toast.success('Archived as PDF successfully!', { id: loadToast });
    } catch (error) {
      toast.error('PDF Export Failed', { id: loadToast });
    }
  };

  const readingTime = useMemo(() => {
    if (!lesson?.description) return 1;
    const words = lesson.description.split(/\s+/).length;
    return Math.ceil(words / 200);
  }, [lesson]);

  useEffect(() => {
    if (!params?.id || isPending) return;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await api.get(
          `/lessons/${params.id}?userId=${currentUserId || ''}`,
        );
        setLesson(data);
        setIsLiked(data.hasLiked);
        setIsFavorited(data.hasFavorited);
        setComments(data.comments || []);
      } catch (error) {
        toast.error('Archive not found');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [params.id, currentUserId, isPending]);

  // --- Functions for Actions ---
  const handleLike = async () => {
    if (!currentUserId) return router.push('/signin');
    try {
      const data = await api.post(`/lessons/${lesson._id}/like`, {
        userId: currentUserId,
      });
      setIsLiked(data.liked);
      setLesson(prev => ({
        ...prev,
        likesCount: data.liked
          ? prev.likesCount + 1
          : Math.max(0, prev.likesCount - 1),
      }));
    } catch (err) {
      toast.error('Sync failed');
    }
  };

  const handleFavorite = async () => {
    if (!currentUserId) return toast.error('Please login to save to favorites');
    try {
      const data = await api.post(`/lessons/${lesson._id}/favorite`, {
        userId: currentUserId,
      });
      setIsFavorited(data.favorited);
      setLesson(prev => ({
        ...prev,
        favoritesCount: data.favorited
          ? prev.favoritesCount + 1
          : Math.max(0, prev.favoritesCount - 1),
      }));
      toast.success(data.message);
    } catch (err) {
      toast.error('Save action failed');
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      const data = await api.post(`/lessons/${lesson._id}/comments`, {
        userId: currentUserId,
        userName: session.user.name,
        text: newComment,
      });
      setComments([data, ...comments]);
      setNewComment('');
      toast.success('Reflection posted');
    } catch (err) {
      toast.error('Failed to post reflection');
    }
  };

  const handleReport = async (selectedReason, details) => {
    try {
      await api.post(`/lessons/${lesson._id}/report`, {
        userId: session.user.id,
        reason: selectedReason,
        additionalDetails: details,
      });
      toast.success('Content flagged for review');
      setShowReportModal(false);
    } catch (err) {
      toast.error('Report failed');
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-indigo-600 font-black uppercase text-[10px] tracking-widest">
          Opening Archives...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-slate-600 pb-32">
      <Toaster position="bottom-right" />
      <div className="absolute top-0 left-0 w-full h-[500px] bg-slate-50 border-b border-slate-100 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/50 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <FiArrowLeft /> Return to Library
          </button>
          <button
            onClick={exportToPDF}
            className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-indigo-200 flex items-center gap-3 hover:scale-105 transition-all"
          >
            <FiDownload size={18} /> Export as PDF
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-6">
              <div className="flex gap-3">
                <span className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  {lesson.category}
                </span>
                <span className="px-5 py-2 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">
                  {lesson.emotionalTone}
                </span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-slate-900 leading-none tracking-tighter">
                {lesson.title}
              </h1>
            </div>

            <div className="rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-500/10 border border-slate-100">
              <img
                src={lesson.image}
                className="w-full aspect-video object-cover"
                alt="Banner"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50/50 p-8 rounded-[2rem] text-center border border-slate-100">
                <FiHeart className="mx-auto text-rose-500 mb-3" size={24} />
                <p className="text-2xl font-black text-slate-900 leading-none">
                  {lesson.likesCount}
                </p>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-2">
                  Impact
                </p>
              </div>
              <div className="bg-indigo-50/50 p-8 rounded-[2rem] text-center border border-indigo-100">
                <FiBookmark
                  className="mx-auto text-indigo-600 mb-3"
                  size={24}
                />
                <p className="text-2xl font-black text-slate-900 leading-none">
                  {lesson.favoritesCount}
                </p>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-2">
                  Saved
                </p>
              </div>
              <div className="bg-slate-50/50 p-8 rounded-[2rem] text-center border border-slate-100">
                <FiClock className="mx-auto text-slate-400 mb-3" size={24} />
                <p className="text-2xl font-black text-slate-900 leading-none">
                  {readingTime}m
                </p>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-2">
                  Read Time
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8 py-8 border-y border-slate-50">
              <button
                onClick={handleLike}
                className={`flex items-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all ${isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
              >
                <FiHeart className={isLiked ? 'fill-current' : ''} size={22} />{' '}
                {isLiked ? 'Impacted' : 'Give Impact'}
              </button>
              <button
                onClick={handleFavorite}
                className={`flex items-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all ${isFavorited ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}
              >
                <FiBookmark
                  className={isFavorited ? 'fill-current' : ''}
                  size={22}
                />{' '}
                {isFavorited ? 'Archived' : 'Save Archive'}
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest ml-auto"
              >
                <FiAlertTriangle /> Report
              </button>
            </div>

            <div className="prose prose-slate max-w-none text-xl leading-relaxed font-medium text-slate-600 first-letter:text-7xl first-letter:font-black first-letter:text-indigo-600 first-letter:mr-3 first-letter:float-left">
              {lesson.description}
            </div>

            {/* Comments Section */}
            <div className="mt-20 space-y-10">
              <h3 className="text-3xl font-black text-slate-900">
                Reflections
              </h3>
              {currentUserId ? (
                <div className="flex gap-4">
                  <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-6 outline-none focus:border-indigo-200 transition-all"
                    placeholder="Share your insight..."
                  />
                  <button
                    onClick={handlePostComment}
                    className="bg-indigo-600 text-white px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                  >
                    <FiSend size={18} />
                  </button>
                </div>
              ) : (
                <div className="p-8 bg-slate-50 rounded-2xl text-center text-sm font-bold text-slate-400">
                  Please login to comment
                </div>
              )}
              <div className="space-y-6">
                {comments.map((c, i) => (
                  <div
                    key={i}
                    className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100"
                  >
                    <p className="font-bold text-slate-900 mb-2">
                      {c.userName}
                    </p>
                    <p className="text-slate-600">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 sticky top-28">
              <div className="text-center mb-10">
                <div className="w-24 h-24 rounded-[1.5rem] mx-auto border-4 border-white shadow-xl overflow-hidden mb-4">
                  <img
                    src={lesson.author?.image}
                    className="w-full h-full object-cover"
                    alt="Author"
                  />
                </div>
                <h4 className="text-xl font-black text-slate-900">
                  {lesson.author?.name}
                </h4>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                  Archivist
                </span>
              </div>
              <Link
                href={`/author-profile/${lesson.author?.userId}`}
                className="block w-full py-5 bg-white border border-slate-200 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                View Contributor
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {showReportModal && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReport}
          reason={reportReason}
          setReason={setReportReason}
          lessonId={lesson._id}
        />
      )}
    </div>
  );
}
