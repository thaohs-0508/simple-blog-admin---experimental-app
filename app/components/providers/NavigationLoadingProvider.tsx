'use client';

import { useTransition } from 'react';
import Loading from '../common/Loading';

/**
 * NavigationLoadingProvider
 *
 * Hiển thị loading overlay khi navigation đang pending
 * Sử dụng useTransition hook để track async operations
 *
 * CÁCH HOẠT ĐỘNG:
 * - Provider sử dụng useTransition() để track async ops
 * - Child components dùng useNavigationLoading hook
 * - Khi hook gọi startTransition → provider nhận ra
 * - isPending = true → show loading overlay
 */
export default function NavigationLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPending] = useTransition();

  return (
    <>
      {/* Loading Overlay */}
      {isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <Loading size="lg" text="Loading..." overlay={false} />
          </div>
        </div>
      )}
      {children}
    </>
  );
}
