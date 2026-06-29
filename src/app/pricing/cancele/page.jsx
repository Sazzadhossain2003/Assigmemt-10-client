import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCcw, AlertTriangle } from 'lucide-react';

export default function CancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50/50 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-100 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-md w-full bg-white border border-slate-200/60 rounded-[2.5rem] p-10 text-center shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] relative z-10">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
              <XCircle className="w-14 h-14 text-rose-500" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight leading-none">
          Process <span className="text-rose-500">Terminated</span>
        </h1>
        <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 px-4">
          The authentication session was cancelled. No changes have been applied
          to your Registry Account.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/pricing"
            className="w-full h-14 bg-indigo-600 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-[0.98]"
          >
            <RefreshCcw size={16} /> Re-initiate Payment
          </Link>

          <Link
            href="/"
            className="w-full h-14 bg-white border border-slate-200 text-slate-600 font-black uppercase text-[11px] tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all border-b-4 active:border-b-0 active:translate-y-1"
          >
            <ArrowLeft size={16} /> Return to Library
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-50">
          <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.5em]">
            Status: Security Abort :: Code 402
          </p>
        </div>
      </div>
    </main>
  );
}
