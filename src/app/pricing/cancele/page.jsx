import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';

export default function CancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="max-w-lg w-full bg-slate-50 border border-slate-100 rounded-[3rem] p-12 text-center shadow-sm">
        <div className="flex justify-center mb-8">
          <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100">
            <XCircle className="w-16 h-16 text-rose-500" />
          </div>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter leading-none">
          Payment Aborted
        </h1>
        <p className="text-slate-500 mb-10 font-medium leading-relaxed">
          The transaction process was cancelled. No changes have been made to
          your billing account.
        </p>
        <div className="flex flex-col gap-4">
          <Link
            href="/pricing"
            className="w-full bg-indigo-600 text-white font-black uppercase text-[11px] tracking-widest py-5 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
          >
            <RefreshCcw size={18} /> Try Again
          </Link>
          <Link
            href="/"
            className="w-full bg-white border border-slate-200 text-slate-600 font-black uppercase text-[11px] tracking-widest py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
          >
            <ArrowLeft size={18} /> Back to Library
          </Link>
        </div>
        <p className="text-[9px] text-slate-300 mt-12 font-black uppercase tracking-[0.4em]">
          Digital Life Lessons :: Transaction Secure
        </p>
      </div>
    </main>
  );
}
