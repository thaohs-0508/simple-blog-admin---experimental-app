import { getDictionary } from '@/app/lib/get-dictionary';

import { PostModel } from '@/app/lib/data/models/postModel';
import RenderPostDetail from './PostDetail.client';
import { getPostById } from '@/app/lib/services/postService';
import { get } from 'http';

type Props = {
  params: Promise<{ locale: 'en' | 'vi'; postId: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { postId, locale } = await params;
  const dict = await getDictionary(locale);
  const post: PostModel | null = await getPostById(postId);
  if (!post) {
    return {
      title: dict?.dashboard?.posts?.notFound || 'Post Not Found',
    };
  }
  return {
    title: post.title,
    description: post.body,
  };
}
export default async function RenderPostPage({ params }: Props) {
  const { postId, locale } = await params;
  const dict = await getDictionary(locale);
  const post: PostModel | null = await getPostById(postId);

  if (!post) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-900 dark:text-white">
          {dict?.dashboard?.posts?.notFound}
        </div>
      </div>
    );
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.body,
    image: post.image || '/images/default-blog.png',
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <RenderPostDetail
        postId={postId}
        locale={locale}
        dict={dict}
        post={post}
      />
    </>
  );
}
