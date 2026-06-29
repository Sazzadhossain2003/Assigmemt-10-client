'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaLink, FaUser } from 'react-icons/fa';
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
      image: image || '', // image ডাটা পাঠানো হচ্ছে
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

      {/* Decorative background glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-100/50 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/50 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="bg-white border border-slate-200/60 p-8 md:p-10 rounded-[2rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] w-full max-w-md relative z-10 transition-all hover:shadow-indigo-500/5">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
            <FaUser className="text-white text-xl" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Create <span className="text-indigo-600">Account</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
            System Registry :: Sign Up
          </p>
        </div>

        <form onSubmit={handleSubmit(handleRegisterFunc)} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">
              Full Name
            </label>
            <input
              type="text"
              className={`w-full bg-slate-50 border border-slate-200 text-slate-900 py-3.5 px-4 rounded-xl focus:bg-white focus:border-indigo-500 transition-all font-bold outline-none ${errors.name ? 'border-rose-500' : ''}`}
              placeholder="e.g. John Doe"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="text-rose-500 text-[10px] font-bold ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Photo URL Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">
              Avatar Image URL
            </label>
            <div className="relative">
              <input
                type="url"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 py-3.5 pl-4 pr-10 rounded-xl focus:bg-white focus:border-indigo-500 transition-all font-bold outline-none"
                placeholder="https://example.com/image.jpg"
                {...register('image')}
              />
              <FaLink
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={14}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">
              Registry Email
            </label>
            <input
              type="email"
              className={`w-full bg-slate-50 border border-slate-200 text-slate-900 py-3.5 px-4 rounded-xl focus:bg-white focus:border-indigo-500 transition-all font-bold outline-none ${errors.email ? 'border-rose-500' : ''}`}
              placeholder="email@example.com"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && (
              <p className="text-rose-500 text-[10px] font-bold ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">
              Security Password
            </label>
            <div className="relative">
              <input
                type={isShowPassword ? 'text' : 'password'}
                className={`w-full bg-slate-50 border border-slate-200 text-slate-900 py-3.5 pl-4 pr-12 rounded-xl focus:bg-white focus:border-indigo-500 transition-all font-bold outline-none ${errors.password ? 'border-rose-500' : ''}`}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Min 6 characters required' },
                })}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                {isShowPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
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
            Authorize Registration
          </Button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-[1px] bg-slate-100"></div>
          <span className="mx-4 text-slate-300 text-[9px] font-black tracking-tighter">
            OR
          </span>
          <div className="flex-grow h-[1px] bg-slate-100"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full h-12 font-bold text-xs flex justify-center items-center gap-3 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl transition-all"
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>

        <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          Already Registered?{' '}
          <Link
            href="/signin"
            className="text-indigo-600 hover:text-indigo-700 underline decoration-2 underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
