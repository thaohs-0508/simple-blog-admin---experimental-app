'use client';

import { DictType } from '@/app/lib/type/dictType';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface UserProfileProps {
  locale: string;
  dict: DictType;
}

export default function UserProfile({ locale, dict }: UserProfileProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dictProfile = dict.useProfile!;
  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
      });
      toast.success(dictProfile.logoutSuccess!);
      router.push(`/${locale}/auth/login`);
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="relative">
      {/* User Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-gray-900">
            {session.user.name || 'User'}
          </span>
          <span className="text-xs text-gray-500">{session.user.email}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
          {session.user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {session.user.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session.user.email}
            </p>
          </div>

          <div className="px-4 py-2">
            {session.user.role && (
              <div className="mb-2">
                <p className="text-xs text-gray-600">{dictProfile.role}</p>
                <p className="text-sm font-medium text-blue-600 capitalize">
                  {session.user.role}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-200"
          >
            {dictProfile.logout}
          </button>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
