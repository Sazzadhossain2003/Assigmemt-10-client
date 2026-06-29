'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
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
      toast.success('Access Granted! Redirecting...');
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
    <div className="bg-white border border-slate-100 p-10 md:p-12 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(99,102,241,0.1)] w-full max-w-md transition-all duration-500">
      <Toaster position="top-center" />

      <header className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
            <span className="font-black text-2xl">D</span>
          </div>
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
          Welcome <span className="text-indigo-600">Back</span>
        </h2>
        <p className="text-slate-400 text-[10px] mt-2 uppercase tracking-[0.4em] font-black">
          Registry Interface :: Authenticate
        </p>
      </header>

      <form className="space-y-6" onSubmit={handleSubmit(handleLoginFunc)}>
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
            Registry Email
          </label>
          <input
            type="email"
            className={`w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 py-4 px-5 rounded-2xl focus:border-indigo-600/30 outline-none transition-all font-bold ${errors.email ? 'border-rose-500' : ''}`}
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
              className={`w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 py-4 pl-5 pr-12 rounded-2xl focus:border-indigo-600/30 outline-none transition-all font-bold ${errors.password ? 'border-rose-500' : ''}`}
              placeholder="••••••••"
              {...register('password', {
                required: 'Password field is required',
              })}
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-indigo-600 transition-colors"
              onClick={() => setIsShowPassword(!isShowPassword)}
            >
              {isShowPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
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
          Sign In to Vault
        </Button>
      </form>

      <div className="flex items-center my-10 w-full px-2">
        <div className="flex-grow h-[1px] bg-slate-100"></div>
        <span className="mx-4 text-slate-400 text-[10px] font-black tracking-widest uppercase shrink-0">
          OR
        </span>
        <div className="flex-grow h-[1px] bg-slate-100"></div>
      </div>

      <Button
        variant="bordered"
        onPress={handleGoogleSignIn}
        className="w-full h-14 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 shadow-sm"
      >
        <FcGoogle size={22} /> Continue with Google
      </Button>

      <footer className="mt-10 text-center">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          New Archivist?{' '}
          <Link
            href="/signup"
            className="text-indigo-600 hover:text-indigo-700 transition-colors underline decoration-2 underline-offset-8"
          >
            Create Account
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default LoginForm;
