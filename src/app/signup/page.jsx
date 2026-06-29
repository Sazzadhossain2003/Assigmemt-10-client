'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { authClient } from '@/lib/auth-client';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@heroui/react';

const RegisterPage = () => {
  const router = useRouter();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegisterFunc = async data => {
    setIsLoading(true);
    const { name, email, password, image } = data;

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      image,
      role: 'user',
      plan: 'free',
    });

    if (error) {
      toast.error(error.message || 'Registration failed!');
      setIsLoading(false);
    } else {
      toast.success('Archivist account created! Redirecting...');
      setTimeout(() => {
        router.push('/signin');
      }, 1500);
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      <Toaster position="top-center" />

      {/* Background soft glow decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-50 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-50 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="bg-white border border-slate-100 p-10 md:p-12 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(99,102,241,0.1)] w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <span className="font-black text-xl">D</span>
            </div>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
            Join the <span className="text-indigo-600">Archive</span>
          </h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">
            Registry 001 :: Sign Up
          </p>
        </div>

        <form onSubmit={handleSubmit(handleRegisterFunc)} className="space-y-5">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
              Full Name
            </label>
            <input
              type="text"
              className={`w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-2xl p-4 outline-none focus:border-indigo-600/30 transition-all font-bold ${errors.name ? 'border-rose-500' : ''}`}
              placeholder="e.g. John Doe"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="text-rose-500 text-[10px] font-bold ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
              Registry Email
            </label>
            <input
              type="email"
              className={`w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-2xl p-4 outline-none focus:border-indigo-600/30 transition-all font-bold ${errors.email ? 'border-rose-500' : ''}`}
              placeholder="email@example.com"
              {...register('email', { required: 'Email field is required' })}
            />
            {errors.email && (
              <p className="text-rose-500 text-[10px] font-bold ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2 relative">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
              Secure Password
            </label>
            <div className="relative">
              <input
                type={isShowPassword ? 'text' : 'password'}
                className={`w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-2xl p-4 pr-12 outline-none focus:border-indigo-600/30 transition-all font-bold ${errors.password ? 'border-rose-500' : ''}`}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-indigo-600 transition-colors"
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                {isShowPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </span>
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
            className="w-full h-14 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all mt-4 border-none"
          >
            Create Archivist Account
          </Button>
        </form>

        <div className="flex items-center my-8">
          <div className="flex-grow h-[1px] bg-slate-100"></div>
          <span className="mx-4 text-slate-400 text-[10px] font-black">
            OR CONTINUE WITH
          </span>
          <div className="flex-grow h-[1px] bg-slate-100"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full h-14 font-black text-[11px] uppercase tracking-widest flex justify-center items-center gap-3 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-2xl transition-all shadow-sm"
        >
          <FcGoogle size={22} />
          Sign Up with Google
        </button>

        <p className="mt-10 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Already a member?{' '}
          <Link
            href="/signin"
            className="text-indigo-600 hover:text-indigo-700 transition-colors underline decoration-2 underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
