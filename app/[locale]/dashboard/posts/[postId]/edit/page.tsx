import { PostModel } from '@/app/lib/data/models/postModel';
import { getDictionary } from '@/app/lib/get-dictionary';
import PostForm from '../../PostForm';
import { getPostById } from '@/app/lib/services/postService';

type Props = {
  params: Promise<{ locale: 'en' | 'vi'; postId: string }>;
};

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
  return (
    <PostForm postId={postId} postCard={post} dict={dict} locale={locale} />
  );
}
