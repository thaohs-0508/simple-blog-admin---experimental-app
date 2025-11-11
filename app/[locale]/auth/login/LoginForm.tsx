'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DictType } from '@/app/lib/type/dictType';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface LoginFormProps {
  dictionary: DictType;
  locale: 'en' | 'vi';
}

export default function LoginForm({ dictionary, locale }: LoginFormProps) {
  const router = useRouter();
  const loginDict = dictionary.auth?.login;
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [emailError, setEmailError] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPwdError('');
    setIsLoading(true);

    if (!validateEmail(email)) {
      setEmailError(loginDict?.email_invalid!);
      setIsLoading(false);
      return;
    }

    if (!pwd || pwd.length < 6) {
      setPwdError(loginDict?.password_invalid!);
      setIsLoading(false);
      return;
    }

    try {
      const credentials = {
        redirect: false,
        email,
        credential: pwd,
      };

      const result = await signIn('credentials', credentials as any);

      if (result?.error) {
        toast.error(loginDict?.invalidCredentials!);
      } else if (result?.ok) {
        toast.success(loginDict?.login_successful!);
        router.refresh();
        router.push(`/${locale}/dashboard/posts`);
      }
    } catch {
      toast.error(loginDict?.invalidCredentials!);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {loginDict?.title}
        </h1>
        <p className="text-gray-600">{loginDict?.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {loginDict?.email}
          </label>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            placeholder="Email"
            required
            disabled={isLoading}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {emailError && <p className="text-red-600 text-sm">{emailError}</p>}

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {loginDict?.password}
          </label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
              setPwdError('');
            }}
            placeholder="Password"
            required
            disabled={isLoading}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {pwdError && <p className="text-red-600 text-sm">{pwdError}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          {isLoading ? loginDict?.signingIn : loginDict?.signIn}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          {loginDict?.noAccount}{' '}
          <Link
            href={`/${locale}/auth/register`}
            className="text-blue-600 font-medium"
          >
            {loginDict?.register}
          </Link>
        </p>
      </div>
    </div>
  );
}
