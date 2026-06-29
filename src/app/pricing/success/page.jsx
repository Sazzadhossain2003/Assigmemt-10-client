import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/reusableApi';
import { getUserToken } from '@/lib/core/session';

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;
  const token = await getUserToken();

  if (!session_id) {
    throw new Error('Please provide a valid session_id');
  }

  // Stripe data retrieval
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  });

  const { status, customer_details } = session;
  const customerEmail = customer_details?.email;

  if (status === 'open') {
    return redirect('/');
  }

  if (status === 'complete') {
    // Logic: Plan update API
    try {
      await api.patch(
        '/users/plan-update',
        { email: customerEmail },
        { Authorization: `Bearer ${token}` },
      );
    } catch (err) {
      console.error('API Plan Update Error:', err.message);
    }

    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50/50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-md w-full bg-white border border-slate-200/60 rounded-[2.5rem] p-10 text-center shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] relative z-10">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                <CheckCircle2 className="w-14 h-14 text-emerald-600" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
            Transaction <span className="text-emerald-600">Verified</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            Registry ID: {session_id.slice(-10)}
          </p>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8 text-left">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                <Mail className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Confirmed Archivist
                </p>
                <p className="text-slate-700 font-bold text-sm truncate max-w-[200px]">
                  {customerEmail}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/dashboard/user/add-lesson"
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 group"
            >
              Access Wisdom Vault
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Premium Plan Activated
            </p>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
