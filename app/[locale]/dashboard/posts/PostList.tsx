'use client';

import Link from 'next/link';
import RenderPostCard from './Postcard';
import { PostModel } from '@/app/lib/data/models/postModel';
import { DictType } from '@/app/lib/type/dictType';
import { POST_LIST_CONTENT } from '@/app/lib/constants';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';

export default function RenderPostsList({
  dict,
  locale,
  posts,
}: {
  dict: DictType;
  locale: string;
  posts: PostModel[];
}) {
  const { push } = useNavigationLoading();
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          {dict.dashboard?.posts?.title || POST_LIST_CONTENT.NO_TITLE}
        </h2>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
          {dict.dashboard?.posts?.description || POST_LIST_CONTENT.NO_CONTENT}
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => push(`/${locale}/dashboard/posts/add`)}
          className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded shadow hover:bg-blue-700 dark:hover:bg-blue-600 transition"
        >
          {dict.dashboard?.posts?.addPost || POST_LIST_CONTENT.ADD_POST}
        </button>
      </div>

      <article className="mt-12 grid gap-6 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {posts?.map((post: PostModel, index: number) => {
          const itemId = `post-${post.id}-${String(index)}`;
          return (
            <RenderPostCard
              key={itemId}
              {...post}
              locale={locale}
              dict={dict}
            />
          );
        })}
      </article>
    </div>
  );
}
