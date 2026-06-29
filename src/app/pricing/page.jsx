'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Minus, Crown, Star, ArrowRight } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function PricingPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isPremiumUser = user?.plan === 'premium';

  if (isPending)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-bold text-indigo-600 animate-pulse uppercase tracking-widest">
        Syncing Pricing Matrix...
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-slate-600 pb-32">
      {/* Hero Section */}
      <div className="pt-24 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-40 pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-50 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-50 blur-[120px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-indigo-100 mb-6 inline-block">
            Investment Portal
          </span>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-6">
            Elevate Your <span className="text-indigo-600">Wisdom</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Choose the plan that best fits your journey of self-reflection and
            community sharing.
          </p>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 mb-32">
        {/* Free Card */}
        <motion.div
          whileHover={{ y: -10 }}
          className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 md:p-12 flex flex-col justify-between shadow-sm"
        >
          <div>
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                  Standard Archive
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">
                    ৳০
                  </span>
                  <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                    / Lifetime
                  </span>
                </div>
              </div>
              <span className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-[10px] font-black text-slate-400 tracking-widest">
                DEFAULT
              </span>
            </div>
            <ul className="space-y-5 mb-12">
              {[
                'Create up to 5 lessons',
                'Access all Free wisdom',
                'Personal Dashboard',
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 text-slate-600 font-bold text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Check size={14} className="text-slate-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <button
            disabled
            className="w-full py-5 rounded-2xl border-2 border-slate-200 text-slate-400 text-xs font-black uppercase tracking-widest"
          >
            {isPremiumUser ? 'Standard tier' : 'Current Active Plan'}
          </button>
        </motion.div>

        {/* Premium Card */}
        <motion.div
          whileHover={{ y: -10 }}
          className="bg-white border-2 border-indigo-600 rounded-[2.5rem] p-10 md:p-12 flex flex-col justify-between shadow-[0_40px_80px_-15px_rgba(99,102,241,0.15)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black px-6 py-2 rounded-bl-[1.5rem] uppercase tracking-[0.2em]">
            Best Value
          </div>
          <div>
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-2xl font-black text-indigo-600 mb-2 tracking-tight flex items-center gap-2">
                  Premium Archive <Star size={20} className="fill-indigo-600" />
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">
                    ৳১৫০০
                  </span>
                  <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                    / One-time
                  </span>
                </div>
              </div>
              <Crown className="text-indigo-600" size={32} />
            </div>
            <ul className="space-y-5 mb-12">
              {[
                'Unlimited lesson creation',
                'Premium locked content',
                'Community Golden Badge',
                'Full access to all Archives',
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 text-slate-800 font-black text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center shadow-sm">
                    <Check size={14} className="text-indigo-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <form action="/api/checkout_sessions" method="POST">
            <button
              type="submit"
              disabled={isPremiumUser}
              className="w-full py-5 rounded-[1.5rem] bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isPremiumUser ? 'Already Premium ⭐' : 'Upgrade to Premium Now'}{' '}
              <ArrowRight size={16} />
            </button>
          </form>
        </motion.div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-5xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Feature Comparison
          </h2>
          <div className="w-12 h-1 bg-indigo-600 mx-auto mt-4 rounded-full" />
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100/50">
                <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  Capability
                </th>
                <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">
                  Standard
                </th>
                <th className="p-8 text-[11px] font-black text-indigo-600 uppercase tracking-widest text-center">
                  Premium
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { f: 'Lesson Limit', s: '5 Units', p: 'Infinity' },
                { f: 'Lock Insights', s: false, p: true },
                { f: 'Golden Badge', s: false, p: true },
                { f: 'Advanced PDF', s: false, p: true },
              ].map((row, i) => (
                <tr
                  key={i}
                  className="border-t border-slate-100 hover:bg-white transition-colors"
                >
                  <td className="p-8 text-slate-700 font-bold text-sm">
                    {row.f}
                  </td>
                  <td className="p-8 text-center">
                    {typeof row.s === 'string' ? (
                      <span className="text-xs font-black text-slate-400">
                        {row.s}
                      </span>
                    ) : (
                      <Minus className="mx-auto opacity-20" size={16} />
                    )}
                  </td>
                  <td className="p-8 text-center">
                    {row.p === true ? (
                      <Check className="mx-auto text-indigo-600" size={20} />
                    ) : (
                      <span className="text-indigo-600 font-black text-xs uppercase">
                        {row.p}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
