'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { DictType } from '@/app/lib/type/dictType';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  dictionary: DictType;
  locale: 'en' | 'vi';
}

export default function LoginForm({ dictionary, locale }: LoginFormProps) {
  const loginDict = dictionary.auth?.login;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      });

      if (result?.error) {
        toast.error(loginDict?.invalidCredentials!);
        setError(loginDict?.invalidCredentials!);
      } else if (result?.ok) {
        toast.success(loginDict?.login_successful!);
        router.push(`/${locale}/dashboard/posts`);
        router.refresh();
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      toast.error(loginDict?.invalidCredentials!);
      setError(loginDict?.invalidCredentials!);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {loginDict?.title}
        </h1>
        <p className="text-gray-600">{loginDict?.subtitle}</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {loginDict?.email}
          </label>
          <input
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
          />
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {loginDict?.password}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
          />
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          {isLoading ? loginDict?.signingIn : loginDict?.signIn}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
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

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          {loginDict?.noAccount}{' '}
          <Link
            href={`/${locale}/auth/register`}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {loginDict?.register}
          </Link>
        </p>
      </div>
    </div>
  );
}
