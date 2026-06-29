'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'danger',
}) => {
  if (!isOpen) return null;
  const isPromote = type === 'promote';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[999] p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white border border-slate-100 p-10 rounded-[3rem] w-full max-w-md text-center shadow-2xl shadow-indigo-500/10"
        >
          <div
            className={`w-20 h-20 mx-auto mb-6 rounded-[1.5rem] flex items-center justify-center ${isPromote ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'}`}
          >
            <FiAlertTriangle size={36} />
          </div>

          <h3 className="text-slate-900 font-black text-2xl mb-3 tracking-tighter">
            {title}
          </h3>
          <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed px-4">
            {message}
          </p>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 text-[11px] font-black uppercase tracking-widest bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg ${
                isPromote
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                  : 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200'
              }`}
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;
