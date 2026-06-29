'use client';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiTrash2,
  FiEye,
  FiCheckCircle,
  FiSearch,
  FiExternalLink,
  FiClock,
  FiMail,
  FiUser,
  FiAlertTriangle,
  FiImage,
  FiX,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/reusableApi';

/**
 * Centered Confirmation Modal Component - Redesigned for Light Mode
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl border border-slate-100"
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${type === 'delete' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}
        >
          <FiAlertTriangle className="text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 hover:cursor-pointer py-3 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 hover:cursor-pointer py-3 text-xs font-bold ${type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white rounded-xl transition-all shadow-lg`}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ReportedLessonsPage = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: '',
    data: null,
  });

  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (!isPending && !session) router.replace('/signin');
  }, [session, isPending, router]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await api.get('/admin/reported-lessons');
      setReports(data);
    } catch (err) {
      toast.error(err.message || 'System synchronization failed');
    } finally {
      setLoading(false);
    }
  };

  const handleIgnore = async lessonId => {
    setConfirmModal({ isOpen: false });
    try {
      setActionLoading(lessonId);
      await api.delete(`/admin/reports/ignore/${lessonId}`);
      toast.success('Flags cleared successfully');
      fetchReports();
    } catch (err) {
      toast.error(err.message || 'Failed to clear reports');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteLesson = async lessonId => {
    setConfirmModal({ isOpen: false });
    try {
      setActionLoading(lessonId);
      await api.delete(`/admin/lessons/${lessonId}`);
      toast.success('Lesson purged completely');
      fetchReports();
      setSelectedReport(null);
    } catch (err) {
      toast.error(err.message || 'Purge sequence failed');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredReports = reports.filter(group =>
    group.lessonTitle?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-bold text-xs tracking-widest uppercase">
          Syncing Moderation Logs...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-600 p-4 md:p-12 relative">
      <Toaster position="top-center" />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={() =>
          confirmModal.type === 'delete'
            ? handleDeleteLesson(confirmModal.data._id)
            : handleIgnore(confirmModal.data._id)
        }
        type={confirmModal.type}
        title={
          confirmModal.type === 'delete' ? 'Purge Lesson?' : 'Dismiss Reports?'
        }
        message={
          confirmModal.type === 'delete'
            ? 'Are you sure you want to PERMANENTLY delete this lesson? This action cannot be undone.'
            : 'This will clear all current report flags while keeping the lesson available to the public.'
        }
      />

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Reported <span className="text-indigo-600">Flags</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Review and moderate content flagged by the community.
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by lesson title..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle size={40} />
            </div>
            <p className="text-slate-500 font-bold text-lg">
              Platform is clear!
            </p>
            <p className="text-slate-400 text-sm mt-1">
              No reported lessons found at this time.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                  <th className="py-5 px-8">Content Info</th>
                  <th className="py-5 px-6">Severity</th>
                  <th className="py-5 px-6">Last Reported</th>
                  <th className="py-5 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map(group => (
                  <tr
                    key={group._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                          {group.lessonImage ? (
                            <img
                              src={group.lessonImage}
                              className="w-full h-full object-cover"
                              alt="preview"
                            />
                          ) : (
                            <FiImage className="text-slate-300 text-xl" />
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/public-lessons/${group._id}`}
                            className="font-bold text-slate-800 hover:text-indigo-600 flex items-center gap-1 text-sm transition-colors"
                          >
                            {group.lessonTitle}
                            <FiExternalLink
                              size={12}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          </Link>
                          <p className="text-[11px] text-slate-400 font-medium">
                            ID: {group._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[10px] font-bold border border-rose-100">
                        {group.reportCount} Reports
                      </span>
                    </td>
                    <td className="py-6 px-6 text-xs text-slate-500 font-medium">
                      {new Date(group.lastReportedAt).toLocaleDateString(
                        undefined,
                        { dateStyle: 'medium' },
                      )}
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedReport(group)}
                          title="Investigate"
                          className="p-2.5 bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white hover:cursor-pointer rounded-xl transition-all"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          disabled={actionLoading === group._id}
                          onClick={() =>
                            setConfirmModal({
                              isOpen: true,
                              type: 'ignore',
                              data: group,
                            })
                          }
                          className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white disabled:opacity-30 hover:cursor-pointer transition-all"
                        >
                          {actionLoading === group._id ? (
                            <span className="animate-spin block h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                          ) : (
                            <FiCheckCircle size={16} />
                          )}
                        </button>
                        <button
                          disabled={actionLoading === group._id}
                          onClick={() =>
                            setConfirmModal({
                              isOpen: true,
                              type: 'delete',
                              data: group,
                            })
                          }
                          className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white disabled:opacity-30 hover:cursor-pointer transition-all"
                        >
                          {actionLoading === group._id ? (
                            <span className="animate-spin block h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                          ) : (
                            <FiTrash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Investigation Details Modal - Redesigned */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl z-[105]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
                <h3 className="text-lg font-bold text-slate-900">
                  Case Investigation
                </h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <FiX />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto bg-slate-50/30">
                {/* Header Info */}
                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden">
                    {selectedReport.lessonImage && (
                      <img
                        src={selectedReport.lessonImage}
                        className="w-full h-full object-cover"
                        alt="lesson"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 leading-tight">
                      {selectedReport.lessonTitle}
                    </h3>
                    <p className="text-xs text-rose-500 font-bold mt-1 uppercase tracking-wider">
                      {selectedReport.reportCount} Pending Violations
                    </p>
                  </div>
                </div>

                {/* Reporter cards */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">
                    Detailed Log Reports
                  </p>
                  {selectedReport.allReports.map((report, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-1 rounded uppercase">
                          {report.reason}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          <FiClock className="inline mr-1" />
                          {new Date(report.timestamp).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {report.reporterInfo?.name ? (
                            report.reporterInfo.name.charAt(0)
                          ) : (
                            <FiUser />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {report.reporterInfo?.name ||
                              report.reporterName ||
                              'Anonymous'}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                            <FiMail className="inline shrink-0" size={10} />
                            {report.reporterInfo?.email ||
                              report.reporterEmail ||
                              'No contact info'}
                          </p>
                        </div>
                      </div>

                      <div className="px-1">
                        <p className="text-sm text-slate-600 italic leading-relaxed">
                          "
                          {report.additionalDetails ||
                            'No additional context provided by reporter.'}
                          "
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-white border-t border-slate-100">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="w-full py-3.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all shadow-lg"
                >
                  Close Log
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportedLessonsPage;
