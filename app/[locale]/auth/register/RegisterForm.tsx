'use client';

import { FormEvent, useActionState, useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DictType } from '@/app/lib/type/dictType';
import { registerState } from '@/app/lib/type/actionType';
import { registerAction } from '@/app/actions/auth/registerAction';
import toast from 'react-hot-toast';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';

interface RegisterFormProps {
  dictionary: DictType;
  locale: 'en' | 'vi';
}

export default function RegisterForm({
  dictionary,
  locale,
}: RegisterFormProps) {
  const registerDict = dictionary.auth?.register!;

  const initialState: registerState = {
    errors: {
      name: [],
      email: [],
      password: [],
      confirmPassword: [],
    },
    message: '',
  };

  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState
  );

  const { push } = useNavigationLoading();

  useEffect(() => {
    if (
      !state.message &&
      (!state.errors || Object.keys(state.errors).length === 0)
    ) {
      toast.success(registerDict?.successful_registration!);
      push(`/${locale}/dashboard/posts`);
    }
    if (state.message && state.errors && Object.keys(state.errors).length > 0) {
      if (state.errors.name?.length) {
        toast.error(registerDict?.name_too_short ?? state.errors.name[0]);
      }
      if (state.errors.email?.length) {
        toast.error(registerDict?.email_invalid ?? state.errors.email[0]);
      }
      if (state.errors.password?.length) {
        toast.error(
          registerDict?.password_too_short ?? state.errors.password[0]
        );
      }
      if (state.errors.confirmPassword?.length) {
        toast.error(
          registerDict?.confirm_password_too_short ??
            state.errors.confirmPassword[0]
        );
      }
    }
    if (
      state.message &&
      (!state.errors || Object.keys(state.errors).length === 0)
    ) {
      toast.error(registerDict?.server_error ?? state.message);
    }
  }, [state, push, locale, registerDict]);

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {registerDict.title}
        </h1>
        <p className="text-gray-600">{registerDict.subtitle}</p>
      </div>

      {/* Register Form */}
      <form action={formAction} className="space-y-4">
        {/* Full Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {registerDict.fullName}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
            disabled={isPending}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
          />
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {registerDict.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="user@example.com"
            required
            disabled={isPending}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
          />
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {registerDict.password}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            disabled={isPending}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
          />
        </div>

        {/* Confirm Password Input */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {registerDict.confirmPassword}
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            disabled={isPending}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
          />
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          {isPending ? registerDict.signingUp : registerDict.signUp}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          {registerDict.haveAccount}{' '}
          <Link
            href={`/${locale}/auth/login`}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {registerDict.login}
          </Link>
        </p>
      </div>
    </div>
  );
}
