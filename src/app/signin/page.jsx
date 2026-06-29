import LoginForm from '@/components/LoginForm';
import React, { Suspense } from 'react';

const LogInPage = () => {
  return (
    <div className="min-h-screen bg-white flex justify-center items-center p-6 relative overflow-hidden">
      {/* Background Decor to match the rest of the site */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50/50 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <div className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">
              Accessing Wisdom Vault...
            </div>
          </div>
        }
      >
        <div className="w-full flex justify-center relative z-10">
          <LoginForm />
        </div>
      </Suspense>
    </div>
  );
};

export default LogInPage;
