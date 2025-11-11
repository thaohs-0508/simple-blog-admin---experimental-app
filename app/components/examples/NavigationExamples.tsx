import Link from 'next/link';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';

/**
 * ❌ BAD: Chậm, không có loading feedback
 */
export function BadLinkExample() {
  return <Link href="/dashboard/posts">Go to Posts</Link>;
}

/**
 * ✅ GOOD: Sử dụng useNavigationLoading hook
 */
export function GoodLinkExample() {
  const { push, isPending } = useNavigationLoading();

  return (
    <button
      onClick={() => push('/dashboard/posts')}
      disabled={isPending}
      className={`px-4 py-2 bg-blue-600 text-white rounded ${
        isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
      }`}
    >
      {isPending ? 'Loading...' : 'Go to Posts'}
    </button>
  );
}

/**
 * ✅ EXCELLENT: With Prefetch + Custom Spinner
 */
export function ExcellentLinkExample() {
  const { push, isPending, prefetch } = useNavigationLoading();

  const handleClick = () => {
    push('/dashboard/posts');
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => prefetch('/dashboard/posts')}
      disabled={isPending}
      className={`
        px-4 py-2 bg-blue-600 text-white rounded font-medium
        transition-all duration-200
        ${
          isPending
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-blue-700 hover:shadow-lg'
        }
      `}
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          Loading...
        </span>
      ) : (
        'Go to Posts'
      )}
    </button>
  );
}

/**
 * ✅ ADVANCED: Navigation Progress Bar
 */
('use client');

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationProgressBar() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Reset khi pathname thay đổi
    setProgress(0);
  }, [pathname]);

  // Giả lập progress animation
  useEffect(() => {
    if (progress > 0 && progress < 90) {
      const timer = setTimeout(() => {
        setProgress((prev) => prev + Math.random() * 30);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-blue-600 transition-all duration-300 z-50"
      style={{
        width: `${Math.min(progress, 100)}%`,
        opacity: progress > 0 && progress < 100 ? 1 : 0,
      }}
    />
  );
}

/**
 * ✅ USAGE: Thêm vào root layout
 *
 * import { NavigationProgressBar } from '@/app/components/NavigationProgressBar';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <NavigationProgressBar />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 */
