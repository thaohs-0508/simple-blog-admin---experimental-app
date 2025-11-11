'use client';

import { POSTCARD_CONTENT } from '@/app/lib/constants';
import { DictType } from '@/app/lib/type/dictType';
import Image from 'next/image';
import Link from 'next/link';

interface PostCardProps {
  id: string;
  title: string;
  body: string;
  userId: string;
  locale: string;
  dict: DictType;
  image?: string | null;
}
const DEFAULT_IMAGE = '/images/default_image.png';
export default function RenderPostCard({
  id,
  title,
  body,
  locale,
  dict,
  image,
}: PostCardProps) {
  return (
    <Link href={`/${locale}/dashboard/posts/${id}`}>
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 cursor-pointer">
        {/* Image Container */}
        <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <Image
            src={image || DEFAULT_IMAGE}
            alt={title || POSTCARD_CONTENT.NO_TITLE}
            width={400}
            height={250}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            priority={false}
          />
        </div>

        {/* Content Container */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {typeof title === 'string' && title.trim()
              ? title
              : dict?.dashboard?.posts?.noTitle || POSTCARD_CONTENT.NO_TITLE}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {typeof body === 'string' && body.trim()
              ? body
              : dict?.dashboard?.posts?.noContent ||
                POSTCARD_CONTENT.NO_CONTENT}
          </p>
          <div className="text-blue-600 dark:text-blue-400 font-medium text-sm">
            {dict?.dashboard?.posts?.readMore || POSTCARD_CONTENT.READ_MORE}
          </div>
        </div>
      </div>
    </Link>
  );
}
