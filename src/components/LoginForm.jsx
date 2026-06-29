'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@heroui/react';
import { useSearchParams } from 'next/navigation';

const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get('callbackURL') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginFunc = async data => {
    setIsLoading(true);
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: true,
      callbackURL: callbackURL,
    });

    if (error) {
      toast.error(error.message || 'Login failed!');
      setIsLoading(false);
    } else {
      toast.success('Identity Verified!');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: callbackURL,
    });
  };

  return (
    <div className="bg-white border border-slate-200/60 p-8 md:p-10 rounded-[2rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] w-full max-w-md transition-all hover:shadow-indigo-500/5">
      <Toaster position="top-center" />

      <header className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
          <FaLock className="text-white text-xl" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Welcome <span className="text-indigo-600">Back</span>
        </h2>
        <p className="text-slate-400 text-[10px] mt-2 uppercase tracking-[0.3em] font-black">
          Authentication Interface
        </p>
      </header>

      <form className="space-y-5" onSubmit={handleSubmit(handleLoginFunc)}>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">
            Access Email
          </label>
          <input
            type="email"
            className={`w-full bg-slate-50 border border-slate-200 text-slate-900 py-3.5 px-4 rounded-xl focus:bg-white focus:border-indigo-500 transition-all font-bold outline-none ${errors.email ? 'border-rose-500' : ''}`}
            placeholder="admin@registry.com"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && (
            <p className="text-rose-500 text-[10px] font-bold ml-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5 relative">
          <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">
            Secret Key
          </label>
          <div className="relative">
            <input
              type={isShowPassword ? 'text' : 'password'}
              className={`w-full bg-slate-50 border border-slate-200 text-slate-900 py-3.5 pl-4 pr-12 rounded-xl focus:bg-white focus:border-indigo-500 transition-all font-bold outline-none ${errors.password ? 'border-rose-500' : ''}`}
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
              onClick={() => setIsShowPassword(!isShowPassword)}
            >
              {isShowPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-rose-500 text-[10px] font-bold ml-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full h-12 bg-indigo-600 text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all mt-4 border-none"
        >
          Verify Identity
        </Button>
      </form>

      <div className="flex items-center my-8">
        <div className="flex-grow h-[1px] bg-slate-100"></div>
        <span className="mx-4 text-slate-300 text-[9px] font-black tracking-widest uppercase">
          OR
        </span>
        <div className="flex-grow h-[1px] bg-slate-100"></div>
      </div>

      <button
        onClick={handleGoogleSignIn}
        className="w-full h-12 font-bold text-xs flex justify-center items-center gap-3 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl transition-all"
      >
        <FcGoogle size={20} />
        Log In with Google
      </button>

      <footer className="mt-8 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          New Archivist?{' '}
          <Link
            href="/signup"
            className="text-indigo-600 hover:text-indigo-700 underline decoration-2 underline-offset-4"
          >
            Join Registry
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default LoginForm;
